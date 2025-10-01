import React, { useEffect, useState } from 'react';
import ProdutoCard from '../components/ProdutoCard';
import Carrinho from '../components/Carrinho';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import axios from 'axios';

const ProdutosPage = ({ usuarioId }) => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const { data } = await axios.get('http://localhost:5000/produtos'); // endpoint do backend
      setProdutos(data);
    };
    fetchProdutos();
  }, []);

  return (
    <CarrinhoProvider usuarioId={usuarioId}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 2 }}>
          {produtos.map(prod => (
            <ProdutoCard key={prod._id} produto={prod} usuarioId={usuarioId} />
          ))}
        </div>
        <div style={{ flex: 1, marginLeft: 20 }}>
          <Carrinho usuarioId={usuarioId} />
        </div>
      </div>
    </CarrinhoProvider>
  );
};

export default ProdutosPage;
