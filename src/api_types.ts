// @ts-ignore
/* eslint-disable */
export enum TaskStateEnum {
  Created = 0,
  Start = 1,
  Running = 2,
  Delay = 3,
  Finish = 4,
}

export enum TaskFinishState {
  Success,
  Fail,
  Cancel,
  Exception,
}

export enum NodeState {
  Idle,
  Busy,
  Dead,
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
    createdAt: number;
    desc?: string;
    customData?: string;
  };
  type TaskResult = {
    meta: TaskMeta;
    state: TaskStateEnum;
    finishState?: TaskFinishState;
    desc?: string;
    startTime: number;
    endTime: number;      //or estimate end time
    progress?: number;
  };

  type GenAnimFileMetaData = {
    animFileName: string;
    submitter: string;
  };

  type JobStatus = {
    name: string;
    desc: string;
    updateAt: number;
    lastRunTime: number;
    tasks: TaskResult[];
  };

  type JobList = {
    data: JobStatus[];
  };

  type NodeStatus = {
    nodeId: string;
    type: string;
    desc: string;
    cmdQueue: string;
    machineName: string;
    machineIP: string;
    state: NodeState;
    stateDesc: string;
    createdAt: number;
    updateAt: number;
  };

  type NodeList = {
    data: NodeStatus[];
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

