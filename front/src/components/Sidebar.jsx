import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

// Importando os ícones que vamos usar
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
} from '@ant-design/icons';

const Sidebar = () => {
  return (
    <div style={{
      width: 256,
      height: '100vh',
      backgroundColor: '#001529' // Cor padrão do menu escuro do antd
    }}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']} // Deixa o primeiro item selecionado por padrão
      >
        <Menu.Item key="1" icon={<CalculatorOutlined />}>
          {/* O componente <Link> é do react-router-dom e muda a URL sem recarregar a página */}
          <Link to="/caixa">Caixa</Link>
        </Menu.Item>

        <Menu.Item key="2" icon={<AppstoreOutlined />}>
          <Link to="/mesas">Mesas</Link>
        </Menu.Item>

        <Menu.Item key="3" icon={<RocketOutlined />}>
          <Link to="/deliverys">Deliverys</Link>
        </Menu.Item>

        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/clientes">Clientes</Link>
        </Menu.Item>

        <Menu.Item key="5" icon={<TrophyOutlined />}>
          <Link to="/ranking">Ranking</Link>
        </Menu.Item>

        <Menu.Item key="6" icon={<BoxPlotOutlined />}>
          <Link to="/estoque">Estoque</Link>
        </Menu.Item>

        <Menu.Item key="7" icon={<ShopOutlined />}>
          <Link to="/negocio">Meu Negócio</Link>
        </Menu.Item>

        <Menu.Item key="8" icon={<BankOutlined />}>
          <Link to="/financeiro">Financeiro</Link>
        </Menu.Item>

        <Menu.Item key="9" icon={<PieChartOutlined />}>
          <Link to="/dre">DRE</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;