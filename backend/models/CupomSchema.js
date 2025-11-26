import mongoose from 'mongoose';

const CupomSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // Salva sempre em maiúsculas
  },
  tipo: {
    type: String,
    enum: ['percentual', 'fixo'], // Tipo de desconto
    required: true,
  },
  valor: {
    type: Number,
    required: true, // O valor do desconto (ex: 10 para 10% ou 10 para R$10)
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  dataExpiracao: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model('Cupom', CupomSchema);