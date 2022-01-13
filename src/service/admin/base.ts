import { Config } from '../config';
import type { API } from '@/api_types';
import { NodeState } from '@/api_types';
import { DirectSender } from '../mq/direct';
import { v4 } from 'uuid';
import { BroadCastReceiver } from '../mq/broadcast';

export type AdminMessage = {
    messageId: string;
    command: string;
    resultQueue: string;
}

export abstract class NodeManager {
    protected timeout = Config.NODE_OFFLINE_TIMEOUT;
    protected heartBeatListener?: BroadCastReceiver;

    private nodeStatus: Map<string, API.NodeStatus> = new Map<string, API.NodeStatus>();
    readonly nodeType: string;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
    }

    start(url: string) {
        this.heartBeatListener = new BroadCastReceiver(url, Config.NODE_HEARTBEAT_BROADCAST);
        this.heartBeatListener.run(this.onNodeHeartBeat.bind(this));
    }
    async stop() {
        await this.heartBeatListener?.close();
        this.heartBeatListener = undefined;
    }

    isOnline(itemId: string): boolean {
        if (this.nodeStatus.has(itemId)) {
            const status = this.nodeStatus.get(itemId);
            if (status && (Date.now() - status.updateAt) < this.timeout) {
                return true;
            }
        }
        return false;
    }

    setOffline(itemId: string) {
        this.nodeStatus.delete(itemId);
    }

    onNodeHeartBeat(msg: string): void {
        const obj: Record<string, unknown> = JSON.parse(msg);
        if (obj.type !== this.nodeType) return;
        const status: API.NodeStatus = {
            nodeId: obj.nodeId as string,
            desc: obj.desc as string,
            state: obj.state as NodeState,
            createdAt: obj.createdAt as number,
            updateAt: Date.now(),
            machineName: obj.machineName as string,
            machineIP: obj.machineIP as string,
            type: obj.type as string,
            cmdQueue: obj.cmdQueue as string,
            stateDesc: obj.stateDesc as string,
        };
        if (status.state === NodeState.Dead) {
            this.setOffline(status.nodeId);
        } else {
            this.nodeStatus.set(status.nodeId, status);
        }
    }

    getNodeStatus(): API.NodeStatus[] {
        const invalidNodes: string[] = [];
        this.nodeStatus.forEach((value, key) => {
            if (!this.isOnline(key)) {
                invalidNodes.push(key);
            }
        });
        invalidNodes.forEach(this.setOffline.bind(this));
        return Array.from(this.nodeStatus.values());
    }

    async sendCommand(nodeId: string, command: string): Promise<any> {
        const nodeStatus = this.nodeStatus.get(nodeId);
        if (!nodeStatus) {
            throw new Error(`node ${nodeId} is offline`);
        }
        const sender = new DirectSender(Config.MQ_SERVER, nodeStatus.cmdQueue);
        const adminMessage: AdminMessage = {
            messageId: v4(),
            command,
            resultQueue: '',
        }
        sender.Send(JSON.stringify(adminMessage));
    }

}