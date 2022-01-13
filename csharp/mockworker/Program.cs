using AniTask;
using CommonUtils;
using System;
using System.Collections.Generic;
using System.Threading;

namespace worker
{
    class Program
    {
        static Worker worker;
        static void Main(string[] args)
        {
            StartWorker();
            string input = "";
            while (input != "exit")
            {
                input = Console.ReadLine();
            }
            StopWorker();
        }

        static void StartWorker()
        {
            worker = new Worker();
            worker.Register("tasks.3dsmax", MaxTask);
            try
            {
                worker.Start();
            }
            catch (Exception e)
            {
                Console.WriteLine("{0}", e.ToString());
                worker.Stop();
            }
        }
        static void StopWorker()
        {
            worker?.Stop();
            worker = null;
        }

        static IEnumerable<TaskStateData> MaxTask(List<string> args)
        {
            yield return TaskStateData.Start;
            for (int i = 0; i < 5; i++)
            {
                yield return TaskStateData.Running(i, 5, "Running");
                Thread.Sleep(1000);
            }
            yield return TaskStateData.FinishSuccess;
        }
    }
}
