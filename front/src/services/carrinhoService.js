import axios from 'axios';

const API = 'http://localhost:3000/api'; // URL correta do backend

export const adicionarAoCarrinho = async (usuarioId, produto) => {
  const { data } = await axios.post(`${API}/carrinho/adicionar`, { 
    usuarioId,
    produtoId: produto._id,
    nome: produto.nome,
    preco: produto.preco,
    quantidade: produto.quantidade || 1
  });
  return data;
};

export const listarCarrinho = async (usuarioId) => {
  const { data } = await axios.get(`${API}/carrinho/${usuarioId}`);
  return data;
};

export const removerDoCarrinho = async (usuarioId, produtoId) => {
  const { data } = await axios.post(`${API}/carrinho/remover`, { usuarioId, produtoId });
  return data;
};

export const limparCarrinho = async (usuarioId) => {
  const { data } = await axios.post(`${API}/carrinho/limpar`, { usuarioId });
  return data;
};
