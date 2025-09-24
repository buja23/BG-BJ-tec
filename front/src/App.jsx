import { Routes, Route, Navigate } from 'react-router-dom';

// Estilos globais
import './index.css';
import './theme.css';

// Páginas de Autenticação e Layout
import CadastroPage from './pages/Cadastro.jsx';
import LoginPage from './pages/Login.jsx';
import HomePage from './pages/Home.jsx';

// Páginas Internas do Sistema
import CaixaPage from './pages/CaixaPage.jsx';
// ... importe suas outras páginas aqui (Mesas, Clientes, etc.)

export default function App() {
  return (
    <Routes>
      {/* Rotas Públicas (sem a barra lateral) */}
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Privadas (com a barra lateral) */}
      <Route path="/" element={<HomePage />}>
        {/* Redireciona a rota inicial para /caixa */}
        <Route index element={<Navigate to="/caixa" replace />} />

        {/* Páginas do sistema */}
        <Route path="caixa" element={<CaixaPage />} />
        {/* <Route path="mesas" element={<MesasPage />} /> */}
        {/* ... adicione as outras rotas aqui */}
      </Route>
    </Routes>
  );
}