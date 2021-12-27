const celery = require('celery-node');
const schedule = require('node-schedule');
const config = require('./config')

class SchedulerJob {
    async createTask(client, taskId) {
        const task = client.createTask("tasks.createAnimFile");
        const result = task.applyAsync([taskId]);
        const data = await result.get();
        console.log(data);

        const task2 = client.createTask("tasks.checkAnimFile");
        const result2 = task2.applyAsync([taskId]);
        const data2 = await result2.get();
        console.log(data2);
    }

    async run() {
        const client = celery.createClient(config.broker, config.backend);
        const taskList = [];
        for (let i = 1; i <= 10; i++) {
            taskList.push(this.createTask(client, i));
        }
        try {
            await Promise.all(taskList);
        } catch (e) {
            console.log(e);
        }
        client.disconnect();
    }
}
const job = new SchedulerJob();

module.exports = job