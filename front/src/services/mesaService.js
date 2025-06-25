import api from './api';

// Listar mesas (todas, abertas ou fechadas)
export async function fetchMesas(status) {
  const { data } = await api.get('/mesas', { params: status ? { status } : {} });
  return data;
}

// Abrir nova mesa
export async function abrirMesa({ mesa, cliente }) {
  const { data } = await api.post('/mesas', { mesa, cliente });
  return data;
}

// Adicionar produto à mesa
export async function adicionarProdutoMesa(mesaId, produto) {
  const { data } = await api.put(`/mesas/${mesaId}/adicionar-produto`, produto);
  return data;
}

// Fechar mesa
export async function fecharMesa(mesaId) {
  const { data } = await api.put(`/mesas/${mesaId}/fechar`);
  return data;
}

// Detalhar uma mesa
export async function detalharMesa(mesaId) {
  const { data } = await api.get(`/mesas/${mesaId}`);
  return data;
}

// Remover mesa
export async function removerMesa(mesaId) {
  const { data } = await api.delete(`/mesas/${mesaId}`);
  return data;
}