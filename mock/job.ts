import { API, TaskStateEnum } from '../src/api_types';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto'
import { v4 } from 'uuid';

function genTask(num: number) {
  const tasks: API.TaskResult[] = [];
  for (let i = 0; i < num; i++) {
    const customData = { animFileName: randomBytes(16).toString("hex"), submitter: "binfu" } 

    const task: API.TaskResult = {
      meta: { uuid: v4(), name: 'task1', args: ['1', '2'], customData: JSON.stringify(customData) },
      state: TaskStateEnum.Running,
      startTime: Date.now(),
      endTime: Date.now(),
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
        updateAt: Date.now(),
        lastRunTime: Date.now(),
        tasks: tasks
      }
    ]
  }
  return res.json(result);
}

export default {
  'GET /api/job': getJobList,
};

