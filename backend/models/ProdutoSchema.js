// ProdutoSchema.js
import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  cod: { type: String, required: true },
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  tipo: { type: String, required: true },
  qtd: { type: Number, required: true },
  imagemUrl: { type: String, required: false }
});

const produtoModel = mongoose.model('Produto', produtoSchema);
export default produtoModel;
