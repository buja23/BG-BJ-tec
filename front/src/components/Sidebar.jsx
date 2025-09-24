// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';

// Importando os ícones que vamos usar, incluindo o de Sair
import {
  CalculatorOutlined,
  AppstoreOutlined,
  RocketOutlined,
  UserOutlined,
  TrophyOutlined,
  BoxPlotOutlined,
  ShopOutlined,
  BankOutlined,
  PieChartOutlined,
  LogoutOutlined, // Ícone de Sair
} from '@ant-design/icons';

const { Sider } = Layout; // Usaremos o Sider do antd

// Itens do menu para facilitar a organização
const menuItems = [
  { key: '/caixa', icon: <CalculatorOutlined />, label: 'Caixa' },
  { key: '/mesas', icon: <AppstoreOutlined />, label: 'Mesas' },
  { key: '/deliverys', icon: <RocketOutlined />, label: 'Entregas' },
  { key: '/clientes', icon: <UserOutlined />, label: 'Clientes' },
  { key: '/ranking', icon: <TrophyOutlined />, label: 'Ranking' },
  { key: '/estoque', icon: <BoxPlotOutlined />, label: 'Estoque' },
  { key: '/negocio', icon: <ShopOutlined />, label: 'Meu Negócio' },
  { key: '/financeiro', icon: <BankOutlined />, label: 'Financeiro' },
  { key: '/dre', icon: <PieChartOutlined />, label: 'DRE' },
];


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Hook para saber a rota atual

  // Função para lidar com o clique no botão Sair
  const handleLogout = () => {
    console.log("Usuário deslogado!");
    // Aqui você adicionaria a lógica real de logout,
    // como limpar tokens e redirecionar para a página de login.
    // Ex: history.push('/login');
  };

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
    >
      <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Deixa o item da rota atual selecionado
          style={{ borderRight: 0 }} // Remove a pequena borda direita do menu
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>

        {/* Item de Sair empurrado para o final */}
        <Menu
            theme="dark"
            mode="inline"
            style={{ marginTop: 'auto', borderRight: 0 }}
        >
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Sair
            </Menu.Item>
        </Menu>

      </div>
    </Sider>
  );
};

export default Sidebar;