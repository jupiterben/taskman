import { DirectMessageReceiver } from './direct';
import { workerConfig } from './config';

interface WorkStatusData {
    status: string;
    updateTime: Date;
}

export class WorkerStatusService {
    private status: Map<String, WorkStatusData> = new Map<String, WorkStatusData>();
    private timeout = workerConfig.offlineTimeout;
    private msgReceiver: DirectMessageReceiver;

    async start(broker: string, queueName: string) {
        this.msgReceiver = new DirectMessageReceiver();
        await this.msgReceiver.run(broker, queueName, this.onMessage.bind(this));
    }

    onMessage(msg: string): void {
        const msgObj = JSON.parse(msg);
        const status = msgObj.status;
        const updateTime = new Date();
        this.status.set(msgObj.workerId, { status, updateTime });
    }

    getStatus() {
        const invalidWorkerIds = [];
        this.status.forEach((value, key) => {
            const now = new Date();
            const diff = now.getTime() - value.updateTime.getTime();
            if (diff > this.timeout) {
                invalidWorkerIds.push(key);
            }
        });
        invalidWorkerIds.forEach(id => this.status.delete(id));
        return this.status;
    }
}
