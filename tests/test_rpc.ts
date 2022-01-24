import { Config } from '@/service/config';
import { RPCClient, RPCServer } from '@/service/mq/rpc';

export async function testRPC() {
    const rpcClient = new RPCClient(Config.MQ_SERVER);
    const rpcServer = new RPCServer(Config.MQ_SERVER);

    const { queue } = (await rpcServer.queue);

    await Promise.all([...Array(5).keys()].map(async (i) => {
        const msg = JSON.stringify({ delay: (5 - i) * 1000 });
        const result = await rpcClient.call(msg, queue);
        console.log(result);
    }));

    await rpcServer.close();
    await rpcClient.close();
}

testRPC();