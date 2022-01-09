// @ts-ignore
/* eslint-disable */
export enum TaskStateEnum {
  Start = 0,
  Running = 1,
  Delay = 2,
  Finish = 3,
}

export enum TaskFinishState {
  Success,
  Fail,
  Cancel,
  Exception,
}

export declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TaskMeta = {
    uuid: string;
    name: string;
    args: any[];
    desc?: string;
    customData?: any;
  };
  type TaskResult = {
    meta: TaskMeta;
    state: TaskStateEnum;
    startTime: Date;
    endTime: Date; //or estimate end time
    finishState?: TaskFinishState;
    progress?: number;
    desc?: string;
  };

  type GenAnimFileMetaData = {
    animFileName: string;
    submitter: string;
  };

  type JobStatus = {
    name: string;
    desc: string;
    updateAt: Date;
    lastRunTime: Date;
    tasks: TaskResult[];
  };

  type JobList = {
    data: JobStatus[];
  };

  type WorkerStatus = {
    workerId: string;
    machine: string;
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

