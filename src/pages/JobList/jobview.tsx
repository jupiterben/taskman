// import { Button, Input, Drawer } from 'antd';
import React from 'react';
// import { FooterToolbar } from '@ant-design/pro-layout';
// import type { ProColumns, ActionType } from '@ant-design/pro-table';
// import ProTable from '@ant-design/pro-table';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ProDescriptions from '@ant-design/pro-descriptions';
// import { task } from '@/api';
import type { API } from '@/types';
import { Progress } from 'antd';
import ProList from '@ant-design/pro-list';

function renderTask(data: API.TaskItem) {
  const style = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  };
  return (
    <div style={style}>
      <div style={{ width: 600 }}>
        <div>{data.status}</div>
        <Progress percent={data.progress} />
      </div>
    </div>
  );
}

function getTaskListViewData(data: API.TaskItem[]) {
  return data.map((item) => ({
    title: item.name,
    subtitle: item.desc,
    actions: [],
    content: renderTask(item),
  }));
}

const JobView: React.FC<{ data: API.JobStatus }> = (props) => {
  const { data } = props;
  return (
    <div>
      <ProList<any>
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
        }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {},
        }}
        headerTitle={data.name}
        dataSource={getTaskListViewData(data.tasks)}
      />
      {/* <div>{JSON.stringify(data)}</div> */}
    </div>
  );
};

export default JobView;
