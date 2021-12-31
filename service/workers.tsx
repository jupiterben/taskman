
import React, { useState } from 'react';
import { useInterval } from 'ahooks';


export function WorkerStatusView() {
    const [workStatus, setWorkStatus] = useState([]);

    useInterval(async () => {
        try {
            const res = await fetch('http://localhost/workerStatus', { method: 'GET', mode: 'cors' });
            const result = await res.json();
            if(JSON.stringify(result) !== JSON.stringify(workStatus))
            {
                setWorkStatus(result);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, 500);

    return (
        <List grid ={{gutter:16, column:4}} 
            dataSource={workStatus} 
            renderItem={item => (
                <List.Item>
                    <Card title={item.workerId}>{item.status}</Card>
                </List.Item>
            )}
        />
    );
}