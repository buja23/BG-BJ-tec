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
import router from '../routes/usuarioRoutes.js';
import connectDB  from '../db.js';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT

// Configurar o EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname)



//registrando middlewares
app.use(staticMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(ratelimiteMiddleware);
app.use(urlencodedMiddleware);
app.use(morganMiddleware);
app.use(jsonMiddleware);

//rotas
app.use(router);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
