// src/services/produtoService.js

// URL base da API de produtos
const API_BASE = 'http://localhost:3000/api/produtos';

/**
 * Busca todos os produtos.
 * @returns {Promise<Array>} Array de objetos { _id, nome, preco }.
 */
export async function fetchProdutos() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return await res.json();
}

/**
 * Busca um produto pelo ID.
 * @param {string} id 
 * @returns {Promise<Object>} Objeto do produto.
 */
export async function fetchProdutoPorId(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return await res.json();
}

/**
 * Cria um novo produto.
 * @param {{ nome: string, preco: number }} produto 
 * @returns {Promise<Object>} Produto criado (com _id).
 */
export async function createProduto(produto) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return await res.json();
}

/**
 * Atualiza um produto existente.
 * @param {string} id 
 * @param {{ nome?: string, preco?: number }} data 
 * @returns {Promise<Object>} Produto atualizado.
 */
export async function updateProduto(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return await res.json();
}

/**
 * Deleta um produto pelo ID.
 * @param {string} id 
 * @returns {Promise<boolean>} `true` se deletado com sucesso.
 */
export async function deleteProduto(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao deletar produto');
  return true;
}
