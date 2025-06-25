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

dotenv.config();
await connectDB();

const app = express();
const port = process.env.PORT || 3000;

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
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/cupons', cupomRoutes);

// 4) Só depois, middleware de arquivos estáticos
app.use(staticMiddleware);

// Se precisar de um catch-all para React Router, algo assim:
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
