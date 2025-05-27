import api from './api';

export async function fetchProdutos() {
  const { data } = await api.get('/produtos');  // GET /api/produtos
  return data;
}

export async function createProduto(produto) {
  const { data } = await api.post('/produtos', produto);  // POST /api/produtos
  return data;
}

