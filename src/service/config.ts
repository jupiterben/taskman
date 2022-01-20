const ConfigCommon = {
  TASK_QUEUE: 'tm_task_queue',
  TASK_RESULT_QUEUE: "tm_task_result_queue",
  NODE_HEARTBEAT_CHANNEL: 'tm_node_heartbeat_broadcast',
  NODE_MESSAGE_CHANNEL: 'tm_node_message_broadcast',
  NODE_HEARTBEAT_INTERVAL: 1000,
  NODE_OFFLINE_TIMEOUT: 5000,
};

const ConfigNH = {
  MQ_SERVER: 'amqp://admin:admin@sh.nearhub.com:5672',
  ...ConfigCommon,
};

const ConfigMHY = {
  MQ_SERVER: 'amqp://bin.fu:bin.fu@10.12.11.48:5672/anitask',
  ...ConfigCommon,
};

const isMHY = process.env.USERDOMAIN === 'MIHOYO';
export const Config = isMHY ? ConfigMHY : ConfigNH;
