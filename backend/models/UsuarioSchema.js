import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true, select: false }, // senha oculta por padrão
  cargo: { type: String, enum: ['gerente', 'caixa', 'garcom'], required: true }
});

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

export default UsuarioModel; // default export
