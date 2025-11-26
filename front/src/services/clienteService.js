import api from './api';

export const fetchClientes = async () => {
  try {
    const response = await api.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  const response = await api.post('/clientes', clienteData);
  return response.data;
};

export const updateCliente = async (id, clienteData) => {
  const response = await api.put(`/clientes/${id}`, clienteData);
  return response.data;
};

export const deleteCliente = async (id) => {
  try {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar cliente ${id}:`, error.response?.data || error.message);
    throw error;
  }
};