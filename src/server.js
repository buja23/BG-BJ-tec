import express from 'express'
import dotenv from 'dotenv'
import path from 'path';

//carregar variaveis do aruivo .env

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, 'view', 'index.html'))
})

app.listen(port, () => {
    console.log('hello')
})

const express = require("express")
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
