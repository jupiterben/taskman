import * as ampqlib from 'amqplib';

class DirectMQBase {
  conn?: ampqlib.Connection;
  ch?: ampqlib.Channel;
  queue?: string;
  async open(broker: string, queueName: string) {
    const conn = (this.conn = await ampqlib.connect(broker));
    const ch = (this.ch = await conn.createChannel());
    const assertQueue = await ch.assertQueue(queueName, { durable: false });
    this.queue = assertQueue.queue;
    return this;
  }
  async close() {
    await this.ch?.close();
    await this.conn?.close();
  }
}

export class DirectMessageSender extends DirectMQBase {
  send(msg: string): boolean {
    const { ch, queue } = this;
    if (!ch || !queue) return false;
    const ret = ch.sendToQueue(queue, Buffer.from(msg));
    console.log('Sent %s', msg);
    return ret;
  }
}

/// <summary>
export class DirectMessageReceiver extends DirectMQBase {
  async run(broker: string, queueName: string, callback: (msg: string) => void) {
    try {
      const { ch, queue } = await this.open(broker, queueName);
      if (!ch || !queue) return;
      await ch.consume(
        queue,
        (msg: ampqlib.ConsumeMessage | null) => {
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
