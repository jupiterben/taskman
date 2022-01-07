import { Request, Response } from 'express';
import type { API } from '@/types';

function getJobList(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const result: API.JobList = {
    data: [
      {
        name: '动画文件生成Job',
        desc: 'job1 desc',
        status: 'running',
        updateAt: new Date(),
        createdAt: new Date(),
        lastRunTime: new Date(),
        offline: false,
        tasks: [
          {
            name: 'task1',
            desc: 'task1 desc',
            progress: 0,
            status: 'inqueue',
          },
          {
            name: 'task2',
            desc: 'task1 desc',
            progress: 0.5,
            status: 'running',
          },
        ],
      }
    ]
  }
  return res.json(result);
}

export default {
  'GET /api/job': getJobList,
};
