import type * as amqplib from 'amqplib';
import { Config } from '../config';
import { MQBase } from './base';

class TaskMQBase extends MQBase {
  queue: Promise<{ ch: amqplib.Channel, queue: string }>;
  constructor(url: string, queueName: string) {
    super(url, {});
    this.queue = this.assertQueue(queueName, { durable: true });
  }
}

export class TaskSender extends TaskMQBase {
  async Send(msg: string) {
    const { ch, queue } = await this.queue;
    const ret = ch.sendToQueue(queue, Buffer.from(msg), { deliveryMode: true });
    console.log('Sent %s', msg);
    return ret;
  }
}

export class TaskReceiver extends TaskMQBase {
  async Run(callback: (msg: string) => boolean) {
    try {
      const { ch, queue } = await this.queue;
      await ch.prefetch(1);
      await ch.consume(queue,
        (msg: amqplib.ConsumeMessage | null) => {
          if (!msg) return;
          const content = msg.content.toString();
          console.log('Received %s', msg);
          if (callback(content)) {
            ch.ack(msg);
          } else {
            ch.nack(msg);
          }
        },
        { noAck: false },
      );
    } catch (e) {
      this.close();
    }
  }
}


export class TaskResultBackEnd extends MQBase {
  private getOpts() {
    return {
      durable: true,
      autoDelete: true,
      exclusive: false,
      // nowait: false,
      arguments: { "x-expires": Config.TASK_RESULT_EXPIRES }
    }
  }

  public async storeResult(taskId: string, result: any) {
    const queueName = taskId.replace(/-/g, "");
    const { ch } = await this.channel;
    const assertQueue = await ch.assertQueue(queueName, this.getOpts());
    const msg =
    {
      taskId: taskId,
      result: result,
      timestamp: Date.now()
    }
    const buffer = Buffer.from(JSON.stringify(msg));
    ch.publish("", assertQueue.queue, buffer);
  }

  consumeOnce(ch: amqplib.Channel, queue: string, timeout?: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let timeoutId: NodeJS.Timeout;
      if (timeout) {
        timeoutId = setTimeout(() => {
          reject(new Error("timeout"));
        }, timeout);
      }
      const consume = await ch.consume(queue, (msg: amqplib.ConsumeMessage | null) => {
        if (msg != null) {
          const body = msg.content.toString("utf-8");
          resolve(JSON.parse(body));
        } else {
          reject("no message");
        }
        if (timeoutId) clearTimeout(timeoutId);
        ch.cancel(consume.consumerTag);
      }, { noAck: true });
    });
  }

  public async getResult(taskId: string): Promise<any> {
    const queueName = taskId.replace(/-/g, "");
    const { ch } = await this.channel;
    const assertQueue = await ch.assertQueue(queueName, this.getOpts());
    const result = await this.consumeOnce(ch, assertQueue.queue);
    ch.deleteQueue(assertQueue.queue);
    return result;
  }
}