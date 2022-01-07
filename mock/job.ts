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
        name: '动画文件生成任务',
        desc: 'job1 desc',
        status: 'running',
        updateAt: new Date(),
        createdAt: new Date(),
        lastRunTime: new Date(),
        offline: false,
        tasks: [
          {
            meta: { uuid: '1', name: 'task1', args: ['1', '2'], customData: 'customData' },
            stateData: { state: 1, content: 'content' },
          },
          {
            meta: { uuid: '2', name: 'task1', args: ['1', '2'], customData: 'customData' },
            stateData: { state: 1, content: 'content' },
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
