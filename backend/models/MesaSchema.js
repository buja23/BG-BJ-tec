import mongoose from 'mongoose';

const produtoConsumidoSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  quantidade: { type: Number, required: true },
  precoUnitario: { type: Number, required: true }, // Preço no momento da adição
  nomeProduto: { type: String, required: true }
}, { timestamps: true }); // Permitir _id e timestamps para cada item

const mesaSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  status: { type: String, enum: ['aberta', 'fechada'], default: 'fechada' },
  produtos: [produtoConsumidoSchema],
  valorTotal: { type: Number, default: 0 },
  dataAbertura: { type: Date },
}, { timestamps: true });

const MesaModel = mongoose.model('Mesa', mesaSchema);
export default MesaModel;
