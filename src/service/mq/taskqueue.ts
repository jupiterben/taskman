import * as ampqlib from 'amqplib';

class TaskMQBase {
  conn?: ampqlib.Connection;
  ch?: ampqlib.Channel;
  queue?: string;
  async open(broker: string, queueName: string) {
    this.conn = await ampqlib.connect(broker);
    const ch = (this.ch = await this.conn.createChannel());
    const assertQueue = await ch.assertQueue(queueName, { durable: true });
    this.queue = assertQueue.queue;
    return this;
  }
  async close() {
    await this.ch?.close();
    this.ch = undefined;
    await this.conn?.close();
    this.conn = undefined;
  }
}

export class TaskMessageSender extends TaskMQBase {
  send(msg: string): boolean {
    const { ch, queue } = this;
    if (!ch || !queue) return false;
    const ret = ch.sendToQueue(queue, Buffer.from(msg), { deliveryMode: true });
    console.log('Sent %s', msg);
    return ret;
  }
}

export class TaskMessageReceiver extends TaskMQBase {
  async run(broker: string, queueName: string, callback: (msg: string) => boolean) {
    try {
      const { ch, queue } = await this.open(broker, queueName);
      if (!ch || !queue) return;
      await ch?.prefetch(1);
      await ch?.consume(
        queue,
        (msg: ampqlib.ConsumeMessage | null) => {
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
