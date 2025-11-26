import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do cliente é obrigatório.'],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, 'O telefone do cliente é obrigatório.']
  },
  cpf: {
    type: String,
    required: [true, 'O CPF do cliente é obrigatório.'],
    unique: true // Garante que não haverá dois clientes com o mesmo CPF
  },
  endereco: {
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    uf: String,
  }
}, { timestamps: true });

export default mongoose.model('Cliente', ClienteSchema);