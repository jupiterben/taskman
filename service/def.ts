
export interface WorkerStatus {
    workerId: string;
    status: string;
    content: string;
}

export interface CreateAnimFileTaskParam {
    maxFile: string;
    submitter: string;
    animFile: string;
}

export interface TaskStatus {
    taskId: string;
    statusData: TaskStatusData;
}

export interface JobStatus {
    //jobId: string;
    name: string;
    isRunning: boolean;
    taskList: TaskStatus[];
}

export interface TaskPayload {
    taskId: string;
    task: string;
    args: any[];
}

export enum TaskState {
    InQueue,
    Start,
    Running,
    Finish,
}
export interface TaskStatusData {
    state: TaskState;
    data: any;
}