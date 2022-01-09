export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { name: '动画文件生成任务', icon: 'table', path: '/joblist', component: './JobList' },
  { name: '节点状态', icon: 'DeploymentUnitOutlined', path: '/workerlist', component: './WorkerList' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
