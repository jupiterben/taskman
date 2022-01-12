using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTaskCommon
{
    public class TaskMeta
    {
        public string uuid;
        public string name;
        public List<string> args;
        public string desc;
        public string customData;
        public double createdAt;
    }

    //send by worker
    public class TaskResultObj
    {
        public TaskMeta meta;
        public TaskState state;
        public TaskFinishState finishState;
        public int curProgress;
        public int totalProgress;
        public string desc;
        public TaskResultObj SetStateData(TaskStateData stateData)
        {
            this.state = stateData.state;
            if (state == TaskState.Finish)
            {
                var finishData = stateData.content as TaskFinishData;
                this.finishState = finishData.state;
                this.desc = finishData.msg;
                this.curProgress = 100;
                this.totalProgress = 100;
            }
            else if (state == TaskState.Running)
            {
                var runData = stateData.content as TaskRunningData;
                this.curProgress = runData.curProgress;
                this.totalProgress = runData.totalProgress;
                this.desc = runData.desc;
            }
            return this;
        }
        public TaskStateData GetStateData()
        {
            if (state == TaskState.Start) return TaskStateData.Start;
            else if (state == TaskState.Running) return TaskStateData.Running(this.curProgress, this.totalProgress, this.desc);
            else if (state == TaskState.Finish) return TaskStateData.Finish(this.finishState, this.desc);
            return TaskStateData.Start;
        }
    }

    public class TaskStatusObj
    {
        public TaskMeta meta;
        public TaskState state;
        public TaskFinishState finishState;
        public string desc;
        public double startTime;
        public double endTime;
        public int progress;

        public TaskStatusObj UpdateState(TaskStateData stateData)
        {
            this.state = stateData.state;
            if(state == TaskState.Start)
            {
                this.startTime = Utils.Now();
            }
            else if(state == TaskState.Finish)
            {
                var finishData = stateData.content as TaskFinishData;
                this.finishState = finishData.state;
                this.desc = finishData.msg;
                this.progress = 100;
                this.endTime = Utils.Now();
            }
            else if(state == TaskState.Running)
            {
                var runData = stateData.content as TaskRunningData;
                this.progress = runData.curProgress*100 / runData.totalProgress;
                this.desc = runData.desc;
            }
            return this;
        }
    }
}
