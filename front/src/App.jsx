import { Routes, Route, Navigate } from 'react-router-dom';
import { UsuarioProvider } from './context/UsuarioContext.jsx';
import { CarrinhoProvider } from './context/CarrinhoContext.jsx';

// Estilos
import './index.css';
import './theme.css';

// Páginas públicas
import CadastroPage from './pages/Cadastro.jsx';
import LoginPage from './pages/LoginPage.jsx';

// Páginas privadas
import HomePage from './pages/Home.jsx';
import CaixaPage from './pages/CaixaPage.jsx';
import MesasPage from './pages/MesasPage.jsx';
import MesaDetalhePage from './pages/MesaDetalhePage.jsx';
import DeliverysPage from './pages/DeliverysPage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import EstoquePage from './pages/EstoquePage.jsx';
import NegocioPage from './pages/NegocioPage.jsx';
import FinanceiroPage from './pages/FinanceiroPage.jsx';
import DrePage from './pages/DrePage.jsx';
import ProdutosPage from './pages/ProdutosPage.jsx';
import VendasPage from './pages/VendasPage.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';

export default function App() {
  return (
    <UsuarioProvider>
      <CarrinhoProvider>
        <Routes>
          {/* Redirecionamento raiz */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Rotas privadas */}
          <Route path="/app" element={<PrivateRoute />}>
            <Route path="" element={<HomePage />}>
              <Route index element={<Navigate to="/app/caixa" replace />} />
              <Route path="caixa" element={<CaixaPage />} />
              <Route path="mesas" element={<MesasPage />} />
              <Route path="mesas/:id" element={<MesaDetalhePage />} />
              <Route path="deliverys" element={<DeliverysPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="estoque" element={<EstoquePage />} />
              <Route path="negocio" element={<NegocioPage />} />
              <Route path="financeiro" element={<FinanceiroPage />} />
              <Route path="dre" element={<DrePage />} />
              <Route path="produtos" element={<ProdutosPage />} />
              <Route path="vendas" element={<VendasPage />} />
            </Route>
          </Route>

          {/* Rota coringa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CarrinhoProvider>
    </UsuarioProvider>
  );
}
