// src/services/api.js
import axios from 'axios';

// Tenta as portas em sequência até encontrar o servidor
const tryPort = async (port) => {
  try {
    await axios.get(`http://localhost:${port}/api/vendas`);
    return port;
  } catch (error) {
    if (port < 3003) { // tenta até a porta 3003
      return tryPort(port + 1);
    }
    throw error;
  }
};

// Create API instance with initial config
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Try to find the correct port on startup
tryPort(3000).then(port => {
  api.defaults.baseURL = `http://localhost:${port}/api`;
}).catch(error => {
  console.error('Não foi possível conectar ao servidor:', error);
});

// Atualiza a baseURL se necessário
tryPort(3000).then(port => {
  if (port !== 3000) {
    api.defaults.baseURL = `http://localhost:${port}/api`;
    console.log(`API usando porta ${port}`);
  }
}).catch(error => {
  console.error('Erro ao conectar com o servidor:', error);
});

export default api;
