using AniTask;
using System;

namespace Job
{
    class Program
    {
        static void Main(string[] args)
        {
            MockJob generator = new MockJob();
            generator.Init();
            generator.DispatchTasks();

            string input = "";
            while (input != "exit")
            {
                input = Console.ReadLine();
            }
        }
    }
}
