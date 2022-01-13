using System.Collections.Generic;
using Newtonsoft.Json;
using CommonUtils;
using AniTask.MQ;

namespace AniTask
{
    public class Worker : MQNode
    {
        WorkConsumer taskConsumer;
        BroadcastSender resultSender;

        public delegate IEnumerable<TaskStateData> TaskHandler(List<string> args);
        Dictionary<string, TaskHandler> taskHandlers = new Dictionary<string, TaskHandler>();

        public override void Start()
        {
            base.Start();
            this.taskConsumer = new WorkConsumer(Config.MQ_SERVER, Config.TASK_QUEUE);
            this.taskConsumer.Run(OnTaskMessage);
            this.resultSender = new BroadcastSender(Config.MQ_SERVER, Config.TASK_RESULT_QUEUE);
        }

        public override void Stop()
        {
            base.Stop();
            this.taskConsumer?.Close();
            this.taskConsumer = null;
            this.resultSender?.Close();
            this.resultSender = null;
        }

        bool OnTaskMessage(string msg)
        {
            var taskMeta = JsonConvert.DeserializeObject<TaskMeta>(msg);
            if (this.taskHandlers.ContainsKey(taskMeta.name))
            {
                var handler = this.taskHandlers.GetValueOrDefault(taskMeta.name, null);
                if (handler == null) return false;
                foreach (var res in handler.Invoke(taskMeta.args))
                {
                    this.SendTaskResult(taskMeta, res);
                }
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
            this.resultSender.Send(content);
        }

        public void Register(string taskName, TaskHandler handler)
        {
            this.taskHandlers.Add(taskName, handler);
        }

        
    }
}
