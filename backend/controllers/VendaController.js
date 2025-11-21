import Venda from '../models/VendaSchema.js';
import Produto from '../models/Produtos.js';
import mongoose from 'mongoose';

export const createVenda = async (req, res) => {
  
  try {
    console.log('Recebida requisição para criar venda:', JSON.stringify(req.body, null, 2));
    console.log('Estado da conexão MongoDB:', mongoose.connection.readyState);
    console.log('Collections disponíveis:', await mongoose.connection.db.listCollections().toArray());
    
    const { cliente, produtos, formaPagamento, observacao } = req.body;

    // Validação básica
    if (!cliente || !produtos || !formaPagamento) {
      console.log('Dados incompletos:', { cliente, produtos, formaPagamento });
      return res.status(400).json({ 
        message: 'Dados incompletos. Cliente, produtos e forma de pagamento são obrigatórios.' 
      });
    }

    if (!produtos.length) {
      return res.status(400).json({ 
        message: 'A venda deve conter pelo menos um produto.' 
      });
    }

    console.log('Criando nova venda com dados:', {
      cliente,
      produtos,
      formaPagamento,
      observacao
    });

    // Valida e converte os IDs para ObjectId
    const vendaData = {
      cliente: {
        _id: new mongoose.Types.ObjectId(cliente._id),
        nome: cliente.nome
      },
      produtos: produtos.map(p => ({
        produto: {
          _id: new mongoose.Types.ObjectId(p.produto._id),
          nome: p.produto.nome,
          preco: Number(p.produto.preco)
        },
        quantidade: Number(p.quantidade),
        subtotal: Number(p.produto.preco) * Number(p.quantidade)
      })),
      formaPagamento,
      observacao,
      data: new Date(),
      total: produtos.reduce((acc, p) => acc + (Number(p.quantidade) * Number(p.produto.preco)), 0),
      status: 'concluida'
    };

    console.log('Dados formatados para criação:', vendaData);
    const venda = new Venda(vendaData);

    console.log('Modelo de venda criado:', venda);
    const vendaSalva = await venda.save();
    console.log('Venda salva com sucesso:', vendaSalva);
    res.status(201).json(vendaSalva);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ message: 'Erro interno ao criar venda' });
  }
};

export const getAllVendas = async (req, res) => {
  console.log('Recebida requisição para listar vendas');
  try {
    const vendas = await Venda.find()
      .sort({ data: -1 }); // Ordena por data, mais recentes primeiro
    console.log('Vendas encontradas:', vendas.length);
    res.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({ message: 'Erro interno ao buscar vendas' });
  }
};

export const getVendaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venda = await Venda.findById(id);
    
    if (!venda) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }
    
    res.json(venda);
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    res.status(500).json({ message: 'Erro interno ao buscar venda' });
  }
};

export const getVendasByUser = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const vendas = await Venda.find({ 'cliente._id': usuarioId })
      .sort({ data: -1 });
    res.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas do usuário:', error);
    res.status(500).json({ message: 'Erro interno ao buscar vendas do usuário' });
  }
};

export const getVendasByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      data: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    const vendas = await Venda.find(query).sort({ data: -1 });
    res.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas por período:', error);
    res.status(500).json({ message: 'Erro interno ao buscar vendas por período' });
  }
};