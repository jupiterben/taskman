import React, { FC } from 'react';
import './App.less';
import { WorkStatusView } from './workerStatus'

const App: FC = () => (
  <div className="App">
    <WorkStatusView/>
  </div>
);

export default App;