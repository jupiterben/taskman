import type { API } from '@/api_types';
import { TaskStateEnum } from '@/api_types';
import ProList from '@ant-design/pro-list';
import { Card, Col, List, Progress, Row } from 'antd';
import moment from 'moment';
import type { FC } from 'react';
import styles from '../utils/style.less';

const Info: FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    bordered?: boolean;
}> = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
    </div>
);

const ListContent: FC<{ data: API.TaskStatusMsg }> = ({ data }) => {
    const customData = JSON.parse(data.meta.userData || '{}') as API.GenFileUserData;
    const stateData = data.stateData;
    let progress = 0;
    let status: any;
    let startTime = 'N/A';
    let endTime = 'N/A';
    if (stateData.state == TaskStateEnum.Finish) {
        progress = 100;
        status = 'success';
        startTime = moment(new Date(data.startTime * 1000)).format('YYYY-MM-DD HH:mm');
        endTime = moment(new Date(data.endTime * 1000)).format('YYYY-MM-DD HH:mm');
    } else if (stateData.state == TaskStateEnum.Running) {
        progress = (stateData.curProgress * 100) / stateData.totalProgress;
        status = 'active';
        startTime = moment(new Date(data.startTime * 1000)).format('YYYY-MM-DD HH:mm');
    }
    const submitter: API.P4User = JSON.parse(customData.submitter) || {};

    return (
        <div className={styles.listContent}>
            <div className={styles.listContentItem}>
                <span>提交人</span>
                <p>{submitter.EmailAddress}</p>
            </div>
            <div className={styles.listContentItem}>
                <span>开始时间</span>
                <p>{startTime}</p>
            </div>
            <div className={styles.listContentItem}>
                <span>结束时间(预计)</span>
                <p>{endTime}</p>
            </div>
            <div className={styles.listContentItem}>
                <p>{stateData.desc}</p>
                <Progress
                    percent={progress}
                    status={status}
                    strokeWidth={6}
                    style={{ width: 220 }}
                />
            </div>
        </div>
    );
};

function renderTask(task: API.TaskStatusMsg) {
    const customData = JSON.parse(task.meta.userData || '{}') as API.GenFileUserData;
    return (
        <List.Item>
            <List.Item.Meta title={task.meta.uuid} description={customData.maxFile} />
            <ListContent data={task} />
        </List.Item>
    );
}

function renderTaskList(list: API.TaskStatusMsg[]) {
    return (
        <ProList
            size="large"
            // rowKey="id"
            pagination={{
                pageSize: 10,
            }}
            dataSource={list}
            renderItem={renderTask}
        />
    );
}

const JobStatus: React.FC<{ data: API.JobStatus }> = (props) => {
    const { data } = props;
    const runningNum = data.tasks.filter(
        (task) => task.stateData.state == TaskStateEnum.Running,
    ).length;
    const inqueueNum = data.tasks.filter(
        (task) => task.stateData.state == TaskStateEnum.Start,
    ).length;
    const finishTasks = data.tasks.filter((task) => task.stateData.state == TaskStateEnum.Finish);
    const finishNum = finishTasks.length;

    let avgTime = 0;
    if (finishTasks.length > 0) {
        let totalTime = 0;
        finishTasks.forEach((task) => {
            totalTime += task.endTime - task.startTime;
        });
        avgTime = totalTime / finishTasks.length;
    }
    const avgStr = moment(new Date(avgTime * 1000)).format('mm分:ss秒');

    return (
        <div className={styles.standardList}>
            {/* <Button>开始</Button> */}
            <Card bordered={false}>
                <Row>
                    <Col sm={6} xs={24}>
                        <Info title="队列中" value={`${inqueueNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="处理中" value={`${runningNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="已完成" value={`${finishNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="平均处理时间" value={avgStr} bordered />
                    </Col>
                </Row>
            </Card>
            <Card
                className={styles.listCard}
                bordered={false}
                title={data.name}
                style={{ marginTop: 24 }}
                bodyStyle={{ padding: '0 32px 40px 32px' }}
                // extra={extraContent}
            >
                {renderTaskList(data.tasks)}
            </Card>
        </div>
    );
};

export default JobStatus;
