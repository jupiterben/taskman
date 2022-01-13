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

    await Promise.all([...Array(5).keys()].map(async (i) => {
        const msg = JSON.stringify({ delay: (5-i) * 1000 });
        const result = await rpcClient.call(msg, sQueue);
        console.log(result);
    }));

    await rpcServer.close();
    await rpcClient.close();
}

testRPC();