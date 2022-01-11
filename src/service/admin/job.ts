import type { API, TaskFinishState, TaskStateEnum } from '@/api_types';
import type { DirectMessageSender } from '../mq/direct';
import { AdminBase } from './base';

function ToTaskResult(obj: Record<string, unknown>): API.TaskResult {
    return {
        meta: obj.meta as API.TaskMeta,
        state: obj.state as TaskStateEnum,
        finishState: obj.finishState as TaskFinishState,
        desc: obj.desc as string,
        startTime: obj.startTime as number,
        endTime: obj.endTime as number,
        progress: obj.progress as number,
    };
}

export class JobAdmin extends AdminBase {
    private status: Map<string, API.JobStatus> = new Map<string, API.JobStatus>();
    cmdMessageQueue?: DirectMessageSender;

    constructor() {
        super('worker');
    }
    
}
