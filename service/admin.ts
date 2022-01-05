import { DirectMessageReceiver } from './mq/direct';
import { config } from './config';


export class WorkerAdmin {
    private status: Map<string, API.WorkerStatus> = new Map<string, API.WorkerStatus>();
    private timeout = config.WORKER_OFFLINE_TIMEOUT;
    private msgReceiver?: DirectMessageReceiver;

    async start(broker: string, queueName: string) {
        this.msgReceiver = new DirectMessageReceiver();
        await this.msgReceiver.run(broker, queueName, this.onMessage.bind(this));
    }
    async stop() {
        await this.msgReceiver?.close();
    }

    onMessage(msg: string): void {
        const status: API.WorkerStatus = JSON.parse(msg);
        this.status.set(status.workerId, status);
    }

    getStatus(): API.WorkerStatus[] {
        const invalidWorkerIds: string[] = [];
        this.status.forEach((value, key) => {
            const now = new Date();
            const diff = now.getTime() - value.updateAt;
            if (diff > this.timeout || value.status === 'dead') {
                invalidWorkerIds.push(key);
            }
        });
        invalidWorkerIds.forEach(id => this.status.delete(id));
        return Array.from(this.status.values());
    }
}


export class SchedulerAdmin {

}