using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;

namespace CommonUtils
{
    public enum TaskState
    {
        Created,
        Start,
        Running,
        Delay,
        Finish
    }
    public class TaskDataContent
    {

    }

    public enum TaskFinishState
    {
        Success,
        Fail,
        Cancel,
        Exception
    }
    public class TaskFinishData : TaskDataContent
    {
        public static TaskFinishData Success { get; } = new TaskFinishData(TaskFinishState.Success);
        public static TaskFinishData Cancel { get; } = new TaskFinishData(TaskFinishState.Cancel, "任务取消");
        public static TaskFinishData Exception { get; } = new TaskFinishData(TaskFinishState.Exception, "任务异常");
        public static TaskFinishData Fail(string msg)
        {
            return new TaskFinishData(TaskFinishState.Fail, msg);
        }
        public TaskFinishState state { get; }
        // 只有任务成功的情况下 msg 才可以为空，其他情况下 msg 必须有值
        public string msg { get; }
        public bool IsSuccess { get { return state == TaskFinishState.Success; } }
        public TaskFinishData(TaskFinishState state, string msg = null)
        {
            this.state = state;
            this.msg = msg;
            if (state != TaskFinishState.Success && msg == null)
            {
                this.msg = "";
            }
        }
    }

    public class TaskRunningData : TaskDataContent
    {
        public int curProgress;
        public int totalProgress;
        public String desc;
        public TaskRunningData(int curProgress, int totalProgress, string desc = "")
        {
            this.curProgress = curProgress;
            this.totalProgress = totalProgress;
            this.desc = desc;
        }
        public int Percent
        {
            get
            {
                if (curProgress < 0) curProgress = 0;
                if (curProgress > totalProgress) curProgress = totalProgress;
                if (totalProgress <= 0) return 0;
                return curProgress * 100 / totalProgress;
            }
        }
    }

    public class TaskDelayData : TaskDataContent
    {
        public TimeSpan DelayTime { get; }
        public TaskDelayData(TimeSpan delay)
        {
            DelayTime = delay;
        }
    }

    public class TaskStateData
    {
        public TaskState state;
        public TaskDataContent content;
        public TaskStateData(TaskState state, TaskDataContent content)
        {
            this.state = state;
            this.content = content;
        }
        public bool IsFinish { get { return state == TaskState.Finish; } }
        public bool IsFinishSuccess
        {
            get
            {
                if( state == TaskState.Finish && (content is TaskFinishData) )
                {
                    var finishData = content as TaskFinishData;
                    return finishData.IsSuccess;
                }
                return false;
            }
        }
        public static TaskStateData Created { get; } = new TaskStateData(TaskState.Created, null);
        public static TaskStateData Start { get; } = new TaskStateData(TaskState.Start, null);
        public static TaskStateData FinishSuccess { get; } = new TaskStateData(TaskState.Finish, TaskFinishData.Success);
        public static TaskStateData FinishCancel { get; } = new TaskStateData(TaskState.Finish, TaskFinishData.Cancel);
        public static TaskStateData Running(int curProgress, int totalProgress, string desc = "")
        {
            return new TaskStateData(TaskState.Running, new TaskRunningData(
                curProgress
                , totalProgress
                , desc
            ));
        }
        public static TaskStateData Delay(TimeSpan delay) { return new TaskStateData(TaskState.Delay, new TaskDelayData(delay)); }
        public static TaskStateData Finish(TaskFinishState state, string msg = null)
        {
            return new TaskStateData(TaskState.Finish, new TaskFinishData(
                state
                , msg
            ));
        }
        public static TaskStateData Finish(TaskFinishData data)
        {
            return new TaskStateData(TaskState.Finish, data);
        }
        public static TaskStateData FinishFail(string msg = null) { return Finish(TaskFinishState.Fail, msg); }
    }

    public class TaskBase
    {
        public ProgressDelegate progressCallback;
        public TaskFinishDelegate finishCallback;
        public TaskStateData state;
        public delegate void ProgressDelegate(TaskBase task, TaskState state, object value);
        public delegate void TaskFinishDelegate(TaskFinishData result);
        public string TaskName { get; }
        private bool? isStarted;
        public bool IsStarted { get { return isStarted == true; } }
        public IEnumerator enumerator;

        public TaskBase(string taskName, IEnumerator enumerator)
        {
            TaskName = taskName;
            this.enumerator = enumerator;
        }
        public void Start() { isStarted = true; }
    }

