import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CaixaPage from './pages/CaixaPage';
import MesasPage from './pages/MesasPage';
import DeliverysPage from './pages/DeliverysPage';
import ClientesPage from './pages/ClientesPage';
import RankingPage from './pages/RankingPage';
import NegocioPage from './pages/NegocioPage';
import FinanceiroPage from './pages/FinanceiroPage';
import DrePage from './pages/DrePage';

const App = () => {
  const isAuthenticated = true; // Substituir por lógica real de autenticação

  return (
    <Router>
      <Routes>
        <Route index element={<CaixaPage />} />
        <Route path="caixa" element={<CaixaPage />} />
        <Route path="mesas" element={<MesasPage />} />
        <Route path="deliverys" element={<DeliverysPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="negocio" element={<NegocioPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
        <Route path="dre" element={<DrePage />} />
        <Route path="home" element={<Home />} />
        <Route path="*" element={<Navigate to="/caixa" replace />} />
      </Routes>
    </Router>
  );
};

export default App;