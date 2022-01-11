// import { Config } from '../config';
// import { TaskMessageSender } from '../mq/taskqueue';
// import * as uuid from 'uuid';
// import { DirectMessageReceiver } from '../mq/direct';
// import { sleep } from './util';

// export class Task {
//   readonly id: string;
//   readonly taskName: string;
//   readonly param: any[];
//   status: TaskStatusData;
//   constructor(name: string, param: any[]) {
//     this.id = uuid.v4();
//     this.taskName = name;
//     this.param = param;
//     this.status = { state: TaskState.InQueue, data: null };
//   }
//   getPayload(): TaskPayload {
//     return {
//       taskId: this.id,
//       task: this.taskName,
//       args: this.param,
//     };
//   }
//   getTaskStatus(): TaskStatus {
//     return {
//       taskId: this.id,
//       statusData: this.status,
//     };
//   }
// }

// export class TaskProducer {
//   taskSender?: TaskMessageSender;
//   taskResultReceiver?: DirectMessageReceiver;
//   taskList: Map<string, Task> = new Map();
//   async start(broker: string, backend: string) {
//     this.taskSender = new TaskMessageSender();
//     await this.taskSender.open(broker, Config.TASK_QUEUE);
//     this.taskResultReceiver = new DirectMessageReceiver();
//     await this.taskResultReceiver.run(
//       backend,
//       Config.TASK_RESULT_QUEUE,
//       this.onTaskResult.bind(this),
//     );
//   }
//   async stop() {
//     await this.taskSender?.close();
//     this.taskSender = undefined;
//     await this.taskResultReceiver?.close();
//     this.taskResultReceiver = undefined;
//   }
//   createTask(taskName: string, param: any[]): Task | null {
//     if (this.taskSender) {
//       const task = new Task(taskName, param);
//       this.taskSender.send(JSON.stringify(task.getPayload()));
//       return task;
//     }
//     return null;
//   }
//   onTaskResult(result: string) {
//     console.log(result);
//   }
// }

// export class TaskScheduler extends TaskProducer {
//   isRunning = false;
//   async runJob() {
//     this.isRunning = true;
//     for (let i = 0; i < 10; i++) {
//       const param: CreateAnimFileTaskParam = {
//         maxFile:
//           '//depot/I_P_016_HK4E_Z/ART/Char/Avatar/Animation_Max/Ani_Avatar_Boy_Bow_Venti/Basics/Ani_Avatar_Boy_Bow_Venti_Death.max',
//         submitter: 'xxx',
//         animFile:
//           '//depot/I_P_016_HK4E_Z/ART/Char/Avatar/AnimationData/Boy/Ani_Avatar_Boy_Bartender_01',
//       };
//       this.createTask('tasks.createAnimFile', [param]);
//       await sleep(2000);
//       this.createTask('tasks.checkAnimFile', [param]);
//       await sleep(2000);
//     }
//     this.isRunning = false;
//   }

//   getStatus(): JobStatus {
//     const taskList = Array.from(this.taskList.values()).map((task) => task.getTaskStatus());
//     return {
//       name: 'AnimFile Job',
//       isRunning: this.isRunning,
//       taskList,
//     };
//   }
// }
