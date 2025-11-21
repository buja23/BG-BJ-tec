import api from './api';

export const getMesas = async () => {
  const { data } = await api.get('/mesas');
  return data;
};

export const abrirMesa = async (numeroMesa) => {
  const { data } = await api.post('/mesas', { numero: numeroMesa });
  return data;
};

export const abrirMesaEspecifica = async (mesaId) => {
  const { data } = await api.put(`/mesas/${mesaId}/abrir`);
  return data;
};

export const adicionarProdutoNaMesa = async (mesaId, produtoData) => {
  const { data } = await api.post(`/mesas/${mesaId}/adicionar`, produtoData);
  return data;
};

export const removerProdutoDaMesa = async (mesaId, produtoConsumidoId) => {
  const { data } = await api.delete(`/mesas/${mesaId}/produtos/${produtoConsumidoId}`);
  return data;
};

export const fecharMesa = async (mesaId, dadosFechamento) => {
  const { data } = await api.post(`/mesas/${mesaId}/fechar`, dadosFechamento);
  return data;
};
