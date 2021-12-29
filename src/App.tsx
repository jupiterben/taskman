import React, { FC } from 'react';
import './App.less';
import { WorkerStatusView } from './workerStatus'

const App: FC = () => (
  <div className="App">
    <WorkerStatusView/>
  </div>
);

export default App;