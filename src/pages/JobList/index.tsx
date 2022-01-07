import React, { useState, } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { API } from '@/types';
import JobView from './jobview';
import { useInterval } from 'ahooks';
import { GetJob } from '@/api';

export const JobList: React.FC = () => {
  const [jobList, setJobList] = useState<API.JobList>({ data: [] });
  useInterval(async () => {
    try {
      const jobList = await GetJob();
      if (jobList) setJobList(jobList);
    } catch (e) {
      console.log(e);
    }
  }, 1000);

  return (
    <PageContainer>
      {JSON.stringify(jobList)}
    </PageContainer>
  );
};

export default JobList;
