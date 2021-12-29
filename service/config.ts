
export const config =
{
    broker: "amqp://admin:admin@sh.nearhub.com:5672",
    backend: "amqp://admin:admin@sh.nearhub.com:5672",
}

export const workerConfig = 
{
    offlineTimeout: 60000,  //1min
    heartbeat: 5000,    //5s
    stateReportChannel: "worker_state_report_channel"
}

export const P4Settings = 
{
    
}