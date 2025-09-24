// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Importe seu layout e TODAS as suas páginas
import HomePage from './pages/Home.jsx';
import CaixaPage from './pages/CaixaPage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import DeliverysPage from './pages/DeliverysPage.jsx';
import DrePage from './pages/DrePage.jsx';
import EstoquePage from './pages/EstoquePage.jsx';
import FinanceiroPage from './pages/FinanceiroPage.jsx';
import MesasPage from './pages/MesasPage.jsx';      // <--- Adicionado
import NegocioPage from './pages/NegocioPage.jsx';    // <--- Adicionado
import RankingPage from './pages/RankingPage.jsx';    // <--- Adicionado


function App() {
  return (
    <Routes>
      {/* 2. Rota principal que usa o HomePage como layout */}
      <Route path="/" element={<HomePage />}>
        {/* Redireciona a página inicial para /caixa */}
        <Route index element={<Navigate to="/caixa" replace />} />

        {/* 3. Rotas "filhas" que serão renderizadas dentro do <Outlet /> */}
        <Route path="caixa" element={<CaixaPage />} />
        <Route path="mesas" element={<MesasPage />} />
        <Route path="deliverys" element={<DeliverysPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="negocio" element={<NegocioPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
        <Route path="dre" element={<DrePage />} />
      </Route>
    </Routes>
  );
}

export default App;