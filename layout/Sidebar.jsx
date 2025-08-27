import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../front/src/pages/Home';
import CaixaPage from '../front/src/pages/CaixaPage';
import MesasPage from '../front/src/pages/MesasPage';
import DeliverysPage from '../front/src/pages/DeliverysPage';
import ClientesPage from '../front/src/pages/ClientesPage';
import RankingPage from '../front/src/pages/RankingPage';
import EstoquePage from '../front/src/pages/EstoquePage';
import NegocioPage from '../front/src/pages/NegocioPage';
import FinanceiroPage from '../front/src/pages/FinanceiroPage';
import DrePage from '../front/src/pages/DrePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;