
import * as celery from 'celery-node';
import { config, workerConfig } from './config';
import * as uuid from 'uuid';
import { DirectMessageSender } from './direct';
import { TaskInfo, WorkerSendStatus } from './def';

const worker = celery.createWorker(config.broker, config.backend);
const workerId = uuid.v1();
const statusMsgSender = new DirectMessageSender();
statusMsgSender.open(config.broker, workerConfig.stateReportChannel);

let status: String = "Idle";
let content: String = "";
function sendStatus() {
    const send: WorkerSendStatus = {
        workerId,
        status,
        content,
    };
    statusMsgSender.send(JSON.stringify(send));
}
function updateStatusAndSend(s: string, c: string = "") {
    status = s;
    content = c;
    sendStatus();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function createAnimFile(taskId, taskInfo:TaskInfo) {
    updateStatusAndSend("Working", "tasks.createAnimFile");
    await sleep(30000);
    updateStatusAndSend("Idle");
    return `worker: ${workerId} task:${taskInfo.maxFile} 创建AnimFile成功`
}

async function checkAnimFile(taskId, taskInfo:TaskInfo) {
    updateStatusAndSend("Working", "tasks.checkAnimFile");
    await sleep(60000);
    updateStatusAndSend("Idle");
    return `worker: ${workerId} task:${taskInfo.maxFile} 动画文件通过检查`
}

worker.register("tasks.createAnimFile", createAnimFile);
worker.register("tasks.checkAnimFile", checkAnimFile);

worker.start();
console.log(`${workerId} is Running...`)

const heartBeat = setInterval(sendStatus, workerConfig.heartbeat);

process.once('SIGINT', async function () {
    clearInterval(heartBeat);
    updateStatusAndSend('dead');
    await statusMsgSender.close();
});

