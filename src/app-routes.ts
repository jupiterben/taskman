import { withNavigationWatcher } from './contexts/navigation';
import { TasksPage } from './pages/tasksPage';
import { WorkersPage } from './pages/workersPage';
import { default as HomePage } from './pages/home/home';

const routes = [
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/tasks',
    component: TasksPage
  },
  {
    path: '/workers',
    component: WorkersPage
  },
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
