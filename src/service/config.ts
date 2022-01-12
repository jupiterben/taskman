const ConfigCommon = {
  TASK_QUEUE: 'tm_task_queue',
  TASK_RESULT_EXPIRES: 1000 * 60 * 60 * 24,
  JOB_STATUS_EXCHANGE: 'tm_job_status_exchange',
  JOB_COMMAND_QUEUE: 'tm_job_command_queue',
  NODE_HEARTBEAT_BROADCAST: 'tm_node_heartbeat_broadcast',
  NODE_HEARTBEAT_INTERVAL: 1000,
  NODE_OFFLINE_TIMEOUT: 5000,
};

const ConfigProd = {
  MQ_SERVER: 'amqp://admin:admin@sh.nearhub.com:5672',
  ...ConfigCommon,
};

const ConfigDev = {
  MQ_SERVER: 'amqp://bin.fu:bin.fu@10.12.11.48:5672/anitask',
  ...ConfigCommon,
};

const isDev = process.env.NODE_ENV === 'development';
export const Config = isDev ? ConfigDev : ConfigProd;
