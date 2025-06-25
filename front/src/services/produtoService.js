import api from './api';

export async function fetchProdutos() {
  const { data } = await api.get('/produtos');  // GET /api/produtos
  return data;
}

export async function createProduto(produto) {
  const { data } = await api.post('/produtos', produto);  // POST /api/produtos
  return data;
}

export async function updateProduto(cod, produtoAtualizado) {
  // Remove cod do corpo do update
  const { cod: _, ...payload } = produtoAtualizado;
  console.log('Payload enviado para updateProduto:', payload);
  const { data } = await api.put(`/produtos/${cod}`, payload);
  return data;
}

export async function deleteProduto(cod) {
  const { data } = await api.delete(`/produtos/${cod}`);
  return data;
}

