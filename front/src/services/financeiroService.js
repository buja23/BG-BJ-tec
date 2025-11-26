import api from './api';

export const fetchRelatorioFinanceiro = async (params) => {
  try {
    // Passa as datas como parâmetros de query
    const response = await api.get('/financeiro/relatorio', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório financeiro:', error);
    throw error;
  }
};