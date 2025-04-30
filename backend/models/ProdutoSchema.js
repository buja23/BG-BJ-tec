import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    preco: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;