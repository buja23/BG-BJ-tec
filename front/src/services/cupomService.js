import api from './api';

export const fetchCupons = async () => {
  const response = await api.get('/cupons');
  return response.data;
};

export const createCupom = async (cupomData) => {
  const response = await api.post('/cupons', cupomData);
  return response.data;
};

export const updateCupom = async (id, cupomData) => {
  const response = await api.put(`/cupons/${id}`, cupomData);
  return response.data;
};

export const deleteCupom = async (id) => {
  const response = await api.delete(`/cupons/${id}`);
  return response.data;
};

export const validarCupom = async (codigo) => {
  const response = await api.post('/cupons/validar', { codigo });
  return response.data;
};