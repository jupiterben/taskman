const celery = require('celery-node');
const mq_addr = 'amqp://admin:admin@sh.nearhub.com:5672//'
const worker = celery.createWorker(
    mq_addr,
    mq_addr
);
worker.register("tasks.echo", (s) => s + "in worker");
worker.start();