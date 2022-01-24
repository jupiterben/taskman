import type { API} from '../../api_types';
import { NodeType } from '../../api_types';
import { NodeManager } from './base';

// function ToTaskResult(obj: Record<string, unknown>): API.TaskStateDataMsg {
//     return {
//         meta: obj.meta as API.TaskMeta,
//         state: obj.state as TaskStateEnum,
//         finishState: obj.finishState as TaskFinishState,
//         desc: obj.desc as string,
//         startTime: obj.startTime as number,
//         endTime: obj.endTime as number,
//         progress: obj.progress as number,
//     };
// }
function UpdateJobTask(job: API.JobStatus, task: API.TaskStatusMsg) {
    const index = job.tasks.findIndex((t) => t.meta.uuid === task.meta.uuid);
    if (index !== -1) {
        job.tasks.splice(index, 1, task);
    } else {
        job.tasks.push(task);
    }
}

export class JobAdmin extends NodeManager {
    jobStatusList = new Map<string, API.JobStatus>();

    constructor() {
        super(NodeType.Job);
    }

    onNodeMessage(jobId: string, type: string, content: any): void {
        if (type === 'job_status') {
            const jobStatus = content as API.JobStatus;
            this.jobStatusList.set(jobId, jobStatus);
        } else if (type == 'task_status') {
            const taskStatus = content as API.TaskStatusMsg;
            const jobStatus = this.jobStatusList.get(jobId);
            if (jobStatus) {
                UpdateJobTask(jobStatus, taskStatus);
            }
        }
    }

    getJobList(): API.JobStatus[] {
        const nodeList = this.getNodeStatus().map((n) => n.nodeId);
        const ret: API.JobStatus[] = [];
        this.jobStatusList.forEach((jobStatus, key) => {
            if (nodeList.includes(key)) {
                ret.push(jobStatus);
            }
        });
        return ret;
    }
}
