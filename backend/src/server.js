import express from 'express';
import cors from 'cors';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import dotenv from 'dotenv';
import {
  staticMiddleware,
  urlencodedMiddleware,
  jsonMiddleware,
  securityMiddleware,
  compressionMiddleware,
  ratelimiteMiddleware,
  morganMiddleware
} from '../middleware/middlewares.js';
import connectDB from '../db.js';

import produtoRoutes from '../routes/produtoRoutes.js';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import mesasRoutes from '../routes/mesasRoutes.js';
import cupomRoutes from '../routes/cupomRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import carrinhoRoutes from '../routes/carrinhoRoutes.js';
import vendaRoutes from '../routes/vendaRoutes.js';


dotenv.config();
console.log('Iniciando servidor...');
console.log('Tentando conectar ao MongoDB...');
await connectDB();

const app = express();
let port = process.env.PORT || 3000;
console.log(`Servidor configurado para porta ${port}`);

// 1) Habilita CORS logo no topo:
app.use(cors());

// 2) Middlewares de parsing e segurança (sem static ainda)
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(ratelimiteMiddleware);
app.use(urlencodedMiddleware);
app.use(morganMiddleware);
app.use(jsonMiddleware);

// 3) Rotas da API em primeiro lugar
app.use('/api/vendas', vendaRoutes); // Colocando primeiro para evitar conflitos
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/cupons', cupomRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api', authRoutes); // Rota de autenticação por último

// Adiciona um handler de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

const startServer = async (retryCount = 0) => {
  try {
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

// 4) Só depois, middleware de arquivos estáticos
app.use(staticMiddleware);

// Se precisar de um catch-all para React Router, algo assim:
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Server is started by startServer() above
