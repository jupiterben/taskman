import * as ampqlib from 'amqplib';

class BroadCastMQBase {
  conn?: ampqlib.Connection;
  ch?: ampqlib.Channel;
  exchange?: string;
  async open(broker: string, exchangeName: string) {
    this.conn = await ampqlib.connect(broker);
    const ch = (this.ch = await this.conn.createChannel());
    const assertEx = await ch.assertExchange(exchangeName, 'fanout', { durable: false });
    const exchange = (this.exchange = assertEx.exchange);
    return { ch, exchange };
  }
  async close() {
    await this.ch?.close();
    await this.conn?.close();
  }
}

export class BroadCastSender extends BroadCastMQBase {
  send(msg: string): boolean {
    const { ch, exchange } = this;
    if (!ch || !exchange) return false;
    const ret = ch.publish(exchange, '', Buffer.from(msg));
    console.log('Sent %s', msg);
    return ret;
  }
}

export class BroadCastReceiver extends BroadCastMQBase {
  async run(broker: string, exchangeName: string, callback: (msg: string) => void) {
    try {
      const { ch, exchange } = await this.open(broker, exchangeName);
      const assertQueue = await ch.assertQueue('', { exclusive: true });
      const queue = assertQueue.queue;
      await ch.bindQueue(queue, exchange, '');
      ch.consume(
        queue,
        (msg: ampqlib.ConsumeMessage | null) => {
          if (!msg) return;
          const content = msg.content.toString();
          console.log('Received %s', msg);
          callback(content);
        },
        { noAck: true },
      );
    } catch (e) {
      this.close();
    }
  }
}
