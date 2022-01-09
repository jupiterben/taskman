import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { API } from '@/api_types';
import { useInterval } from 'ahooks';
import { GetJob } from '@/api';
import JobStatus from './jobstatus';

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
        <JobStatus key={job.name} data={job} />
      ))}
    </PageContainer>
  );
};

export default JobList;
