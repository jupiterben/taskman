// @ts-ignore
/* eslint-disable */

export declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TaskItem = {
    name: string;
    progress: number;
    status: string;
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
    tasks: TaskItem[];
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

  // type NoticeIconList = {
  //   data?: NoticeIconItem[];
  //   /** 列表的内容总数 */
  //   total?: number;
  //   success?: boolean;
  // };

  // type NoticeIconItemType = 'notification' | 'message' | 'event';

  // type NoticeIconItem = {
  //   id?: string;
  //   extra?: string;
  //   key?: string;
  //   read?: boolean;
  //   avatar?: string;
  //   title?: string;
  //   status?: string;
  //   datetime?: string;
  //   description?: string;
  //   type?: NoticeIconItemType;
  // };
}
