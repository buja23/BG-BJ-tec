import path from 'path';
import __dirname from '../utils/pathUtils.js';
import Usuario from '../models/UsuarioClass.js';

class UsuarioController {
    static async create(req, res) {
      try {
        const { nome, email, senha, cargo } = req.body;
        const user = new Usuario(nome, email, senha, cargo);
        const saved = await user.save();
        res.status(201).json(saved);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  
    static async list(req, res) {
      const users = await Usuario.findAll();
      res.json(users);
    }
  
    static async getById(req, res) {
      const user = await Usuario.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    }
  
    static async update(req, res) {
      try {
        const updated = await Usuario.update(req.params.id, req.body);
        res.json(updated);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  
    static async remove(req, res) {
      await Usuario.delete(req.params.id);
      res.status(204).end();
    }
  }
  
  export default UsuarioController;