
import * as express from 'express';
import { SchedulerJob } from './job';
import { config, workerConfig } from './config';
import { WorkerStatusService } from './workerStatus';
import { AddressInfo } from 'net';
import * as cors from 'cors';

var app = express();
var workerStatus = new WorkerStatusService();
workerStatus.start(config.broker, workerConfig.stateReportChannel);
var job = new SchedulerJob();

//静态网站
app.use(express.static('build'));
app.use(cors());

//处理请求
app.get('/runJob', async function (req, res) {
    if (job.isRunning) {
        res.send('job is running');
    } else {
        job.run(config.broker, config.backend);
        res.send('job is running');
    }
});

app.get('/jobStatus', async function (req, res) {
    const status = job.getStatus();
    res.json([status]);
});

app.get('/workerStatus', async function (req, res) {
    const status = workerStatus.getStatus();
    res.json(status);
});

//监听端口
var server = app.listen(80, function () {
    var addr = server.address() as AddressInfo;
    console.log(`应用实例，访问地址为 ${addr.family}${addr.address}:${addr.port}`);
});

process.once('SIGINT', async function () {
    await workerStatus.stop();
});
