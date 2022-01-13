import { Config } from '@/service/config';
import { sleep } from '@/service/imp/util';
import { WorkConsumer, WorkSender } from '@/service/mq/workqueue';

export async function testTask() {
    const taskSender = new WorkSender(Config.MQ_SERVER, Config.TASK_QUEUE);
    const taskConsumer1 = new WorkConsumer(Config.MQ_SERVER, Config.TASK_QUEUE);
    const taskConsumer2 = new WorkConsumer(Config.MQ_SERVER, Config.TASK_QUEUE);
    taskConsumer1.run(async (msg: string) => {
        if (msg.length > 6) {
            console.log()
            sleep(3000);
            return true;
        }
        return false;
    });
    taskConsumer2.run(async (msg: string) => {
        if (msg.length <= 6) {
            sleep(1000);
            return true;
        }
        return false;
    });

    for (let i = 0; i < 12; i++) {
        taskSender.send("xxxxx");
    }

}
