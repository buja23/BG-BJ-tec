import mongoose from 'mongoose';

const CupomSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['percentual', 'valor'], required: true }, // percentual (%) ou valor (R$)
  valor: { type: Number, required: true },
  validade: { type: Date },
  ativo: { type: Boolean, default: true },
  usoUnico: { type: Boolean, default: false },
  usadoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mesa' }],
  criadoEm: { type: Date, default: Date.now }
});

const Cupom = mongoose.model('Cupom', CupomSchema);
export default Cupom;
