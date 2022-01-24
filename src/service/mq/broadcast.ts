import type * as amqplib from 'amqplib';
import { MQBase } from './base';

export class BroadCastMQBase extends MQBase {
    exchange: Promise<string>;
    constructor(url: string, exchangeName: string) {
        super(url, {});
        this.exchange = this.assertExChange(exchangeName);
    }

    private async assertExChange(exchangeName: string) {
        const { ch } = await this.channel;
        const assertEx = await ch.assertExchange(exchangeName, 'fanout', { durable: false });
        return assertEx.exchange;
    }
}

export class BroadCastSender extends BroadCastMQBase {
    async send(msg: string) {
        const { ch } = await this.channel;
        const exchange = await this.exchange;
        const ret = ch.publish(exchange, '', Buffer.from(msg));
        console.log('Sent %s', msg);
        return ret;
    }
}

export class BroadCastReceiver extends BroadCastMQBase {
    async run(callback: (msg: string) => void) {
        const { ch } = await this.channel;
        const exchange = await this.exchange;
        const assertQueue = await ch.assertQueue('', { exclusive: true });
        const queue = assertQueue.queue;
        await ch.bindQueue(queue, exchange, '');
        ch.consume(
            queue,
            (msg: amqplib.ConsumeMessage | null) => {
                if (!msg) return;
                const content = msg.content.toString();
                console.log('Received %s', msg);
                callback(content);
            },
            { noAck: true },
        );
    }
}
