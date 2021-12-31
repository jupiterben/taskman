
import * as ampqlib from 'amqplib';

class TaskMQBase {
    conn: ampqlib.Connection;
    ch: ampqlib.Channel;
    queue: string;
    async open(broker: string, queueName: string) {
        this.conn = await ampqlib.connect(broker);
        const ch = this.ch = await this.conn.createChannel();
        const assertQueue = await ch.assertQueue(queueName, { durable: true });
        this.queue = assertQueue.queue;
        return this;
    }
    async close() {
        await this.ch?.close();
        this.ch = null;
        await this.conn?.close();
        this.conn = null;
    }
}

export class TaskMessageSender extends TaskMQBase {
    send(msg: String): boolean {
        const { ch, queue } = this;
        if (!ch || !queue) return false;
        let ret = ch.sendToQueue(queue, Buffer.from(msg), { deliveryMode: true });
        console.log("Sent %s", msg);
        return ret;
    }
}

export class TaskMessageReceiver extends TaskMQBase {
    async run(broker: string, queueName: string, callback: (msg: string) => boolean) {
        try {
            const { ch, queue } = await this.open(broker, queueName);
            await ch.prefetch(1)
            await ch.consume(queue, (msg: ampqlib.ConsumeMessage) => {
                const content = msg.content.toString();
                console.log("Received %s", msg);
                if (callback(content)) {
                    ch.ack(msg);
                } else {
                    ch.nack(msg);
                }
            }, { noAck: false });
        }
        catch (e) {
            this.close();
        }
    }
}