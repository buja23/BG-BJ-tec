import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true, min: 1 }
});

const carrinhoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  itens: [itemSchema],
  atualizadoEm: { type: Date, default: Date.now }
});

const Carrinho = mongoose.model('Carrinho', carrinhoSchema);

export default Carrinho;
