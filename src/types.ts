// @ts-ignore
/* eslint-disable */

export declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TaskMeta = {
    uuid: string;
    name: string;
    args: string[];
    customData: string;
  };
  type TaskStateData = {
    state: number;
    content: any;
  };
  type TaskResult = {
    meta: TaskMeta;
    state: number;
    finishState: TaskFinishState;
    curProgress: number;
    totalProgress: number;
    desc: string;
  };

  type JobStatus = {
    name: string;
    desc: string;
    status: string;
    updateAt: Date;
    createdAt: Date;
    lastRunTime: Date;
    offline: boolean;
    tasks: TaskResult[];
  };

  type JobList = {
    data: JobStatus[];
  };

  type WorkerStatus = {
    workerId: string;
    desc: string;
    status: string;
    createdAt: Date;
    updateAt: Date;
  };

  type WorkerList = {
    data: WorkerStatus[];
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };
}

export enum TaskStateEnum {
  Start = 0,
  Running = 1,
  Delay = 2,
  Finish = 3
}

export enum TaskFinishState {
  Success,
  Fail,
  Cancel,
  Exception
}