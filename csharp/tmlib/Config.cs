using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTaskCommon
{
    public static class Config
    {
        public static string MQ_SERVER = "amqp://bin.fu:bin.fu@10.12.11.48:5672/anitask";
        public static string TASK_QUEUE = "tm_task_queue";
        public static string TASK_RESULT_QUEUE = "tm_task_result_queue";
        public static string JOB_COMMAND_QUEUE = "tm_job_command_queue";
        public static string NODE_HEARTBEAT_CHANNEL = "node_heartbeat_channel";

        public static TimeSpan NODE_HEARTBEAT_INTERVAL = TimeSpan.FromMilliseconds(1000);
        public static TimeSpan NODE_OFFLINE_TIMEOUT = TimeSpan.FromMilliseconds(5000);
   
        public static string  TEMP_WORKING_ROOTFOLDER= @"\\hk4e_shotgunutil\utils\temp\aniTaskTemp";
        public static string TASK_INFO_FILE = "taskinfo";
    }
}
