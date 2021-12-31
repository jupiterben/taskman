import * as React from 'react';
import { useScreenSizeClass } from './utils/media-query';
import { HashRouter as Router } from 'react-router-dom';
import { NavigationProvider } from './contexts/navigation';
import Content from './Content';
import 'devextreme/dist/css/dx.light.css';

export default function Root() {
  const screenSizeClass = useScreenSizeClass();
  return (
    <Router>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <Content />
          </div>
        </NavigationProvider>
    </Router>
  );
}
