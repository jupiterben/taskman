
import * as ampqlib from 'amqplib';

class DirectMQBase {
    conn: ampqlib.Connection;
    ch: ampqlib.Channel;
    queue: string;
    async open(broker: string, queueName: string) {
        this.conn = await ampqlib.connect(broker);
        this.ch = await this.conn.createChannel();
        const assertQueue = await this.ch.assertQueue(queueName, { durable: false });
        this.queue = assertQueue.queue;
    }
    async close() {
        await this.ch?.close();
        await this.conn?.close();
    }
}

export class DirectMessageSender extends DirectMQBase {
    send(msg): boolean {
        let ret = false;
        if (this.queue) {
            ret = this.ch.sendToQueue(this.queue, Buffer.from(msg));
            console.log("Sent %s", msg);
        }
        return ret;
    }
}

/// <summary>
export class DirectMessageReceiver extends DirectMQBase {
    async run(broker: string, queueName: string, callback: (string) => void) {
        try {
            await this.open(broker, queueName);
            this.ch.consume(this.queue, (cmsg: ampqlib.ConsumeMessage) => {
                const msg = cmsg.content.toString();
                console.log("Received %s", msg);
                callback && callback(msg)
            }, { noAck: true });
        }
        catch (e) {
            this.close();
        }
    }
}
