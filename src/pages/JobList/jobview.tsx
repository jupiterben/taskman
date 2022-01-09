// import { Button, Input, Drawer } from 'antd';
import React from 'react';
// import { FooterToolbar } from '@ant-design/pro-layout';
// import type { ProColumns, ActionType } from '@ant-design/pro-table';
// import ProTable from '@ant-design/pro-table';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ProDescriptions from '@ant-design/pro-descriptions';
// import { task } from '@/api';
import type { API } from '@/api_types';
import { TaskStateEnum } from '@/api_types';
import { Progress } from 'antd';
import ProList from '@ant-design/pro-list';

function renderTaskContent(data: API.TaskResult) {
  const style = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  };
  const state = data.state;
  let progress = 0; //data.stateData.percent;
  if (state == TaskStateEnum.Running) {
    progress =  data.progress || 0;
  } else if (state == TaskStateEnum.Finish) {
    progress = 100;
  }
  return (
    <div style={style}>
      <div style={{ width: 500 }}>
        <div>{state}</div>
        <Progress percent={progress} />
      </div>
    </div>
  );
}

function getTaskListViewData(data: API.TaskResult[]) {
  return data.map((item: API.TaskResult) => {
    const title = [item.meta.name].concat(item.meta.args).join(' ');
    return {
      title: title,
      actions: [],
      content: renderTaskContent(item),
    };
  });
}

const metas = {
  title: {},
  subTitle: {},
  type: {},
  avatar: {},
  content: {},
  actions: {},
};

const JobView: React.FC<{ data: API.JobStatus }> = (props) => {
  const { data } = props;
  return (
    <div>
      <ProList<any>
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
        metas={metas}
        headerTitle={data.name}
        dataSource={getTaskListViewData(data.tasks)}
      />
      {/* <div>{JSON.stringify(data)}</div> */}
    </div>
  );
};

export default JobView;
