import express from 'express';
import { Config } from './config';
import type { AddressInfo } from 'net';
import cors from 'cors';
import { WorkerAdmin, JobAdmin } from './admin';
import type { API } from '@/api_types';

const app = express();
const workerService = new WorkerAdmin();
const jobService = new JobAdmin();

const server = app.listen(80, async function () {
  try {
    console.log('Starting Job Status Service...');
    await jobService.start(Config.MQ_SERVER, Config.JOB_STATUS_EXCHANGE);

    console.log('Starting Worker Status Service...');
    await workerService.start(Config.MQ_SERVER, Config.WORKER_STATE_REPORT_QUEUE);
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

app.get('/api/job', async function (req, res) {
  const status: API.JobList = { data: jobService.getStatus() };
  res.json(status);
});

app.get('/api/worker', async function (req, res) {
  const status: API.WorkerList = { data: workerService.getStatus() };
  res.json(status);
});
