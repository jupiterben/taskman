export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { name: '任务列表', icon: 'table', path: '/joblist', component: './JobList' },
  { name: '节点列表', icon: 'DeploymentUnitOutlined', path: '/workerlist', component: './WorkerList' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
