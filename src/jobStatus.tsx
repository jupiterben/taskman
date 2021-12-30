import React, { useState } from 'react';
import { Button, List, Card } from 'antd';
import { useInterval } from 'ahooks';
import { Progress, Tag } from 'antd';
import ProList from '@ant-design/pro-list';
import { JobStatus } from '../service/def'

const ListItemMeta =
{
    title: {},
    //subTitle: {},
    type: {},
    avatar: {},
    content: {},
    actions: {},
}




export function JobStatusView() {
    const [state, setState] = useState({ data: [], listData: [] });

    const refreshStatus = async () => {
        try {
            const res = await fetch('http://localhost/jobStatus', { method: 'GET', mode: 'cors' });
            const result = await res.json();
            if (JSON.stringify(result) == JSON.stringify(state.data)) return;
            setState(toListData(result));
        } catch (e) {
            console.log(e);
        }
    };

    async function StartJob() {
        const res = await fetch('http://localhost/runJob', { method: 'GET', mode: 'cors' });
        await res.text();
        await refreshStatus();
    }

    function toListItemData(job: JobStatus) {
        return ({
            title: job.jobId,
            actions: [
                <Button onClick={StartJob}>Start</Button>,
            ],
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            content: (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <div
                        style={{
                            width: 300,
                        }}
                    >
                        <div>{job.isRunning ? "Running" : "Stopped"}</div>
                        <Progress percent={job.isRunning ? job.finishSubTasks / job.totalSubTasks : 0} />
                    </div>
                </div>
            ),
        })
    };
    function toListData(data: JobStatus[]) {
        const listData = data.map(toListItemData);
        return { data, listData };
    }

    //定时刷新状态
    useInterval(refreshStatus, 500);

    return (
        <ProList
            metas={ListItemMeta}
            headerTitle="任务"
            dataSource={state.listData}
        />
    );
}
