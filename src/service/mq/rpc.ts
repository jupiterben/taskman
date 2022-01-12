import { MQBase } from './base';
import type * as amqplib from 'amqplib';
import { v4 } from 'uuid';

export class RPCServer extends MQBase {
    queue: Promise<string>;
    constructor(url: string) {
        super(url);
        this.queue = this.assertQueue('rpc_' + v4(), { durable: false });
    }

    async run() {
        const { ch } = await this.channel;
        const queue = await this.queue;
        await ch.prefetch(1);
        await ch.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
            if (!msg) return;
            const result = await this.handlerCall(msg.content.toString());
            const { replyTo, correlationId } = msg.properties;
            ch.sendToQueue(replyTo, Buffer.from(result), { correlationId });
            ch.ack(msg);
        });
    }

    async handlerCall(msg: string) {
        return msg;
    }
}


export class RPCClient extends MQBase {
    resultQueue: Promise<string>;
    consumer: Promise<amqplib.ConsumeMessage>;
    constructor(url: string) {
        super(url);
        this.resultQueue = this.assertQueue('', { exclusive: true });
        this.consumer = this.run();
    }

    async run() {
        const { ch } = await this.channel;
        const queue = await this.resultQueue;
        return new Promise<amqplib.ConsumeMessage>((resolve) => {
            ch.consume(queue, (msg: amqplib.ConsumeMessage | null) => {
                if (!msg) return;
                resolve(msg);
            }, { noAck: true });
        });
    }

    getResult(correlateId: string, timeout: number = 100000) {
        return new Promise<string>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout);

            this.consumer.then((msg: amqplib.ConsumeMessage) => {
                if (msg.properties.correlationId === correlateId) {
                    resolve(msg.content.toString());
                    clearTimeout(timeoutId);
                }
            });
        });
    }

    async call(msg: string, sQueue: string): Promise<any> {
        const { ch } = await this.channel;
        const sQueueAssert = await ch.assertQueue(sQueue, { durable: false });
        const correlationId = v4();
        const replyTo = await this.resultQueue;
        await ch.sendToQueue(sQueueAssert.queue, Buffer.from(msg), { correlationId, replyTo });
        return await this.getResult(correlationId);
    }
}