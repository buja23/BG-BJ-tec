import api from './api';

const getToken = () => localStorage.getItem('token');

const configWithAuth = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export async function criarVenda(vendaData) {
  try {
    console.log('Token de autenticação:', getToken());
    console.log('URL da requisição:', api.defaults.baseURL + '/vendas/criar');
    console.log('Enviando dados da venda:', JSON.stringify(vendaData, null, 2));
    const { data } = await api.post('/vendas/criar', vendaData, configWithAuth());
    console.log('Resposta da criação da venda:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar venda:', error.response?.data || error);
    throw error;
  }
}

export async function listarVendas() {
  try {
    console.log('Buscando lista de vendas...');
    const { data } = await api.get('/vendas', configWithAuth());
    console.log('Vendas recebidas:', data);
    return data;
  } catch (error) {
    console.error('Erro ao listar vendas:', error.response?.data || error);
    throw error;
  }
}

export async function buscarVendaPorId(id) {
  try {
    const { data } = await api.get(`/vendas/${id}`);
    return data;
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    throw error;
  }
}

export async function buscarVendasPorPeriodo(startDate, endDate) {
  try {
    const { data } = await api.get('/vendas/periodo', {
      params: { startDate, endDate }
    });
    return data;
  } catch (error) {
    console.error('Erro ao buscar vendas por período:', error);
    throw error;
  }
}

export async function atualizarStatusVenda(id, status) {
  try {
    const { data } = await api.patch(`/vendas/${id}/status`, { status });
    return data;
  } catch (error) {
    console.error('Erro ao atualizar status da venda:', error);
    throw error;
  }
}

export async function obterEstatisticasVendas() {
  try {
    const { data } = await api.get('/vendas/stats');
    return data;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
}