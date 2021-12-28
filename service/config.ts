
export const config =
{
    broker: "amqp://admin:admin@sh.nearhub.com:5672",
    backend: "amqp://admin:admin@sh.nearhub.com:5672",
}

export const workerConfig = 
{
    offlineTimeout: 5000,
    heartbeat: 2000,
    stateReportChannel: "worker_state_report_channel"
}
