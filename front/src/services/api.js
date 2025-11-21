// src/services/api.js
import axios from 'axios';

// URL base do servidor para arquivos estáticos e API
export const SERVER_URL = 'http://localhost:3000';

// Create API instance with initial config
const api = axios.create({
  // A URL completa para as chamadas de API
  baseURL: `${SERVER_URL}/api`
});

export default api;
