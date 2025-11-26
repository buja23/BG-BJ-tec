import api from './api';

export const processarPagamento = async (pagamentoData) => {
  const response = await api.post('/pagamentos/processar', pagamentoData);
  return response.data;
};