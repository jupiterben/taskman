
import * as express from 'express';
import { SchedulerJob } from './job';
import { config, workerConfig } from './config';
import { WorkerStatusService } from './workerStatus';
import { AddressInfo } from 'net';

var app = express();
var workerStatus = new WorkerStatusService();
workerStatus.start(config.broker, workerConfig.stateReportChannel);
app.use(express.static('build'));

app.get('/runJob', async function (req, res) {
    const job = new SchedulerJob();
    await job.run(config.broker, config.backend);
    res.send("执行成功")
});

app.get('/workerStatus', async function (req, res) {
    const status = workerStatus.getStatus();
    res.send(JSON.stringify(status));
});

var server = app.listen(80, function () {
    var addr = server.address() as AddressInfo;
    console.log(`应用实例，访问地址为 ${addr.family}${addr.address}:${addr.port}`);
});