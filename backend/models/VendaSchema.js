import mongoose from 'mongoose';

const vendaSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  cliente: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
      },
      nome: String
    }, { _id: false })
  },
  produtos: [{
    produto: {
      type: new mongoose.Schema({
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Produto',
          required: true
        },
        nome: {
          type: String,
          required: true
        },
        preco: {
          type: Number,
          required: true
        }
      }, { _id: false })
    },
    quantidade: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  formaPagamento: {
    type: String,
    required: true,
    enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix']
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pendente', 'concluida', 'cancelada'],
    default: 'pendente'
  },
  observacao: String,
  cupomAplicado: {
    codigo: String,
    valorDesconto: Number,
  },
  custoTotal: { // Custo total dos produtos vendidos
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

// Middleware pre-save para calcular subtotais e total
vendaSchema.pre('save', function (next) {
  console.log('Calculando subtotais e total da venda...');
  console.log('Dados recebidos:', {
    cliente: this.cliente,
    produtos: this.produtos,
    formaPagamento: this.formaPagamento
  });

  if (!Array.isArray(this.produtos)) {
    console.error('Produtos não é um array!');
    throw new Error('Produtos inválidos');
  }

  // Garante que os valores são números
  this.produtos.forEach(item => {
    if (!item.produto || !item.produto.preco || !item.quantidade) {
      console.error('Item inválido:', item);
      throw new Error('Item com dados inválidos');
    }

    item.produto.preco = Number(item.produto.preco);
    item.quantidade = Number(item.quantidade);
    item.subtotal = item.produto.preco * item.quantidade;

    console.log(`Produto: ${item.produto.nome}`);
    console.log(`Preço: ${item.produto.preco}`);
    console.log(`Quantidade: ${item.quantidade}`);
    console.log(`Subtotal: ${item.subtotal}`);
  });

  // Calcula total da venda
  this.total = this.produtos.reduce((sum, item) => sum + item.subtotal, 0);
  console.log('Total final da venda:', this.total);

  next();
});

const Venda = mongoose.model('Venda', vendaSchema);
export default Venda;