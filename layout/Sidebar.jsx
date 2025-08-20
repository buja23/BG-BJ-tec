import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">BG Restaurante</div>
        <div className="sidebar-subtitle">Sistema de Gestão</div>
      </div>
      
      <div className="sidebar-nav">
        <Link to="/caixa" className={`nav-item ${isActive('/caixa') ? 'active' : ''}`}>
          <span className="nav-icon">💰</span>
          <span>Caixa</span>
        </Link>
        <Link to="/mesas" className={`nav-item ${isActive('/mesas') ? 'active' : ''}`}>
          <span className="nav-icon">🍽️</span>
          <span>Mesas</span>
        </Link>
        <Link to="/deliverys" className={`nav-item ${isActive('/deliverys') ? 'active' : ''}`}>
          <span className="nav-icon">🚴</span>
          <span>Entregas</span>
        </Link>
        <Link to="/clientes" className={`nav-item ${isActive('/clientes') ? 'active' : ''}`}>
          <span className="nav-icon">👥</span>
          <span>Clientes</span>
        </Link>
        <Link to="/ranking" className={`nav-item ${isActive('/ranking') ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span>Ranking</span>
        </Link>
        <Link to="/estoque" className={`nav-item ${isActive('/estoque') ? 'active' : ''}`}>
          <span className="nav-icon">📦</span>
          <span>Estoque</span>
        </Link>
        <Link to="/negocio" className={`nav-item ${isActive('/negocio') ? 'active' : ''}`}>
          <span className="nav-icon">🏢</span>
          <span>Negócio</span>
        </Link>
        <Link to="/financeiro" className={`nav-item ${isActive('/financeiro') ? 'active' : ''}`}>
          <span className="nav-icon">📈</span>
          <span>Financeiro</span>
        </Link>
        <Link to="/dre" className={`nav-item ${isActive('/dre') ? 'active' : ''}`}>
          <span className="nav-icon">📋</span>
          <span>DRE</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;