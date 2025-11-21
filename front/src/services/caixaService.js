import api from './api';

export const getStatusCaixa = async () => {
  const { data } = await api.get('/caixa/status');
  return data;
};

export const getHistoricoCaixa = async () => {
  const { data } = await api.get('/caixa/historico');
  return data;
};

export const abrirCaixa = async (dadosAbertura) => {
  const { data } = await api.post('/caixa/abrir', dadosAbertura);
  return data;
};

export const fecharCaixa = async (dadosFechamento) => {
  const { data } = await api.post('/caixa/fechar', dadosFechamento);
  return data;
};
