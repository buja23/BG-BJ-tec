const API_BASE = 'http://localhost:3000/api/usuarios';

export async function fetchUsuarios() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

export async function fetchUsuarioPorId(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Usuário não encontrado');
  return res.json();
}

export async function createUsuario(usuario) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Erro ao criar usuário');
  return res.json();
}

export async function updateUsuario(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json();
}

export async function deleteUsuario(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao deletar usuário');
  return true;
}
