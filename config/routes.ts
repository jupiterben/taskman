export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    name: '任务状态', icon: 'table', path: '/jobs',
    routes: [
      { name: '动画文件生成', icon: 'table', path: '/jobs/animgen', component: './jobs/animgen' },
    ]
  },
  { name: '工作节点状态', icon: 'DeploymentUnitOutlined', path: '/workers', component: './workers' },
  { name: '设置', icon: 'SettingOutlined', path: '/settings', component: './settings' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];

