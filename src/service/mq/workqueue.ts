import type * as amqplib from 'amqplib';
// import { Config } from '../config';
import { MQBase } from './base';

class WorkMQBase extends MQBase {
    queue: Promise<{ ch: amqplib.Channel; queue: string }>;
    constructor(url: string, queueName: string) {
        super(url, {});
        this.queue = this.assertQueue(queueName, { durable: true });
    }
}

export class WorkSender extends WorkMQBase {
    async send(taskMsg: string, replyTo?: string) {
        const { ch, queue } = await this.queue;
        const ret = ch.sendToQueue(queue, Buffer.from(taskMsg), { deliveryMode: true, replyTo });
        console.log('Sent %s', taskMsg);
        return ret;
    }
}

export class WorkConsumer extends WorkMQBase {
    async run(callback: (msg: string) => Promise<boolean>) {
        const { ch, queue } = await this.queue;
        await ch.prefetch(1);
        await ch.consume(
            queue,
            async (msg: amqplib.ConsumeMessage | null) => {
                if (!msg) return;
                const content = msg.content.toString();
                if (await callback(content)) {
                    ch.ack(msg);
                } else {
                    ch.nack(msg);
                }
            },
            { noAck: false },
        );
    }
}
