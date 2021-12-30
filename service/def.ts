
export interface WorkerSendStatus {
    workerId: String;
    status: String;
    content: String;
}

export interface TaskInfo {
    maxFile: String;
    submitter: String;
    animFile: String;
}

export interface JobStatus {
    jobId: String;
    isRunning: boolean;
    totalSubTasks: number;
    finishSubTasks: number;
}