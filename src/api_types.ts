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

export enum NodeType {
  Worker = "Worker",
  Job = "Job",
}

export declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TaskMeta = {
    uuid: string;
    jobId: string;
    userData: string;
    createdAt: number;
    desc?: string;
  };

  type TaskStateDataMsg = {
    state: TaskStateEnum;
    finishState: TaskFinishState;
    curProgress: number;
    totalProgress: number;
    desc: string;
  };

  type TaskStatusMsg = {
    meta: TaskMeta;
    stateData: TaskStateDataMsg;
    startTime: number;
    endTime: number;
  }

  type JobStatus = {
    name: string;
    desc: string;
    tasks: TaskStatusMsg[];
  };

  type JobList = {
    data: JobStatus[];
  };

  type P4User = 
  {
    Id:string;
    FullName:string;
    EmailAddress:string;
  }

  type GenFileUserData = {
    maxFile: string;
    submitter: any;
    changeList: number;
  }

  type NodeStatus = {
    nodeId: string;
    type: string;
    desc: string;
    rpcQueue: string;
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

