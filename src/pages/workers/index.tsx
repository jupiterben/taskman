import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { GetWorkers } from '@/api';
import { useInterval } from 'ahooks';
import { Card, List } from 'antd';
// import classNames from 'classnames';
import styles from '../utils/style.less';
import type { API } from '@/api_types';
import moment from 'moment';


const ListContent: FC<{ data: API.NodeStatus }> = ({ data }) => {
  const createdAt = new Date(data.createdAt * 1000);
  return (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>状态</span>
        <p>{data.state}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>详细</span>
        <p>{data.desc || ""}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>开始时间</span>
        <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>运行时间</span>
        <p>{moment(createdAt).toNow()}</p>
      </div>
    </div>
  )
};

function renderWorker(worker: API.NodeStatus) {
  const desc = `${worker.machineName}:${worker.machineIP}`;
  return (
    <List.Item>
      <List.Item.Meta
        title={worker.nodeId}
        description={desc}
      />
      <ListContent data={worker} />
    </List.Item>
  );
}

function renderWorkerList(workers: API.NodeStatus[]) {
  return (
    <List
      size="large"
      // rowKey="id"
      dataSource={workers}
      renderItem={renderWorker}
    />
  );
}

const WorkerListView = () => {
  const [workerList, setWorkerList] = useState<API.NodeList>({ data: [] });

  const updateData = async () => {
    try {
      const result = await GetWorkers();
      if (result) setWorkerList(result);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    updateData();
  }, []);
  useInterval(() => {
    updateData();
  }, 1000);

  return (
    <PageContainer>
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          // title={}
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        // extra={extraContent}
        >
          {renderWorkerList(workerList.data)}
        </Card>
      </div>
    </PageContainer>
  );
};

export default WorkerListView;
