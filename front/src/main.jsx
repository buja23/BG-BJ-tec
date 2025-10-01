import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UsuarioProvider } from './context/UsuarioContext.jsx';
import { CarrinhoProvider } from './context/CarrinhoContext.jsx'; 
import { MesasProvider } from './context/MesasContext.jsx';
import { ProdutosProvider } from './context/ProdutosContext.jsx'; // <-- import necessário

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProdutosProvider>
        <MesasProvider>
          <UsuarioProvider>
            <CarrinhoProvider>
              <App />
            </CarrinhoProvider>
          </UsuarioProvider>
        </MesasProvider>
      </ProdutosProvider>
    </BrowserRouter>
  </React.StrictMode>
);
