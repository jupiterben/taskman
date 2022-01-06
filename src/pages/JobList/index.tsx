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
      setJobList(await GetJob());
    } catch (e) {
      console.log(e);
    }
  }, 1000);

  return (
    <PageContainer>
      {jobList.data.map(job => <JobView j={job} />)}
    </PageContainer>
  );
};

export default JobList;
