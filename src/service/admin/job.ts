import type { DirectMessageSender } from '../mq/direct';
import { NodeManager } from './base';

// function ToTaskResult(obj: Record<string, unknown>): API.TaskResult {
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

export class JobAdmin extends NodeManager {
    cmdMessageQueue?: DirectMessageSender;

    constructor() {
        super('JobScheduler');
    }
    
}
