import express from 'express';
import { config } from './config';
import type { AddressInfo } from 'net';
import * as cors from 'cors';
import { TaskScheduler } from './jobScheduler';
import { WorkerAdmin } from './workerAdmin';

const app = express();
const workerService = new WorkerAdmin();
const jobService = new TaskScheduler();

const server = app.listen(80, async function () {
    console.log('Starting Job Scheduler Service...');
    await jobService.start(config.broker, config.backend);

    console.log("Starting Worker Status Service...");
    await workerService.start(config.broker, config.WORKER_STATE_REPORT_QUEUE);

    const addr = server.address() as AddressInfo;
    console.log(`App is Running at ${addr.family}${addr.address}:${addr.port}`);
});
//监听端口
process.once('SIGINT', async function () {
    await workerService.stop();
    await jobService.stop();
});


//静态网站
app.use(express.static('dist'));
app.use(cors());

app.get('/api/job', async function (req, res) {
    const status = jobService.getStatus();
    res.json([status]);
});

app.get('/api/worker', async function (req, res) {
    const status = workerService.getStatus();
    res.json(status);
});
