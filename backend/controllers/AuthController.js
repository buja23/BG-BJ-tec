import Usuario from '../models/UsuarioSchema.js'; // default export
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Por favor, forneça email e senha.' });
    }

    // Busca usuário incluindo a senha (select: false no schema)
    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Compara a senha enviada com a hash do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gera JWT
    const token = jwt.sign(
      { id: usuario._id, cargo: usuario.cargo },
      process.env.JWT_SECRET, // variável de ambiente
      { expiresIn: '8h' }
    );

    // Retorna token e dados do usuário (sem senha)
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      usuario: {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo
      }
    });
  } catch (error) {
    console.error('Erro no AuthController.login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const register = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Por favor, forneça nome, email e senha.' });
    }

    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }

    // Cria o novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha, // O hash da senha é feito pelo pre-save hook no Schema
      cargo: cargo || 'funcionario' // Define 'funcionario' como padrão se não for fornecido
    });

    // Não retorna a senha
    novoUsuario.senha = undefined;

    res.status(201).json({ message: 'Usuário registrado com sucesso!', usuario: novoUsuario });

  } catch (error) {
    console.error('Erro no AuthController.register:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
