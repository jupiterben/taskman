import { Config } from '../config';
import { RPCClient, RPCServer } from './rpc';

// async function testMQ() {
//     const resultSend = new TaskResultBackEnd(Config.MQ_SERVER);
//     const taskId = v4();

//     setTimeout(() => {
//         resultSend.storeResult(taskId, { data: "ok" });
//     }, 5000);

//     const res = await resultSend.getResult(taskId)
//     console.log(res);
// }

async function testRPC() {
    const rpcClient = new RPCClient(Config.MQ_SERVER);
    const rpcServer = new RPCServer(Config.MQ_SERVER);

    const sQueue = (await rpcServer.queue).queue;

    for (var i = 0; i < 10; i++) {
        await rpcClient.call(`helle ${i}`, sQueue).then(result => {
            console.log(result);
        });
    }


    await rpcServer.close();
    await rpcClient.close();
}

testRPC();