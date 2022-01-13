using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;
using System;


namespace AniTask
{
    public class Worker : MQNode
    {
        BroadcastSender taskResultSender;
        WorkQueueConsumer taskConsumer;

        public delegate IEnumerable<TaskStateData> TaskHandler(List<string> args);
        Dictionary<string, TaskHandler> taskHandlers = new Dictionary<string, TaskHandler>();

        public void Start()
        {
            base.Start(Config.WORKER_STATE_REPORT_QUEUE);
            this.taskResultSender = new BroadcastSender();
            this.taskConsumer = new WorkQueueConsumer();

            this.taskResultSender.Open(Config.MQ_SERVER, Config.TASK_RESULT_QUEUE);
            this.taskConsumer.Run(Config.MQ_SERVER, Config.TASK_QUEUE, OnTaskMessage);
            this.startTime = DateTime.Now;
            this.UpdateStatus(NodeState.Idle);
        }

        public bool IsStarted()
        {
            return taskResultSender != null && taskConsumer != null;
        }

        bool OnTaskMessage(string msg)
        {
            var taskMeta = JsonConvert.DeserializeObject<TaskMeta>(msg);
            if (this.taskHandlers.ContainsKey(taskMeta.name))
            {
                var handler = this.taskHandlers.GetValueOrDefault(taskMeta.name, null);
                if (handler == null) return false;

                this.UpdateStatus(NodeState.Busy, string.Format("Run Task {0}", taskMeta.uuid));
                foreach (var res in handler.Invoke(taskMeta.args))
                {
                    this.SendTaskResult(taskMeta, res);
                }
                this.UpdateStatus(NodeState.Idle);
            }
            return true;
        }

        public override string GetNodeType()
        {
            return "Worker";
        }

        void SendTaskResult(TaskMeta task, TaskStateData state)
        {
            var taskResult = new TaskResultObj() { meta = task };
            taskResult.SetStateData(state);
            string content = JsonConvert.SerializeObject(taskResult);
            this.taskResultSender.Send(content);
        }

        public void Register(string taskName, TaskHandler handler)
        {
            this.taskHandlers.Add(taskName, handler);
        }

        public override void Stop()
        {
            base.Stop();
            this.taskResultSender.Close();
            this.taskResultSender = null;
            this.taskConsumer.Close();
            this.taskConsumer = null;
        }
    }
}
