using AniTaskCommon;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;


namespace AniTask
{
    public class JobStatus
    {
        public string name;
        public string state;
        public string desc;
        public double updateAt;
        public List<TaskStatusObj> tasks;
    }

    public class Command
    {
        public string name;
    }

    public abstract class JobNode : AniNode
    {
        protected WorkQueuePublisher taskSender;
        protected BroadcastReceiver taskResultReceiver;
        protected BroadcastReceiver adminCmdReceiver;
        public string name { get; } //instance id;

        Dictionary<string, TaskStatusObj> taskList = new Dictionary<string, TaskStatusObj>();

        protected JobNode(string name)
        {
            this.name = name;
        }

        public void Start()
        {
            base.Start(Config.JOB_STATUS_EXCHANGE);
            this.taskSender = new WorkQueuePublisher();
            this.taskSender.Open(Config.MQ_SERVER, Config.TASK_QUEUE);
            this.taskResultReceiver = new BroadcastReceiver();
            this.adminCmdReceiver = new BroadcastReceiver();
            this.taskResultReceiver.Run(Config.MQ_SERVER, Config.TASK_RESULT_QUEUE, TaskResultMessage);
            this.adminCmdReceiver.Run(Config.MQ_SERVER, Config.JOB_COMMAND_QUEUE, CommandMessage);
        }

        public override void Stop()
        {
            base.Stop();
            this.taskSender?.Close();
            this.taskSender = null;
            this.taskResultReceiver?.Close();
            this.taskResultReceiver = null;
        }

        protected void StartTask(TaskMeta meta)
        {
            string msg = JsonConvert.SerializeObject(meta);
            this.taskSender.Send(msg);
            var taskResult = new TaskStatusObj() { meta = meta };
            taskResult.UpdateState(TaskStateData.Created);
            this.taskList.Add(meta.uuid, taskResult);
        }

        void TaskResultMessage(string result)
        {
            var taskResult = JsonConvert.DeserializeObject<TaskResultObj>(result);
            OnTaskResult(taskResult);
        }
        public void CommandMessage(string cmd)
        {
            var command = JsonConvert.DeserializeObject<Command>(cmd);
            OnCommand(command);
        }

        public virtual void OnCommand(Command cmd)
        {

        }

        protected virtual void OnTaskResult(TaskResultObj result)
        {
            if (taskList.ContainsKey(result.meta.uuid))
            {
                var status = taskList[result.meta.uuid];
                status.UpdateState(result.GetStateData());
            }
        }

//         protected override void ReportStatus()
//         {
//             var status = new JobStatus
//             {
//                 name = this.name,
//                 state = this.status,
//                 updateAt = Utils.Now(),
//                 desc = this.statusDesc,
//                 tasks = this.taskList.Values.ToList(),
//             };
//             var msg = JsonConvert.SerializeObject(status);
//             this.SendReport(msg);
//         }
    }
}
