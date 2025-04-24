// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import {
  fetchProdutos,
  createProduto
} from '../services/produtoService';
import ListaProdutos from '../components/ListaProdutos';

export default function Home() {
  const [nome, setNome]   = useState('');
  const [preco, setPreco] = useState('');
  const [produtos, setProdutos] = useState([]);

  // Carrega os produtos ao montar a página
  useEffect(() => {
    fetchProdutos()
      .then(setProdutos)
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  // Lida com o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novo = await createProduto({ nome, preco: parseFloat(preco) });
      setProdutos(prev => [...prev, novo]);
      setNome('');
      setPreco('');
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Cadastro de Produtos</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          style={{ width: '60%', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          placeholder="Preço"
          step="0.01"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
          style={{ width: '30%', marginRight: '0.5rem' }}
        />
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Lista de Produtos</h2>
      {/* Podemos reutilizar o componente ListaProdutos, passando o estado */}
      <ListaProdutos produtos={produtos} />
    </div>
  );
}
