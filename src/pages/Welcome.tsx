import * as React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';


const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'欢迎使用'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
