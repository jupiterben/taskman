const celery = require('celery-node');
const mq_addr = 'amqp://admin:admin@sh.nearhub.com:5672//'

const client = celery.createClient(
    mq_addr,
    mq_addr
);

const task = client.createTask("tasks.echo");
const result = task.applyAsync(["hello world"]);
result.get().then(data => {
    console.log(data);
    client.disconnect();
});