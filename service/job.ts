
import * as celery from 'celery-node';
import { JobStatus, TaskInfo } from './def';

export class SchedulerJob {
    isRunning = false;
    finishSubTasks = 0;
    totalSubTasks = 0;

    async createTask(client, taskInfo) {
        const task = client.createTask("tasks.createAnimFile");
        const result = task.applyAsync([taskInfo]);
        const data = await result.get();
        console.log(data);

        const task2 = client.createTask("tasks.checkAnimFile");
        const result2 = task2.applyAsync([taskInfo]);
        const data2 = await result2.get();
        console.log(data2);

        this.finishSubTasks += 1;
    }

    async run(broker: string, backend: string) {
        const client = celery.createClient(broker, backend);

        const taskInfoList: TaskInfo[] = [];
        for (let i = 0; i < 1000; i++) {
            taskInfoList.push({
                maxFile: "//depot/I_P_016_HK4E_Z/ART/Char/Avatar/Animation_Max/Ani_Avatar_Boy_Bow_Venti/Basics/Ani_Avatar_Boy_Bow_Venti_Death.max",
                submitter: "xxx",
                animFile: "//depot/I_P_016_HK4E_Z/ART/Char/Avatar/AnimationData/Boy/Ani_Avatar_Boy_Bartender_01"
            });
        }

        const taskList = taskInfoList.map((taskInfo) => {
            return this.createTask(client, taskInfo);
        });
        this.isRunning = true;
        this.totalSubTasks = taskList.length;
        this.finishSubTasks = 0;
        try {
            await Promise.all(taskList);
        } catch (e) {
            console.log(e);
        }
        client.disconnect();
        this.isRunning = false;
    }

    getStatus():JobStatus {
        return {
            jobId: "TestJob",
            isRunning: this.isRunning,
            finishSubTasks: this.finishSubTasks,
            totalSubTasks: this.totalSubTasks,
        };
    }
}
