import api from './api';

/**
 * Busca todos os usuários.
 * @returns {Promise<Array>} Array de objetos de usuários.
 */
export async function fetchUsuarios() {
  const { data } = await api.get('/usuarios');
  return data;
}

/**
 * Busca um usuário pelo ID.
 * @param {string} id 
 * @returns {Promise<Object>} Objeto do usuário.
 */
export async function fetchUsuarioPorId(id) {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
}

/**
 * Cria um novo usuário.
 * @param {{ nome: string, email: string, senha: string }} usuario 
 * @returns {Promise<Object>} Usuário criado (com _id).
 */
export async function createUsuario(usuario) {
  const { data } = await api.post('/usuarios', usuario);
  return data;
}

/**
 * Atualiza um usuário existente.
 * @param {string} id 
 * @param {{ nome?: string, email?: string, senha?: string }} usuario 
 * @returns {Promise<Object>} Usuário atualizado.
 */
export async function updateUsuario(id, usuario) {
  const { data } = await api.put(`/usuarios/${id}`, usuario);
  return data;
}

/**
 * Deleta um usuário pelo ID.
 * @param {string} id 
 * @returns {Promise<boolean>} `true` se deletado com sucesso.
 */
export async function deleteUsuario(id) {
  await api.delete(`/usuarios/${id}`);
  return true;
}
