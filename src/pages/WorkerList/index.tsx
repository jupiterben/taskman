import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { worker } from '@/api';
import ProCard from '@ant-design/pro-card';
import { useInterval } from 'ahooks'
import { List } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

function renderProp(head: string, content: string) {
  return (<tr>
    <th>{head}</th>
    <th>{content}</th>
  </tr>)
}

function renderWorkerItem(worker: API.WorkerStatus) {
  const createTime = new Date();
  createTime.setTime(worker.createdAt);
  return (
    <ProCard title="Worker:" extra={worker.workerId} tooltip="" style={{ maxWidth: 400 }}>
      <table className={classNames(styles.colorTable)}>
        {renderProp("创建时间:", createTime.toLocaleString())}
        {renderProp("状态:", worker.status)}
        {renderProp("描述:", worker.desc)}
      </table>
    </ProCard>
  )
}

const WorkerListView = () => {
  const [workerList, setWorkerList] = useState<API.WorkerList>({ data: [] });
  useInterval(async () => {
    try {
      setWorkerList(await worker());
    }
    catch (e) {
      console.log(e);
    }
  }, 500);

  return (
    <PageContainer>
      <List grid={{ gutter: 16, column: 4 }} dataSource={workerList.data}
        renderItem={renderWorkerItem}
      />
    </PageContainer>
  );
};

export default WorkerListView;