    public class TaskManager
    {
        private static TaskManager instance = null;
        public static TaskManager Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new TaskManager();
                }
                return instance;
            }
        }

        public bool HasRunningTask
        {
            get
            {
                return taskQueue.Count > 0;
            }
        }

        DispatcherTimer timer;
        TaskDelayData delayData;

        private TaskManager()
        {
            timer = new DispatcherTimer();
            timer.Tick += Update;
            timer.Interval = TimeSpan.FromMilliseconds(2);
            timer.Start();
        }

        Queue<TaskBase> taskQueue = new Queue<TaskBase>();
        Queue<TaskBase> taskBackQueue = new Queue<TaskBase>();

        TaskBase currentTask = null;
        void Update (object sender, EventArgs e)
        {
            if(delayData != null)
            {
                timer.Interval = TimeSpan.FromMilliseconds(2);
                delayData = null;
            }

            if (taskQueue.Count == 0) return;

            bool taskFinish = false;
            TaskBase task = null;
            TaskFinishData taskFinishData = null;
            try
            {
                task = taskQueue.Peek();
                var enumerator = task.enumerator;

                if (currentTask != task)
                {
                    currentTask = task;
                    task.progressCallback?.Invoke(task, TaskState.Start, null);
                }

                bool moveNext = false;
                try
                {
                    task.Start();
                    moveNext = enumerator.MoveNext();
                }
                catch (Exception)
                {
                    taskFinish = true;
                    task.progressCallback?.Invoke(task, TaskState.Finish, TaskFinishData.Exception);
                    taskFinishData = TaskFinishData.Exception;
                    throw;
                }
                
                if (moveNext)
                {
                    if (enumerator.Current is TaskStateData)
                    {
                        var taskStateData = enumerator.Current as TaskStateData;
                        task.state = taskStateData;
                        task.progressCallback?.Invoke(task, taskStateData.state, taskStateData.content);
                        if (taskStateData.state == TaskState.Finish)
                        {
                            taskFinish = true;
                            taskFinishData = taskStateData.content as TaskFinishData;
                        }
                        if(taskStateData.state == TaskState.Delay)
                        {
                            delayData = taskStateData.content as TaskDelayData;
                            timer.Interval = delayData.DelayTime;
                            return;
                        }
                    }
                }
                else
                {
                    taskFinish = true;
                    // 此任务没返回 finish 状态，自动补上
                    task.progressCallback?.Invoke(task, TaskState.Finish, TaskFinishData.Success);
                    taskFinishData = TaskFinishData.Success;
                }
            }
            catch (Exception ex)
            {
                ExceptionHelper.Catch(ex);
            }
            finally
            {
                if (taskFinish)
                {
                    taskQueue.Dequeue();
                    currentTask = null;
                    task.finishCallback?.Invoke(taskFinishData);
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="taskName"></param>
        /// <param name="taskFunc"></param>
        /// <param name="param"></param>
        /// <param name="progressCallback"></param>
        /// <param name="taskFinishCallback"> 在任务完全完成之后执行，此时任务 running 值为 false </param>
        public TaskBase RunTask(IEnumerable enumerable
            , string taskName
            , TaskBase.ProgressDelegate progressCallback = null
            , TaskBase.TaskFinishDelegate finishCallback = null
        )
        {
            RemoveTask(taskName);
            TaskBase task = new TaskBase(taskName, enumerable.GetEnumerator());
            task.progressCallback = progressCallback;
            task.finishCallback = finishCallback;
            taskQueue.Enqueue(task);
            return task;
        }

        void RemoveTask(string taskName)
        {
            while(taskQueue.Count > 0)
            {
                var task = taskQueue.Dequeue();
                if (task.TaskName == taskName) continue;
                taskBackQueue.Enqueue(task);
            }
            var tempQueue = taskQueue;
            taskQueue = taskBackQueue;
            taskBackQueue = tempQueue;
        }

        public TaskFinishData RunTaskSync(IEnumerable<TaskStateData> enumerable)
        {
            foreach(var stateData in enumerable)
            {
                if(stateData.state == TaskState.Finish)
                {
                    return stateData.content as TaskFinishData;
                }
            }
            return TaskFinishData.Success;
        }
    }


    /// <summary>
    /// Async Task Manager
    /// </summary>
    /// 
    public class TaskProgress : IProgress<TaskRunningData>
    {
        CancellationTokenSource cts;
        string TaskName;

        public delegate void ProgressDelegate(string taskName, TaskStateData stateData);
        public ProgressDelegate ProgressCallback;
        TaskStateData currentState;
        TaskStateData CurrentState
        {
            get { return currentState; }
            set
            {
                currentState = value;
                ProgressCallback?.Invoke(TaskName, currentState);
            }
        }

        public TaskProgress(string taskName, ProgressDelegate progressCallback)
        {
            TaskName = taskName;
            ProgressCallback = progressCallback;
            CurrentState = new TaskStateData(TaskState.Start, null);
        }
        ~TaskProgress()
        {
            cts?.Dispose();
            cts = null;
        }
        public CancellationToken? cancelToken
        {
            get
            {
                return cts?.Token;
            }
        }
        public void Cancel()
        {
            cts?.Cancel();
        }
        public void Report(TaskRunningData value)
        {
            CurrentState = new TaskStateData(TaskState.Running, value);
        }
        public void Finish(TaskFinishState state, string msg = null)
        {
            CurrentState = new TaskStateData(TaskState.Finish, new TaskFinishData(state, msg));
            cts?.Dispose();
            cts = null;
        }
    }

    public class AsyncTaskManager
    {
        private List<TaskProgress> taskList = new List<TaskProgress>();
        public TaskProgress Start(string taskName, TaskProgress.ProgressDelegate progressCallback = null)
        {
            var task = new TaskProgress(taskName, progressCallback);
            taskList.Add(task);
            return task;
        }

    }
}
