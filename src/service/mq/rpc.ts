import { MQBase } from './base';
import type * as amqplib from 'amqplib';
import { v4 } from 'uuid';

export async function EchoHandler(msg: string) {
    return msg;
}

class RPCBase extends MQBase {
    async assertServerQueue(queueName: string) {
        return await this.assertQueue(queueName, { durable: false })
    }

    async assertClientQueue() {
        return await this.assertQueue('', { exclusive: true });
    }
}


export class RPCServer extends RPCBase {
    queue: Promise<{ ch: amqplib.Channel, queue: string }>;
    handler: (msg: string) => Promise<string>;
    constructor(url: string, handler = EchoHandler) {
        super(url);
        this.handler = handler;
        this.queue = this.assertServerQueue('rpc_' + v4());
        this.run();
    }

    private async run() {
        const { ch, queue } = await this.queue;
        await ch.prefetch(1);
        ch.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
            if (!msg) return;
            ch.ack(msg);
            const { replyTo, correlationId } = msg.properties;
            const result = await this.handler(msg.content.toString());
            ch.sendToQueue(replyTo, Buffer.from(result), { correlationId });
        });
    }
}


export class RPCClient extends RPCBase {
    resultQueue: Promise<{ ch: amqplib.Channel, queue: string }>;
    resolveMap = new Map<string, (result: string) => void>();
    constructor(url: string) {
        super(url);
        this.resultQueue = this.assertClientQueue();
        this.run();
    }

    private async run() {
        const { ch, queue } = await this.resultQueue;
        ch.consume(queue, (msg: amqplib.ConsumeMessage | null) => {
            if (!msg) return;
            const resolve = this.resolveMap.get(msg.properties.correlationId);
            if (resolve) resolve(msg.content.toString());
            this.resolveMap.delete(msg.properties.correlationId);
        });
    }

    private getResult(correlateId: string, timeout: number = 100000) {
        return new Promise<string>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout);
            this.resolveMap.set(correlateId, (msg: string) => {
                resolve(msg);
                clearTimeout(timeoutId);
            });
        });
    }

    async call(msg: string, sQueueName: string): Promise<any> {
        const { queue, ch } = await this.resultQueue;
        const sQueue = (await this.assertServerQueue(sQueueName)).queue;
        const correlationId = v4();
        await ch.sendToQueue(sQueue, Buffer.from(msg), { correlationId, replyTo: queue });
        return await this.getResult(correlationId);
    }
}