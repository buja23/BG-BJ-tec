import api from './api';

/**
 * Busca todos os produtos.
 * @returns {Promise<Array>} Array de objetos { _id, nome, preco }.
 */
export async function fetchProdutos() {
  const { data } = await api.get('/produtos');
  return data;
}

/**
 * Busca um produto pelo ID.
 * @param {string} id 
 * @returns {Promise<Object>} Objeto do produto.
 */
export async function fetchProdutoPorId(id) {
  const { data } = await api.get(`/produtos/${id}`);
  return data;
}

/**
 * Cria um novo produto.
 * @param {{ nome: string, preco: number }} produto 
 * @returns {Promise<Object>} Produto criado (com _id).
 */
export async function createProduto(produto) {
  const { data } = await api.post('/produtos', produto);
  return data;
}

/**
 * Atualiza um produto existente.
 * @param {string} id 
 * @param {{ nome?: string, preco?: number }} data 
 * @returns {Promise<Object>} Produto atualizado.
 */
export async function updateProduto(id, data) {
  const { data: updated } = await api.put(`/produtos/${id}`, data);
  return updated;
}

/**
 * Deleta um produto pelo ID.
 * @param {string} id 
 * @returns {Promise<boolean>} `true` se deletado com sucesso.
 */
export async function deleteProduto(id) {
  await api.delete(`/produtos/${id}`);
  return true;
}
