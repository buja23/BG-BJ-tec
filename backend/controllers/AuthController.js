import Usuario from '../models/Usuario.js'; // <<< REMOVA AS CHAVES DAQUI
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Função de Login
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Validar se email e senha foram enviados
    if (!email || !senha) {
      return res.status(400).json({ error: 'Por favor, forneça email e senha.' });
    }

    // 2. Encontrar o usuário no banco de dados pelo email
    // Usando o método estático que você criou na sua classe Usuario
    const usuario = await Usuario.findOne({ email }); // Note que findOne não é um método estático da sua classe. Vamos corrigir isso.
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Comparar a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 4. Gerar um token JWT
    const token = jwt.sign(
      { id: usuario._id, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 5. Enviar o token de volta para o frontend
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token
    });

  } catch (error) {
    console.error('Erro no controller de login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};