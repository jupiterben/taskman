import type * as amqplib from 'amqplib';
import { MQBase } from './base';

export class DirectMQBase extends MQBase {
  queue: Promise<string>;
  constructor(url: string, queueName: string) {
    super(url, {});
    this.queue = this.assertQueue(queueName);
  }
  async assertQueue(queueName: string) {
    const { ch } = await this.channel;
    const assertQueue = await ch.assertQueue(queueName, { durable: false });
    return assertQueue.queue;
  }
}

export class DirectMessageSender extends DirectMQBase {
  async Send(msg: string) {
    const { ch } = await this.channel;
    const queue = await this.queue;
    const ret = ch.publish(queue, '', Buffer.from(msg));
    console.log('Sent %s', msg);
    return ret;
  }
}

/// <summary>
export class DirectMessageReceiver extends DirectMQBase {
  async Run(callback: (msg: string) => void) {
    try {
      const { ch } = await this.channel;
      const queue = await this.queue;
      await ch.consume(
        queue,
        (msg: amqplib.ConsumeMessage | null) => {
          if (!msg) return;
          const content = msg.content.toString();
          console.log('Received %s', content);
          callback(content);
        },
        { noAck: true },
      );
    } catch (e) {
      this.close();
    }
  }
}


