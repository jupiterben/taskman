import { API, TaskStateEnum } from '../src/api_types';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto'

function genTask(num: number) {
  const tasks: API.TaskResult[] = [];
  for (let i = 0; i < num; i++) {
    const task: API.TaskResult = {
      meta: { uuid: '1', name: 'task1', args: ['1', '2'], customData: { animFileName: randomBytes(16).toString("hex"), submitter: "binfu" } },
      state: TaskStateEnum.Running,
      startTime: new Date(),
      endTime: new Date(),
    };
    tasks.push(task);
  }
  return tasks;
}
const tasks = genTask(100);

function getJobList(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const result: API.JobList = {
    data: [
      {
        name: '动画文件生成任务',
        desc: 'job1 desc',
        updateAt: new Date(),
        lastRunTime: new Date(),
        tasks: tasks
      }
    ]
  }
  return res.json(result);
}

export default {
  'GET /api/job': getJobList,
};

