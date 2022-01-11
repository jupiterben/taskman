import type { BroadCastSender } from '../mq/broadcast';
import { BroadCastReceiver } from '../mq/broadcast';
import { Config } from '../config';
import type { API } from '@/api_types';
import { NodeState } from '@/api_types';

export abstract class AdminBase {
    protected timeout = Config.NODE_OFFLINE_TIMEOUT;
    protected nodeHeartBeatReceiver?: BroadCastReceiver;
    protected nodeCommandSender?: BroadCastSender;
    
    private nodeStatus: Map<string, API.NodeStatus> = new Map<string, API.NodeStatus>();
    adminNodeType: string;

    constructor(nodeType: string) {
        this.adminNodeType = nodeType;
    }

    async start() {
        this.nodeHeartBeatReceiver = new BroadCastReceiver();
        await this.nodeHeartBeatReceiver.run(Config.MQ_SERVER, Config.NODE_HEARTBEAT_QUEUE, this.onNodeHeartBeat.bind(this));
    }
    async stop() {
        await this.nodeHeartBeatReceiver?.close();
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
        if (obj.type !== this.adminNodeType) return;
        const status: API.NodeStatus = {
            nodeId: obj.nodeId as string,
            desc: obj.desc as string,
            state: obj.state as NodeState,
            createdAt: obj.createdAt as number,
            updateAt: Date.now(),
            machineName: obj.machineName as string,
            machineIP: obj.machineIP as string,
            type: obj.type as string,
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
}