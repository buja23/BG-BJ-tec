import jwt from 'jsonwebtoken';
import Usuario from '../models/UsuarioSchema.js';

// Middleware para proteger rotas em geral (verifica se está logado)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select('-senha');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

// Middleware para restringir acesso apenas a administradores
export const adminOnly = (req, res, next) => {
  if (req.usuario && req.usuario.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};

// Middleware mais flexível para autorizar com base em múltiplos cargos
export const authorize = (...cargosPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
      return res.status(403).json({ message: 'Você não tem permissão para realizar esta ação.' });
    }
    next();
  };
};