const ConfigBase = {
  TASK_QUEUE: 'tm_task_queue',
  TASK_RESULT_QUEUE: 'tm_task_result_queue',
  JOB_STATUS_EXCHANGE: 'tm_job_status_exchange',
  JOB_COMMAND_QUEUE: 'tm_job_command_queue',
  WORKER_STATE_REPORT_QUEUE: 'tm_worker_state_report_queue',
  WORKER_HEARTBEAT_INTERVAL: 5000,
  WORKER_OFFLINE_TIMEOUT: 160000,
};

const ConfigProd = {
  MQ_SERVER: 'amqp://admin:admin@sh.nearhub.com:5672',
  ...ConfigBase,
};

const ConfigDev = {
  MQ_SERVER: 'amqp://bin.fu:bin.fu@10.12.11.48:5672/anitask',
  ...ConfigBase,
};

const isDev = process.env.NODE_ENV === 'development';
export const Config = isDev ? ConfigDev : ConfigProd;
