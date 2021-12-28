
import * as celery from 'celery-node';
import { config,workerConfig } from './config';
import * as uuid from 'uuid';
import { DirectMessageSender } from './direct';

const worker = celery.createWorker(config.broker, config.backend);
const workerId = uuid.v1();
const statusMsgSender = new DirectMessageSender();
statusMsgSender.open(config.broker, workerConfig.stateReportChannel);

let status: String = "Idle";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function createAnimFile(taskId, maxFile) {
    status = "Working";
    await sleep(3000);
    status = "Idle";
    return `worker: ${workerId} task:${taskId} 创建AnimFile成功`
}

async function checkAnimFile(taskId, maxFile) {
    status = "Working";
    await sleep(3000);
    status = "Idle";
    return `worker: ${workerId} task:${taskId} 动画文件通过检查`
}

worker.register("tasks.createAnimFile", createAnimFile);
worker.register("tasks.checkAnimFile", checkAnimFile);

worker.start();
console.log(`${workerId} is Running...`)

const heartBeat = setInterval(() => {
    const sendMsg = JSON.stringify({ workerId, status });
    statusMsgSender.send(sendMsg);
}, workerConfig.heartbeat);

process.once('SIGINT', async function () {
    clearInterval(heartBeat);
    await statusMsgSender.close();
});

