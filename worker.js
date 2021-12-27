const celery = require('celery-node');
const config = require('./config');
const uuid = require('uuid');
const ampqlib = require('amqplib')

const worker = celery.createWorker(config.broker, config.backend);
const workerId = uuid.v1();

const status = "Idle"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function createAnimFile(taskId, maxFile) {
    await sleep(3000);
    return `worker: ${workerId} task:${taskId} 创建AnimFile成功`
}

async function checkAnimFile(taskId, maxFile) {
    await sleep(3000);
    return `worker: ${workerId} task:${taskId} 动画文件通过检查`
}


worker.register("tasks.createAnimFile", createAnimFile);
worker.register("tasks.checkAnimFile", checkAnimFile);

worker.start();
console.log(`${workerId} is Running...`)

async function onBroadcast(callback) {
    try {
        const conn = await ampqlib.connect(config.broker);
        process.once('SIGINT', function () { conn.close(); });
        const ch = await conn.createChannel();

        const ExChangeName = conf.broadcastName;
        await ch.assertExchange(ExChangeName, 'fanout', { durable: false });
        const assertQueue = await ch.assertQueue('', { exclusive: true });
        const queue = assertQueue.queue;
        await ch.bindQueue(queue, ExChangeName, '');
        ch.consume(queue, callback, { noAck: true });
        console.log(`Waiting for broadcast message`);
    } catch (e) {
        console.warn(e);
    }
}

onBroadcast((msg) => {
    console.log(msg)
});
