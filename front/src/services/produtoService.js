import api from './api';

export { api }; // Exporta a instância do api para ser usada em outros lugares

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

export async function createProduto(formData) {
  try {
    // A lógica de gerar o 'cod' foi movida para o backend.
    // O serviço agora apenas repassa o FormData que recebe.
    const { data } = await api.post('/produtos', formData);
    console.log('Produto criado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar produto:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateProduto(id, formData) {
  try {
    // A função de atualização também deve enviar FormData para suportar o upload de imagens.
    // O Axios definirá automaticamente o Content-Type como multipart/form-data.
    const { data } = await api.put(`/produtos/${id}`, formData);
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
