  // Buscar mesas abertas
  const buscarMesasAbertas = async () => {
    try {
      const res = await fetch(API_URL + '?status=aberta');
      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar mesas abertas:', err);
      return [];
    }
  };

  // Buscar mesas fechadas
  const buscarMesasFechadas = async () => {
    try {
      const res = await fetch(API_URL + '?status=fechada');
      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar mesas fechadas:', err);
      return [];
    }
  };
// src/context/MesasContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MesasContext = createContext();

export const useMesas = () => useContext(MesasContext);

export const MesasProvider = ({ children }) => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000/api/mesas';

  // Carrega todas as mesas do banco
  const carregarMesas = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMesas(data);
    } catch (err) {
      console.error('Erro ao carregar mesas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Abrir nova mesa
  const abrirMesa = async (mesaNumero, clienteId = null) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa: mesaNumero, cliente: clienteId })
      });
      const novaMesa = await res.json();
      setMesas(prev => [novaMesa, ...prev]);
      return novaMesa;
    } catch (err) {
      console.error('Erro ao abrir mesa:', err);
    }
  };

  // Adicionar produto à mesa
  const adicionarProduto = async (mesaId, produto) => {
    try {
      const res = await fetch(`${API_URL}/${mesaId}/adicionar-produto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      const mesaAtualizada = await res.json();
      setMesas(prev => prev.map(m => m._id === mesaId ? mesaAtualizada : m));
      return mesaAtualizada;
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
    }
  };

  // Fechar mesa
  const fecharMesa = async (mesaId) => {
    try {
      const res = await fetch(`${API_URL}/${mesaId}/fechar`, { method: 'PUT' });
      const mesaFechada = await res.json();
      setMesas(prev => prev.map(m => m._id === mesaId ? mesaFechada : m));
      return mesaFechada;
    } catch (err) {
      console.error('Erro ao fechar mesa:', err);
    }
  };

  useEffect(() => {
    carregarMesas();
  }, []);

  return (
    <MesasContext.Provider value={{
      mesas,
      loading,
      carregarMesas,
      abrirMesa,
      adicionarProduto,
      fecharMesa,
      buscarMesasAbertas,
      buscarMesasFechadas
    }}>
      {children}
    </MesasContext.Provider>
  );
};
