// src/services/mesaService.js

const API_URL = 'http://localhost:3000/api';

export const fetchMesasAbertas = async () => {
  const response = await fetch(`${API_URL}/mesas?status=aberta`);
  return await response.json();
};

export const fetchMesasFechadas = async () => {
  const response = await fetch(`${API_URL}/mesas?status=fechada`);
  return await response.json();
};

export const createMesa = async (mesaData) => {
  const response = await fetch(`${API_URL}/mesas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mesaData),
  });
  return await response.json();
};

export const closeMesa = async (mesaId) => {
  const response = await fetch(`${API_URL}/mesas/${mesaId}/close`, {
    method: 'PUT',
  });
  return await response.json();
};