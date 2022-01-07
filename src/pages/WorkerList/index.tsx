import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { GetWorker } from '@/api';
import ProCard from '@ant-design/pro-card';
import { useInterval } from 'ahooks';
import { List } from 'antd';
// import classNames from 'classnames';
// import styles from './index.less';
import type { API } from '@/types';
import moment from 'moment';

function renderProp(head: string, content: string) {
  return (
    <tr>
      <th>{head}</th>
      <th>{content}</th>
    </tr>
  );
}

function renderWorkerItem(w: API.WorkerStatus) {
  //const style = classNames(styles.colorTable);
  const elapseTime = moment().from(w.createdAt);
  return (
    <ProCard title="Worker:" extra={w.workerId} tooltip="" style={{ maxWidth: 300 }}>
      <table>
        {renderProp('运行时间:', elapseTime)}
        {renderProp('状态:', w.status)}
        {renderProp('描述:', w.desc)}
      </table>
    </ProCard>
  );
}

const WorkerListView = () => {
  const [workerList, setWorkerList] = useState<API.WorkerList>({ data: [] });

  const updateData = async () => {
    try {
      const result = await GetWorker();
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
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={workerList.data}
        renderItem={renderWorkerItem}
      />
    </PageContainer>
  );
};

export default WorkerListView;
