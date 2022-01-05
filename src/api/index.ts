// @ts-ignore
/* eslint-disable */
import { request } from 'umi';


/** 获取任务列表 GET /api/task */
export async function task(params: API.PageParams, options?: { [key: string]: any }) {
  return request<API.TaskList>('/api/task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function worker() {
  return request<API.WorkerList>('/api/worker', {
    method: 'GET',
  });
}
