
import { config } from './config';
import * as uuid from 'uuid';
import { DirectMessageSender } from './mq/direct';
import type { TaskPayload, TaskStatusData, WorkerStatus } from './def';
import { TaskMessageReceiver } from './mq/taskqueue';

type TaskHandler = (...args: any) => AsyncIterableIterator<TaskStatusData>;

export class Worker {
    id: string;
    statusReporter?: DirectMessageSender;
    status: string = "idle";
    statusContent: string = "";
    heartBeatTimer?: NodeJS.Timer;
    //task
    taskReceiver?: TaskMessageReceiver;
    taskResultSender?: DirectMessageSender;
    activeTasks: Set<Promise<any>> = new Set();
    taskHandlers: Map<string, TaskHandler> = new Map();

    async start() {
        this.statusReporter = new DirectMessageSender();
        this.taskResultSender = new DirectMessageSender();
        await this.taskResultSender.open(config.backend, config.TASK_RESULT_QUEUE);
        await this.statusReporter.open(config.backend, config.WORKER_STATE_REPORT_QUEUE);
        this.heartBeatTimer = setInterval(this.reportStatus.bind(this), config.WORKER_HEARTBEAT_INTERVAL);
        process.once('SIGINT', this.stop.bind(this));

        this.taskReceiver = new TaskMessageReceiver();
        await this.taskReceiver.run(config.broker, config.TASK_QUEUE, this.handleTaskMessage.bind(this));
        console.log(`worker ${this.id} is running...`);
    }

    handleTaskMessage(msg: string): boolean {
        const payload: TaskPayload = JSON.parse(msg);
        const taskName = payload.task;
        if (!this.taskHandlers.has(taskName)) {
            return false;
        }

        const runHandler = async (handler: TaskHandler, args: any[]) => {
            for await (const status of handler(...args)) {
                this.taskResultSender?.send(JSON.stringify({
                    taskId: payload.taskId,
                    status: status.state,
                    data: status.data
                }));
            }
        };

        const handler = this.taskHandlers.get(taskName);
        if (!handler) return false;
        const args = payload.args || [];
        const taskPromise = runHandler(handler, args).finally(() => {
            this.activeTasks.delete(taskPromise);
        });
        // record the executing task
        this.activeTasks.add(taskPromise);
        return true;
    }

    public register(taskName: string, handler: TaskHandler) {
        if (this.taskHandlers.has(taskName)) {
            throw new Error(`task ${taskName} already registered`);
        }
        this.taskHandlers.set(taskName, handler);
    }

    async stop() {
        console.log(`worker ${this.id} is stopping...`);
        this.updateStatus("dead", "");
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer);
            this.heartBeatTimer = undefined;
        }
        if (this.taskReceiver) {
            await this.taskReceiver?.close();
            this.taskReceiver = undefined;
        }
        if (this.taskResultSender) {
            await this.taskResultSender.close();
            this.taskResultSender = undefined;
        }
        if (this.statusReporter) {
            await this.statusReporter?.close();
            this.statusReporter = undefined;
        }
        console.log(`worker ${this.id} is stopped`);
    }

    constructor() {
        this.id = uuid.v4();
    }

    updateStatus(status: string, content: string) {
        this.status = status;
        this.statusContent = content;
        this.reportStatus();
    }

    reportStatus() {
        const send: WorkerStatus = {
            workerId: this.id,
            status: this.status,
            content: this.statusContent
        };
        this.statusReporter?.send(JSON.stringify(send));
    }
}

