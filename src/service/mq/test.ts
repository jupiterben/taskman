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
    rpcServer.run();

    const sQueue = await rpcServer.queue;
    const result = await rpcClient.call("helle", sQueue);
    console.log(result);

}

testRPC();