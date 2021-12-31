import React, { FC } from 'react';
import './App.less';
import { JobStatusView } from './jobStatus';
import { WorkerStatusView } from './workerStatus'

const App: FC = () => (
  <div className="App">
    <JobStatusView/>
    <WorkerStatusView/>
  </div>
);

export default App;