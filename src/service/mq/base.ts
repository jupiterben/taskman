import * as amqplib from 'amqplib';

export class MQBase {
    channel: Promise<{ conn: amqplib.Connection; ch: amqplib.Channel }>;
    constructor(url: string, opts: any = {}) {
        this.channel = this.open(url, opts);
    }

    async assertQueue(queueName: string, opts: amqplib.Options.AssertQueue | undefined) {
        const { ch } = await this.channel;
        const assertQueue = await ch.assertQueue(queueName, opts);
        return { ch, queue: assertQueue.queue };
    }

    protected async open(url: string, opts: any) {
        const conn = await amqplib.connect(url, opts);
        const ch = await conn.createChannel();
        return { conn, ch };
    }

    /**
     * @method AMQPBackend#close
     * @returns {Promise} promises that continues if amqp disconnected.
     */
    public async close() {
        const { conn, ch } = await this.channel;
        await ch.close();
        await conn.close();
    }
}
