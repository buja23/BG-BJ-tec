import api from './api';

export const fetchCupons = async () => {
  const { data } = await api.get('/cupons');
  return data;
};

export const createCupom = async (cupom) => {
  const { data } = await api.post('/cupons', cupom);
  return data;
};

export const updateCupom = async (id, cupom) => {
  const { data } = await api.put(`/cupons/${id}`, cupom);
  return data;
};

export const deleteCupom = async (id) => {
  const { data } = await api.delete(`/cupons/${id}`);
  return data;
};

export const validarCupom = async (codigo) => {
  const { data } = await api.post('/cupons/validar', { codigo });
  return data;
};

export const aplicarCupomEmMesa = async ({ id, codigo }) => {
  const { data } = await api.post('/cupons/aplicar', { id, codigo });
  return data;
};
