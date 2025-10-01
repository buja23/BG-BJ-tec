// src/context/ProdutosContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Criar contexto
const ProdutosContext = createContext();

// Hook para usar produtos
export const useProdutos = () => useContext(ProdutosContext);

// Provider
export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar produtos do backend
  const carregarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/produtos'); // Ajuste a rota se necessário
      setProdutos(response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar produto (opcional, se quiser criar produtos no front)
  const adicionarProduto = async (novoProduto) => {
    try {
      const response = await axios.post('http://localhost:3000/api/produtos', novoProduto);
      setProdutos(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      setError('Não foi possível adicionar o produto.');
    }
  };

  // Carrega os produtos quando o contexto é montado
  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <ProdutosContext.Provider value={{ produtos, loading, error, carregarProdutos, adicionarProduto }}>
      {children}
    </ProdutosContext.Provider>
  );
};
