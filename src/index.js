const express = require("express")
const mongoose = require("mongoose")


const app = express()
const port = 3000
mongoose.connect("mongodb+srv://buja:bgbjtech@bgbj.stvug3t.mongodb.net/?retryWrites=true&w=majority&appName=bgbj")

const user = mongoose.model('usuario', {
    Nome: String,
    Senha: String 
})

app.get("/", (req, res) =>{
    res.send("Hello")
})

app.post("/", async (req, res) =>{
    const usuario = new user({
        Nome: req.body.Nome,
        Senha: req.body.Senha
    })

    await user.save()
    res.send(user)
})

app.listen(port, () => {
    console.log('app runing')
})