import { CreateAnimFileTaskParam, TaskState } from './def';
import { sleep } from './util';
import { Worker } from './worker';

const worker = new Worker();

async function* checkAnimFile(taskInfo: CreateAnimFileTaskParam) {
    yield { state: TaskState.Start, data: `worker: ${worker.id} task: check animation file from ${taskInfo.maxFile}` };
    await sleep(30000);
    yield { state: TaskState.Finish, data: `worker: ${worker.id} task: check animation ${taskInfo.animFile} file successes` };
}

worker.register("tasks.checkAnimFile", checkAnimFile);
worker.start();
