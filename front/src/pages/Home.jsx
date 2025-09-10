import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Supondo que a Sidebar esteja em 'components'

const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sua barra lateral fica aqui, sempre visível */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {/* O conteúdo da página (Caixa, Mesas, etc.) será renderizado aqui */}
        <Outlet />
      </main>
    </div>
  );
};

export default Home;