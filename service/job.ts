
import * as celery from 'celery-node';

export class SchedulerJob {
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

    async run(broker:string, backend:string) {
        const client = celery.createClient(broker, backend);
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

