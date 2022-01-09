// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import type { API } from '@/api_types';

/** 获取任务列表 GET /api/task */
export async function GetJob(params?: API.PageParams, options?: { [key: string]: any }) {
  return request<API.JobList>('/api/job', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function GetWorker() {
  return request<API.WorkerList>('/api/worker', {
    method: 'GET',
  });
}
