import { BroadCastReceiver } from './mq/broadcast';
import { Config } from './config';
import type { API } from '@/types';

abstract class AdminBase {
  protected timeout = Config.WORKER_OFFLINE_TIMEOUT;
  protected msgReceiver?: BroadCastReceiver;

  async start(broker: string, queueName: string) {
    this.msgReceiver = new BroadCastReceiver();
    await this.msgReceiver.run(broker, queueName, this.onMessage.bind(this));
  }
  async stop() {
    await this.msgReceiver?.close();
  }
  abstract onMessage(msg: string): void;
}


export class WorkerAdmin extends AdminBase {
  private status: Map<string, API.WorkerStatus> = new Map<string, API.WorkerStatus>();

  onMessage(msg: string): void {
    const obj: Record<string, unknown> = JSON.parse(msg);
    const status: API.WorkerStatus =
    {
      workerId: obj['workerId'] as string,
      desc: obj['desc'] as string,
      status: obj['status'] as string,
      createdAt: new Date(obj['createAt'] as number),
      updateAt: new Date(obj['updateAt'] as number),
    }
    this.status.set(status.workerId, status);
  }

  getStatus(): API.WorkerStatus[] {
    const invalidWorkerIds: string[] = [];
    this.status.forEach((value, key) => {
      const now = new Date();
      const diff = now.getTime() - value.updateAt.getTime();
      if (diff > this.timeout || value.status === 'Dead') {
        invalidWorkerIds.push(key);
      }
    });
    invalidWorkerIds.forEach((id) => this.status.delete(id));
    return Array.from(this.status.values());
  }
}

export class JobAdmin extends AdminBase {
  private status: Map<string, API.JobStatus> = new Map<string, API.JobStatus>();
  onMessage(msg: string): void {
    const obj: Record<string, unknown> = JSON.parse(msg);
    const status: API.JobStatus =
    {
      name: obj['name'] as string,
      desc: obj['desc'] as string,
      status: obj['status'] as string,
      createdAt: new Date(obj['createAt'] as number),
      updateAt: new Date(obj['updateAt'] as number),
      lastRunTime: new Date(obj['lastRunTime'] as number),
      tasks: obj['tasks'] as API.TaskItem[],
      offline: obj['offline'] as boolean,
    }
    this.status.set(status.name, status);
  }

  getStatus(): API.JobStatus[] {
    this.status.forEach((value,) => {
      const now = new Date();
      const diff = now.getTime() - value.updateAt.getTime();
      if (diff > this.timeout) {
        value.offline = true;
      }
    });
    return Array.from(this.status.values());
  }
}
