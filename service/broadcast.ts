const ampqlib = require('amqplib')

export async function BroadCastSend(msg, broker, exchangeName) {
    const conn = await ampqlib.connect(broker);
    const ch = await conn.createChannel();
    await ch.assertExchange(exchangeName, 'fanout', { durable: false });
    ch.publish(exchangeName, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    await ch.close();
    await conn.close();
}

export async function BroadcastRecv(callback, broker, exchangeName) {
    try {
        const conn = await ampqlib.connect(broker);
        process.once('SIGINT', function () { conn.close(); });
        const ch = await conn.createChannel();

        await ch.assertExchange(exchangeName, 'fanout', { durable: false });
        const assertQueue = await ch.assertQueue('', { exclusive: true });
        const queue = assertQueue.queue;
        await ch.bindQueue(queue, exchangeName, '');
        ch.consume(queue, callback, { noAck: true });
        console.log(`Waiting for broadcast message`);
    } catch (e) {
        console.warn(e);
    }
}

