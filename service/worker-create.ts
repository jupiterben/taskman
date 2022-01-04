import { CreateAnimFileTaskParam, TaskState, TaskStatusData } from './def';
import { sleep } from './util';
import { Worker } from './worker';

const worker = new Worker();

async function* createAnimFile(taskInfo: CreateAnimFileTaskParam): AsyncIterableIterator<TaskStatusData> {
    yield { state: TaskState.Start, data: `worker: ${worker.id} task:${taskInfo.maxFile} 动画文件开始生成` };
    await sleep(30000);
    yield { state: TaskState.Running, data: `worker: ${worker.id} task:${taskInfo.maxFile} 动画文件生成完成` };
    await sleep(30000);
    yield { state: TaskState.Finish, data: `worker: ${worker.id} task:${taskInfo.maxFile} 动画文件生成结束` };
}

worker.register("tasks.createAnimFile", createAnimFile);
worker.start();
