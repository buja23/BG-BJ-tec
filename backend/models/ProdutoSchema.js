// ProdutoSchema.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const produtoSchema = new mongoose.Schema({
  cod: { type: String, unique: true },
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  tipo: { type: String, required: true },
  qtd: { type: Number, required: true },
  custo: { type: Number, required: true }, // Custo de aquisição do produto
  imagemUrl: { type: String, required: false }
});

// Middleware para gerar um código único antes de salvar um novo produto
produtoSchema.pre('save', function(next) {
  if (this.isNew && !this.cod) {
    this.cod = crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  next();
});

const produtoModel = mongoose.model('Produto', produtoSchema);
export default produtoModel;
