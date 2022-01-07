import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { API } from '@/types';
import JobView from './jobview';
import { useInterval } from 'ahooks';
import { GetJob } from '@/api';

export const JobList: React.FC = () => {
  const [jobList, setJobList] = useState<API.JobList>({ data: [] });

  const updateData = async () => {
    try {
      const result = await GetJob();
      if (result) setJobList(result);
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
      {jobList.data.map((job) => (
        <JobView key={job.name} data={job} />
      ))}
    </PageContainer>
  );
};

export default JobList;
