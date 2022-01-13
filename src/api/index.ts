// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import type { API } from '@/api_types';

/** 获取任务列表 GET /api/task */
export async function GetJobs(params?: API.PageParams, options?: { [key: string]: any }) {
  return request<API.JobList>('/api/jobs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function GetWorkers() {
  return request<API.NodeList>('/api/workers', {
    method: 'GET',
  });
}
