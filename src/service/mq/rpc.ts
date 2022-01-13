import { MQBase } from './base';
import type * as amqplib from 'amqplib';
import { v4 } from 'uuid';
import { sleep } from '../imp/util';

export class RPCServer extends MQBase {
    queue: Promise<{ ch: amqplib.Channel, queue: string }>;
    constructor(url: string) {
        super(url);
        this.queue = this.assertQueue('rpc_' + v4(), { durable: false });
        this.run();
    }

    private async run() {
        const { ch, queue } = await this.queue;
        await ch.prefetch(1);
        await ch.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
            if (!msg) return;
            console.log(msg);
            const result = await this.handlerCall(msg.content.toString());
            const { replyTo, correlationId } = msg.properties;
            ch.sendToQueue(replyTo, Buffer.from(result), { correlationId });
            ch.ack(msg);
        });
    }

    async handlerCall(msg: string) {
        await sleep(3000);
        return msg;
    }
}


export class RPCClient extends MQBase {
    resultQueue: Promise<{ ch: amqplib.Channel, queue: string }>;
    //consumer: Promise<amqplib.ConsumeMessage>;
    resolveMap = new Map<string, (result: string) => void>();
    constructor(url: string) {
        super(url);
        this.resultQueue = this.assertQueue('', { exclusive: true });
        this.run();
    }

    private async run() {
        const { ch, queue } = await this.resultQueue;
        ch.consume(queue, (msg: amqplib.ConsumeMessage | null) => {
            if (!msg) return;
            console.log(msg);
            const resolve = this.resolveMap.get(msg.properties.correlationId);
            resolve && resolve(msg.content.toString());
            this.resolveMap.delete(msg.properties.correlationId);
        }, {});

    }

    private getResult(correlateId: string, timeout: number = 100000) {
        return new Promise<string>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout);
            this.resolveMap.set(correlateId, resolve);

            // return this.consumer.then((msg: amqplib.ConsumeMessage) => {
            //     if (msg.properties.correlationId === correlateId) {
            //         resolve(msg.content.toString());
            //         clearTimeout(timeoutId);
            //     }
            // });
        });
    }

    async call(msg: string, sQueue: string): Promise<any> {
        const { queue, ch } = await this.resultQueue;
        const sQueueAssert = await ch.assertQueue(sQueue, { durable: false });
        const correlationId = v4();
        await ch.sendToQueue(sQueueAssert.queue, Buffer.from(msg), { correlationId, replyTo: queue });
        return await this.getResult(correlationId);
    }
}