import React from 'react';
import { Layout, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  return (
    <Header style={{ 
      padding: '0 24px', 
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      display: 'flex',
      alignItems: 'center',
      marginLeft: 250, // Para compensar a sidebar fixa
      height: 64
    }}>
      <Title level={3} style={{ margin: 0, color: '#001529' }}>
        Sistema de Vendas - Dashboard
      </Title>
    </Header>
  );
};

export default AppHeader;