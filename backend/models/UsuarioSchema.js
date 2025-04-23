import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cargo: { type: String, enum: ['gerente', 'caixa', 'garçom'], required: true }
});

const usuario = mongoose.model('Usuario', usuarioSchema);

export default usuario;
