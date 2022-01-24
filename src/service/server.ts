import express from 'express';
import { Config } from './config';
import type { AddressInfo } from 'net';
import cors from 'cors';
import type { API } from '@/api_types';
import { WorkerAdmin } from './admin/worker';
import { JobAdmin } from './admin/job';

const app = express();

const workerService = new WorkerAdmin();
const jobService = new JobAdmin();

const server = app.listen(80, async function () {
    try {
        console.log('Starting Job Status Service...');
        await jobService.start(Config.MQ_SERVER);

        console.log('Starting Worker Status Service...');
        await workerService.start(Config.MQ_SERVER);
    } catch (e) {
        console.log(e);
    }
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

//Restful api
const VER = 'v1';

app.get(`/api/${VER}/jobs`, async function (req, res) {
    const status: API.JobList = { data: jobService.getJobList() };
    res.json(status);
});

app.get(`/api/${VER}/workers`, async function (req, res) {
    const status: API.NodeList = { data: workerService.getNodeStatus() };
    res.json(status);
});
