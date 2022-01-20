import { Config } from '../config';
import type { API } from '../../api_types';
import { NodeState } from '../../api_types';
import { BroadCastReceiver } from '../mq/broadcast';
import { RPCClient } from '../mq/rpc';

export type AdminMessage = {
    messageId: string;
    command: string;
    resultQueue: string;
}

export abstract class NodeManager {
    private nodeStatus: Map<string, API.NodeStatus> = new Map<string, API.NodeStatus>();
    readonly nodeType: string;
    protected heartBeatListener?: BroadCastReceiver;
    protected nodeMsgListener?: BroadCastReceiver;
    protected rpcClient?: RPCClient;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
    }

    start(url: string) {
        this.heartBeatListener = new BroadCastReceiver(url, Config.NODE_HEARTBEAT_CHANNEL);
        this.heartBeatListener.run(this.onNodeHeartBeat.bind(this));
        this.nodeMsgListener = new BroadCastReceiver(url, Config.NODE_MESSAGE_CHANNEL);
        this.nodeMsgListener.run(this.onNodeRawMessage.bind(this));
        this.rpcClient = new RPCClient(url);
    }
    async stop() {
        await this.heartBeatListener?.close();
        this.heartBeatListener = undefined;
        await this.rpcClient?.close();
        this.rpcClient = undefined;
    }

    isOnline(itemId: string): boolean {
        if (this.nodeStatus.has(itemId)) {
            const status = this.nodeStatus.get(itemId);
            if (status && (Date.now() - status.updateAt) < Config.NODE_OFFLINE_TIMEOUT) {
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
            rpcQueue: obj.rpcQueue as string,
            stateDesc: obj.stateDesc as string,
        };
        if (status.state === NodeState.Dead) {
            this.setOffline(status.nodeId);
        } else {
            this.nodeStatus.set(status.nodeId, status);
        }
    }

    private onNodeRawMessage(msg: string): void {
        const obj: Record<string, unknown> = JSON.parse(msg);
        this.onNodeMessage(obj.nodeId as string, obj.type as string, obj.content);
    }

    onNodeMessage(nodeId: string, type: string, content: any): void {
        console.log(`[${this.nodeType}] ${nodeId} ${type} ${content}`);
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
