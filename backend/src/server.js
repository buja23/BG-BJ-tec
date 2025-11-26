import express from 'express';
import cors from 'cors';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import dotenv from 'dotenv';

// CORREÇÃO: Carrega as variáveis de ambiente no início de tudo.
dotenv.config();

import connectDB from '../db.js';

import produtoRoutes from '../routes/produtoRoutes.js';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import mesasRoutes from '../routes/mesasRoutes.js';
import cupomRoutes from '../routes/cupomRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import carrinhoRoutes from '../routes/carrinhoRoutes.js';
import vendaRoutes from '../routes/vendaRoutes.js';
import caixaRoutes from '../routes/caixaRoutes.js';
import clienteRoutes from '../routes/clienteRoutes.js'; // 1. Importar as rotas de cliente
import financeiroRoutes from '../routes/financeiroRoutes.js'; // Importa a nova rota
import dreRoutes from '../routes/dreRoutes.js';
import relatorioRoutes from '../routes/relatorioRoutes.js';
import pagamentoRoutes from '../routes/pagamentoRoutes.js';

// Importando middlewares diretamente das bibliotecas
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

const app = express();
let port = process.env.PORT || 3000;
console.log(`Servidor configurado para porta ${port}`);

// 1) Habilita CORS logo no topo:
app.use(cors());

// 2) Middlewares de segurança e otimização
app.use(
  helmet({
    // Permite que recursos (como imagens) sejam carregados de origens diferentes.
    // Isso corrige o erro 'net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin'.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression()); // Comprime as respostas para melhor performance

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('dev')); // Para logs de requisição no console

// Middleware para parsear JSON - ESSENCIAL para receber dados do frontend
app.use(express.json());

// 4) Rotas da API
app.use('/api/vendas', vendaRoutes); // Colocando primeiro para evitar conflitos
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/cupons', cupomRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/caixa', caixaRoutes);
app.use('/api/clientes', clienteRoutes); // 2. Usar as rotas de cliente
app.use('/api/financeiro', financeiroRoutes); // Usa a nova rota
app.use('/api/dre', dreRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/auth', authRoutes); // CORREÇÃO: Rota de autenticação agora tem um prefixo claro.

// Adiciona um handler de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

const startServer = async (retryCount = 0) => {
  try {
    // 1. Conecte-se ao banco de dados AQUI, depois que tudo foi configurado.
    await connectDB();

    await new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
        console.log('Rotas configuradas:');
        console.log('- /api/vendas');
        console.log('- /api/produtos');
        console.log('- /api/usuario');
        console.log('- /api/mesas');
        console.log('- /api/cupons');
        console.log('- /api/carrinho');
        console.log('- /api/caixa');
        console.log('- /api/clientes');
        console.log('- /api/financeiro');
        console.log('- /api/dre');
        console.log('- /api/relatorios');
        console.log('- /api/pagamentos');
        resolve();
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && retryCount < 3) {
          console.log(`Porta ${port} em uso, tentando porta ${port + 1}...`);
          port += 1;
          startServer(retryCount + 1);
        } else {
          console.error('Erro ao iniciar servidor:', error);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
