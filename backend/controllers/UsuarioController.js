import UsuarioModel from '../models/UsuarioSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UsuarioController {
  static async create(req, res) {
    try {
      const { nome, email, senha, cargo } = req.body;

      // criptografa senha antes de salvar
      const senhaHash = await bcrypt.hash(senha, 10);

      const user = new UsuarioModel({
        nome,
        email,
        senha: senhaHash,
        cargo
      });

      const saved = await user.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req, res) {
    const users = await UsuarioModel.find();
    res.json(users);
  }

  static async getById(req, res) {
    const user = await UsuarioModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  }

  static async update(req, res) {
    try {
      const { senha, ...rest } = req.body;
      let updateData = rest;

      if (senha) {
        updateData.senha = await bcrypt.hash(senha, 10);
      }

      const updated = await UsuarioModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async remove(req, res) {
    await UsuarioModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }

  // 🚀 NOVA FUNÇÃO: LOGIN
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // CORREÇÃO: Adiciona .select('+senha') para forçar a inclusão da senha na busca
      const user = await UsuarioModel.findOne({ email }).select('+senha');
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign(
        { id: user._id, cargo: user.cargo },
        process.env.JWT_SECRET, // CORREÇÃO: Usa a mesma chave secreta do middleware
        { expiresIn: '8h' } // Aumentado o tempo de expiração para 8 horas
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: { // CORREÇÃO: Alterado de 'usuario' para 'user' para corresponder ao frontend
          id: user._id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro no servidor', details: err.message });
    }
  }
}

export default UsuarioController;
