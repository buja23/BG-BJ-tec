import api from './api';

export async function fetchProdutos() {
  try {
    const { data } = await api.get('/produtos');
    console.log('Produtos recebidos:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.response?.data || error.message);
    throw error;
  }
}

export async function createProduto(produto) {
  try {
    // Gerar código automático
    const produtos = await fetchProdutos();
    const cod = (produtos?.length + 1 || 1).toString().padStart(4, '0');
    const produtoComCod = { ...produto, cod };

    console.log('Enviando produto para criação:', produtoComCod);
    const { data } = await api.post('/produtos', produtoComCod);
    console.log('Produto criado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar produto:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateProduto(id, produto) {
  try {
    console.log(`Atualizando produto ${id}:`, produto);
    const { data } = await api.put(`/produtos/${id}`, produto);
    console.log('Produto atualizado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteProduto(id) {
  if (!id) {
    console.error('[Frontend] ID não fornecido para deleção');
    throw new Error('ID não fornecido');
  }

  try {
    console.log('[Frontend] Iniciando requisição de delete para produto:', id);
    const url = `/produtos/${id}`;
    console.log('[Frontend] URL da requisição:', url);
    
    const response = await api.delete(url);
    console.log('[Frontend] Status da resposta:', response.status);
    console.log('[Frontend] Resposta completa:', response);
    console.log('[Frontend] Dados da resposta:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[Frontend] Erro ao deletar produto:', {
      id: id,
      error: error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    throw error;
  }
}
