import api from './api';

export const getMesas = async () => {
  const { data } = await api.get('/mesas');
  return data;
};

export const abrirMesa = async (numeroMesa) => {
  const { data } = await api.post('/mesas', { numero: numeroMesa });
  return data;
};

export const abrirMesaEspecifica = async (mesaId, clienteId = null) => {
  // CORREÇÃO: Alterado para POST e enviando o clienteId no corpo da requisição
  const { data } = await api.post(`/mesas/${mesaId}/abrir`, { clienteId });
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
  // Agora envia o objeto completo com os dados de fechamento
  const { data } = await api.post(`/mesas/${mesaId}/fechar`, dadosFechamento);
  return data;
};

export const vincularClienteNaMesa = async (mesaId, clienteId) => {
  // CORREÇÃO: Alterado de PUT para POST para corresponder à rota do backend
  const { data } = await api.post(`/mesas/${mesaId}/vincular-cliente`, { clienteId });
  return data;
};

export const desvincularClienteDaMesa = async (mesaId) => {
  // CORREÇÃO: Alterado para POST para garantir maior compatibilidade e robustez na requisição.
  const { data } = await api.post(`/mesas/${mesaId}/desvincular-cliente`);
  return data;
};
