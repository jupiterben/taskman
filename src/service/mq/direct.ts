import type * as amqplib from 'amqplib';
import { MQBase } from './base';

export class DirectMQBase extends MQBase {
    queue: Promise<{ ch: amqplib.Channel; queue: string }>;
    constructor(url: string, queueName: string) {
        super(url, {});
        this.queue = this.assertQueue(queueName, { durable: false });
    }
}

export class DirectSender extends DirectMQBase {
    async Send(msg: string) {
        const { ch, queue } = await this.queue;
        const ret = ch.publish(queue, '', Buffer.from(msg));
        console.log('Sent %s', msg);
        return ret;
    }
}

/// <summary>
export class DirectReceiver extends DirectMQBase {
    async Run(callback: (msg: string) => void) {
        try {
            const { ch, queue } = await this.queue;
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
