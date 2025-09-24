import { Routes, Route, Navigate } from 'react-router-dom';

// Importação dos estilos
import './index.css';
import './theme.css';

// Importação das PÁGINAS de autenticação
import CadastroPage from './pages/Cadastro.jsx';
import LoginPage from './pages/Login.jsx';

// Importação do LAYOUT PRINCIPAL e das PÁGINAS internas
import HomePage from './pages/Home.jsx';
import CaixaPage from './pages/CaixaPage.jsx';
import MesasPage from './pages/MesasPage.jsx';
import DeliverysPage from './pages/DeliverysPage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import EstoquePage from './pages/EstoquePage.jsx';
import NegocioPage from './pages/NegocioPage.jsx';
import FinanceiroPage from './pages/FinanceiroPage.jsx';
import DrePage from './pages/DrePage.jsx';

export default function App() {
  return (
    <Routes>
      {/* ROTA PRINCIPAL: Redireciona a página inicial para /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ROTAS DE AUTENTICAÇÃO */}
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* LAYOUT PRINCIPAL E PÁGINAS INTERNAS */}
      {/* Todas as páginas do sistema agora vivem dentro de "/app" */}
      <Route path="/app" element={<HomePage />}>
        {/* Redireciona /app para /app/caixa */}
        <Route index element={<Navigate to="/app/caixa" replace />} />

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