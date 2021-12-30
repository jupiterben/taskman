
export const config =
{
    broker: "amqp://admin:admin@sh.nearhub.com:5672",
    backend: "amqp://admin:admin@sh.nearhub.com:5672",
    TASK_QUEUE: "tm_task_queue",
    TASK_RESULT_QUEUE: "tm_task_result_queue",
    WORKER_STATE_REPORT_QUEUE: "tm_worker_state_report_queue",
}

export const workerConfig = 
{
    offlineTimeout: 60000,  //1min
    heartbeatInterval: 5000,    //5s
}

export const P4Settings = 
{
    
}