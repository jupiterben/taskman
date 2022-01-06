import express from 'express';
import { Config } from './config';
import type { AddressInfo } from 'net';
import cors from 'cors';
import { WorkerAdmin } from './admin';
import type { API } from '@/types';

const app = express();
const workerService = new WorkerAdmin();

const server = app.listen(80, async function () {
  console.log('Starting Worker Status Service...');
  await workerService.start(Config.MQ_SERVER, Config.WORKER_STATE_REPORT_QUEUE);

  const addr = server.address() as AddressInfo;
  console.log(`App is Running at ${addr.family}${addr.address}:${addr.port}`);
});
//监听端口
process.once('SIGINT', async function () {
  await workerService.stop();
});

//静态网站
app.use(express.static('dist'));
app.use(cors());

app.get('/api/task', async function (req, res) {
  const status = {}; //jobService.getStatus();
  res.json([status]);
});

app.get('/api/worker', async function (req, res) {
  const status: API.WorkerList = { data: workerService.getStatus() };
  res.json(status);
});
