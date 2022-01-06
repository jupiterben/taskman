import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { GetWorker } from '@/api';
import ProCard from '@ant-design/pro-card';
import { useInterval } from 'ahooks';
import { List } from 'antd';
// import classNames from 'classnames';
// import styles from './index.less';
import type { API } from '@/types';

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
  return (
    <ProCard title="Worker:" extra={w.workerId} tooltip="" style={{ maxWidth: 400 }}>
      <table>
        {renderProp('创建时间:', w.createdAt.toLocaleString())}
        {renderProp('状态:', w.status)}
        {renderProp('描述:', w.desc)}
      </table>
    </ProCard>
  );
}

const WorkerListView = () => {
  const [workerList, setWorkerList] = useState<API.WorkerList>({ data: [] });
  useInterval(async () => {
    try {
      setWorkerList(await GetWorker());
    } catch (e) {
      console.log(e);
    }
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
