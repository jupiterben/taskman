
export interface WorkerStatus {
    workerId: String;
    status: String;
    content: String;
}

export interface CreateAnimFileTaskParam {
    maxFile: String;
    submitter: String;
    animFile: String;
}

export interface JobStatus {
    jobId: String;
    isRunning: boolean;
    totalTasks: number;
    finishTasks: number;
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