import express from 'express';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import dotenv from 'dotenv';
import{
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddleware,
    ratelimiteMiddleware,
    morganMiddleware
} from '../middleware/middlewares.js';
import connectDB  from '../db.js';
import usuarioRoutes from '../routes/produtoRoutes.js';
import produtoRoutes from '../routes/usuarioRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT


//registrando middlewares
app.use(staticMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(ratelimiteMiddleware);
app.use(urlencodedMiddleware);
app.use(morganMiddleware);
app.use(jsonMiddleware);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
