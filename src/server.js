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

//carregar variaveis do aruivo .env

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
})

app.listen(port, () => {
    console.log(`Rodando na porta  ${port}` )
})

const express = require("express")

//registrando middlewares
app.use(staticMiddleware);
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(ratelimiteMiddleware);
app.use(morganMiddleware);

// const mongoose = require("mongoose")

// const app = express()
// const port = 3000
// mongoose.connect("mongodb+srv://buja:bgbjtech@bgbj.stvug3t.mongodb.net/?retryWrites=true&w=majority&appName=bgbj")

// const user = mongoose.model('usuario', {
//     Nome: String,
//     Senha: String 
// })


// app.post("/", async (req, res) =>{
//     const usuario = new user({
//         Nome: req.body.Nome,
//         Senha: req.body.Senha
//     })

//     await user.save()
//     res.send(user)
// })

// app.listen(port, () => {
//     console.log('app runing')
// })
