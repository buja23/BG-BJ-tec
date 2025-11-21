import mongoose from 'mongoose';

const caixaSchema = new mongoose.Schema({
  valorAbertura: { type: Number, required: true },
  dataAbertura: { type: Date, required: true, default: Date.now },
  responsavelAbertura: { type: String, required: true },
  
  valorFechamento: { type: Number },
  dataFechamento: { type: Date },
  responsavelFechamento: { type: String },

  totalVendas: { type: Number, default: 0 },
  diferenca: { type: Number, default: 0 },

  status: { 
    type: String, 
    required: true, 
    enum: ['aberto', 'fechado'], 
    default: 'aberto' 
  },
}, { timestamps: true });

const CaixaModel = mongoose.model('Caixa', caixaSchema);
export default CaixaModel;
