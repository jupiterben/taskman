
import { config, workerConfig } from './config';
import * as uuid from 'uuid';
import { DirectMessageSender } from './mq/direct';
import { TaskPayload, TaskStatusData, WorkerStatus } from './def';
import { TaskMessageReceiver } from './mq/taskqueue';

type TaskHandler = (...args) => AsyncIterableIterator<TaskStatusData>;
export class Worker {
    id: String;
    statusReporter: DirectMessageSender;
    status: String = "idle";
    statusContent: String = "";
    heartBeatTimer;
    //task
    taskReceiver: TaskMessageReceiver;
    taskResultSender: DirectMessageSender;
    activeTasks: Set<Promise<any>> = new Set();
    taskHandlers: Map<String, TaskHandler> = new Map();

    async start() {
        this.statusReporter = new DirectMessageSender();
        this.taskResultSender = new DirectMessageSender();
        await this.taskResultSender.open(config.backend, config.TASK_RESULT_QUEUE);
        await this.statusReporter.open(config.backend, config.WORKER_STATE_REPORT_QUEUE);
        this.heartBeatTimer = setInterval(this.reportStatus.bind(this), workerConfig.heartbeatInterval);
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
                this.taskResultSender.send(JSON.stringify({
                    taskId: payload.taskId,
                    status: status.state,
                    data: status.data
                }));
            }
        };

        const handler = this.taskHandlers.get(taskName);
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
        this.heartBeatTimer && clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = null;
        await this.taskReceiver?.close();
        this.taskReceiver = null;
        await this.taskResultSender?.close();
        this.taskResultSender = null;
        await this.statusReporter?.close();
        this.statusReporter = null;
        console.log(`worker ${this.id} is stopped`);
    }

    constructor() {
        this.id = uuid.v4();
    }

    updateStatus(status: String, content: String) {
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
        this.statusReporter.send(JSON.stringify(send));
    }
}

