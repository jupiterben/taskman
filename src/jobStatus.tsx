import React, { useState } from 'react';
import { Button, List, Card } from 'antd';
import { useInterval } from 'ahooks';


export function WorkerStatusView() {
    const [jobStatus, setJobStatus] = useState([]);

    useInterval(async () => {
        try {
            const res = await fetch('http://localhost/jobStatus', { method: 'GET', mode: 'cors' });
            const result = await res.json();
            if (JSON.stringify(result) !== JSON.stringify(jobStatus)) {
                setJobStatus(result);
            }
        }
        catch (e) {
            console.log(e);
        }
    }, 500);

    return (
        <List itemLayout="horizontal"
            dataSource={jobStatus}
            renderItem={item => (
                <List.Item>

                </List.Item>
            )}
        />
    );
}
