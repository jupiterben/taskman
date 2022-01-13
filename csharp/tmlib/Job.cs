using AniTask.MQ;
using CommonUtils;
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

    public abstract class JobNode : MQNode
    {
        protected WorkSender taskSender;
        protected BroadcastReceiver resultReceiver;
        Dictionary<string, TaskStatusObj> taskList = new Dictionary<string, TaskStatusObj>();
        public string name { get; } //instance id;

        protected JobNode(string name)
        {
            this.name = name;
        }

        public override string GetNodeType()
        {
            return "Job";
        }

        public override void Start()
        {
            base.Start();
            this.taskSender = new WorkSender(Config.MQ_SERVER, Config.TASK_QUEUE);
            this.resultReceiver = new BroadcastReceiver(Config.MQ_SERVER, Config.TASK_RESULT_QUEUE);
            this.resultReceiver.Run(this.TaskResultMessage);
        }

        public override void Stop()
        {
            base.Stop();
            this.taskSender?.Close();
            this.taskSender = null;
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

        protected virtual void OnTaskResult(TaskResultObj result)
        {
            if (taskList.ContainsKey(result.meta.uuid))
            {
                var status = taskList[result.meta.uuid];
                status.UpdateState(result.GetStateData());
            }
        }
    }
}
