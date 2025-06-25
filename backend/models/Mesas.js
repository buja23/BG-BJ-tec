import mongoose from 'mongoose';

const ProdutoMesaSchema = new mongoose.Schema({
  produtoId: { type: String, required: true },
  nome: String,
  preco: Number,
  qtd: Number
}, { _id: false });

const MesaSchema = new mongoose.Schema({
  mesa: { type: String, required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  produtos: [ProdutoMesaSchema],
  status: { type: String, enum: ['aberta', 'fechada'], default: 'aberta' },
  valorTotal: { type: Number, default: 0 },
  abertoEm: { type: Date, default: Date.now },
  fechadoEm: Date,
  historico: [Object]
}, { timestamps: true });

export default mongoose.model('Mesa', MesaSchema);
