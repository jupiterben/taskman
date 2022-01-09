
import { API, TaskStateEnum } from '@/api_types';
import {
    Avatar,
    Card,
    Col,
    List,
    Progress,
    Row,
} from 'antd';
import moment from 'moment';
import { FC } from 'react';
import styles from './style.less';

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

const ListContent: FC<{ data: API.TaskResult }> = ({ data }) => {
    const customData = data.meta.customData as API.GenAnimFileMetaData;
    let progress = 0;
    let status: any;
    if (data.state == TaskStateEnum.Finish) {
        progress = 100;
        status = "success"
    } else {
        progress = 50;
        status = "active";
    }
    return (
        <div className={styles.listContent}>
            <div className={styles.listContentItem}>
                <span>Owner</span>
                <p>{customData.submitter}</p>
            </div>
            <div className={styles.listContentItem}>
                <span>开始时间</span>
                <p>{moment(data.startTime).format('YYYY-MM-DD HH:mm')}</p>
            </div>
            <div className={styles.listContentItem}>
                <Progress percent={progress} status={status} strokeWidth={6} style={{ width: 180 }} />
            </div>
        </div>
    )
};

function renderTask(task: API.TaskResult) {
    const customData = task.meta.customData as API.GenAnimFileMetaData;
    return (
        <List.Item>
            <List.Item.Meta
                title={customData.animFileName}
                description={customData.animFileName}
            />
            <ListContent data={task} />
        </List.Item>
    );
}

function renderTaskContent(list: API.TaskResult[]) {
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: list.length,
    };
    return (
        <List
            size="large"
            // rowKey="id"
            pagination={paginationProps}
            dataSource={list}
            renderItem={renderTask}
        />
    );
}

const JobStatus: React.FC<{ data: API.JobStatus }> = (props) => {
    const { data } = props;
    const runningNum = data.tasks.filter(task => task.state == TaskStateEnum.Running).length;
    const inqueueNum = data.tasks.filter(task => task.state == TaskStateEnum.Start).length;
    const finishNum = data.tasks.filter(task => task.state == TaskStateEnum.Finish).length;

    return (
        <div className={styles.standardList}>
            <Card bordered={false}>
                <Row>
                    <Col sm={6} xs={24}>
                        <Info title="待办" value={`${runningNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="处理中" value={`${inqueueNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="已完成" value={`${finishNum}个任务`} bordered />
                    </Col>
                    <Col sm={6} xs={24}>
                        <Info title="平均处理时间" value="32分钟" bordered />
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
                {renderTaskContent(data.tasks)}
            </Card>
        </div>
    )
}

export default JobStatus;