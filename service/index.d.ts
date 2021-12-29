
interface WorkerSendStatus {
    workerId: String;
    status: String;
    content: String;
}

interface TaskInfo {
    maxFile: String;
    submitter: String;
    animFile: String;
}

interface JobStatus {
    jobId: String;
    isRunning: boolean;
    totalSubTasks: number;
    finishSubTasks: number;
}