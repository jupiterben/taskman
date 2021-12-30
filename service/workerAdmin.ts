import { DirectMessageReceiver } from './mq/direct';
import { workerConfig } from './config';
import { WorkerStatus } from './def';

interface WorkStatusData {
    workerId: String;
    status: String;
    updateTime: Date;
}
export class WorkerAminService {
    private status: Map<String, WorkStatusData> = new Map<String, WorkStatusData>();
    private timeout = workerConfig.offlineTimeout;
    private msgReceiver: DirectMessageReceiver;

    async start(broker: string, queueName: string) {
        this.msgReceiver = new DirectMessageReceiver();
        await this.msgReceiver.run(broker, queueName, this.onMessage.bind(this));
    }
    async stop() {
        await this.msgReceiver.close();
    }

    onMessage(msg: string): void {
        const msgObj: WorkerStatus = JSON.parse(msg);
        const workerId = msgObj.workerId;
        const status = msgObj.status;
        const updateTime = new Date();
        this.status.set(workerId, { workerId, status, updateTime });
    }

    getStatus(): Array<WorkStatusData> {
        const invalidWorkerIds = [];
        this.status.forEach((value, key) => {
            const now = new Date();
            const diff = now.getTime() - value.updateTime.getTime();
            if (diff > this.timeout || value.status === 'dead') {
                invalidWorkerIds.push(key);
            }
        });
        invalidWorkerIds.forEach(id => this.status.delete(id));
        return Array.from(this.status.values());
    }
}
