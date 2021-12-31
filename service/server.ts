
import * as express from 'express';
import { config } from './config';
import { AddressInfo } from 'net';
import * as cors from 'cors';
import { JobAdminService } from './jobScheduler';
import { WorkerAminService } from './workerAdmin';

const app = express();
const workerService = new WorkerAminService();
const jobService = new JobAdminService();

const server = app.listen(80, async function () {
    console.log('Starting Job Scheduler Service...');
    await jobService.start(config.broker, config.backend);

    console.log("Starting Worker Status Service...");
    await workerService.start(config.broker, config.WORKER_STATE_REPORT_QUEUE);

    var addr = server.address() as AddressInfo;
    console.log(`App is Running at ${addr.family}${addr.address}:${addr.port}`);
});
//监听端口
process.once('SIGINT', async function () {
    await workerService.stop();
    await jobService.stop();
});


//静态网站
app.use(express.static('build'));
app.use(cors());

//处理请求
app.get('/runJob', async function (req, res) {
    await jobService.runJob();
    res.send('job is running');
});

app.get('/jobStatus', async function (req, res) {
    const status = jobService.getStatus();
    res.json([status]);
});

app.get('/workerStatus', async function (req, res) {
    const status = workerService.getStatus();
    res.json(status);
});


