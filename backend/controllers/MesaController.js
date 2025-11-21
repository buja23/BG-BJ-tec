import Mesa from '../models/MesaSchema.js';
import Produto from '../models/ProdutoSchema.js';
import Venda from '../models/VendaSchema.js';
import mongoose from 'mongoose';

// Retorna todas as mesas
export const getMesas = async (req, res, next) => {
  try {
    const mesas = await Mesa.find().sort({ numero: 1 });
    res.json(mesas);
  } catch (error) {
    next(error);
  }
};

// Cria uma nova mesa com um número específico
export const abrirMesa = async (req, res, next) => {
  try {
    const { numero } = req.body;

    if (!numero) {
      return res.status(400).json({ message: 'O número da mesa é obrigatório.' });
    }

    // Verifica se já existe uma mesa com este número
    const mesaExistente = await Mesa.findOne({ numero });
    if (mesaExistente) {
      return res.status(400).json({ message: `A mesa de número ${numero} já existe.` });
    }

    // Cria a nova mesa, que por padrão terá o status 'fechada'
    const novaMesa = await Mesa.create({ numero });
    return res.status(201).json(novaMesa);
  } catch (error) {
    next(error);
  }
};

// Abre uma mesa específica que está fechada
export const abrirMesaEspecifica = async (req, res, next) => {
  try {
    const { mesaId } = req.params;
    const mesa = await Mesa.findById(mesaId);

    if (!mesa) {
      return res.status(404).json({ message: 'Mesa não encontrada.' });
    }

    mesa.status = 'aberta';
    mesa.dataAbertura = new Date();
    const mesaAberta = await mesa.save();
    res.status(200).json(mesaAberta);
  } catch (error) {
    next(error);
  }
};

// Adiciona um produto a uma mesa
export const adicionarProduto = async (req, res, next) => {
  try {
    const { mesaId } = req.params;
    const { produtoId, quantidade } = req.body;

    const mesa = await Mesa.findById(mesaId);
    const produto = await Produto.findById(produtoId);

    if (!mesa || !produto) {
      return res.status(404).json({ message: 'Mesa ou produto não encontrado.' });
    }

    mesa.produtos.push({
      produto: produto._id,
      quantidade: quantidade,
      precoUnitario: produto.preco,
      nomeProduto: produto.nome
    });

    // Recalcula o total
    mesa.valorTotal = mesa.produtos.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
    
    const mesaAtualizada = await mesa.save();
    res.json(mesaAtualizada);
  } catch (error) {
    next(error);
  }
};

// Remove um produto de uma mesa
export const removerProduto = async (req, res, next) => {
  try {
    const { mesaId, produtoConsumidoId } = req.params;

    const mesa = await Mesa.findById(mesaId);
    if (!mesa) {
      return res.status(404).json({ message: 'Mesa não encontrada.' });
    }

    // Usa o operador $pull do MongoDB para remover o subdocumento pelo seu _id
    mesa.produtos.pull({ _id: produtoConsumidoId });

    // Recalcula o valor total
    mesa.valorTotal = mesa.produtos.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);

    const mesaAtualizada = await mesa.save();
    res.json(mesaAtualizada);

  } catch (error) {
    console.error('Erro ao remover produto da mesa:', error);
    next(error);
  }
};

// Fecha uma mesa, gerando uma venda
export const fecharMesa = async (req, res, next) => {
  try {
    const { mesaId } = req.params;
    const { formaPagamento, cliente } = req.body;

    const mesa = await Mesa.findById(mesaId);
    if (!mesa || mesa.status === 'fechada') {
      return res.status(404).json({ message: 'Mesa não encontrada ou já está fechada.' });
    }

    // CORREÇÃO: Garante que o cliente genérico tenha um _id.
    // Se nenhum cliente for passado no corpo da requisição, cria um cliente genérico para a venda.
    const clienteDaVenda = cliente || {
      _id: new mongoose.Types.ObjectId(), // Gera um novo ID de objeto válido
      nome: `Mesa ${mesa.numero}`
    };

    // 1. Cria a Venda
    const vendaData = {
      cliente: clienteDaVenda,
      produtos: mesa.produtos.map(p => ({
        produto: { _id: p.produto, nome: p.nomeProduto, preco: p.precoUnitario },
        quantidade: p.quantidade,
        subtotal: p.precoUnitario * p.quantidade
      })),
      formaPagamento: formaPagamento || 'dinheiro',
      total: mesa.valorTotal,
      status: 'concluida'
    };
    await Venda.create(vendaData);

    // 2. Reseta a mesa
    mesa.status = 'fechada';
    mesa.produtos = [];
    mesa.valorTotal = 0;
    mesa.dataAbertura = null;

    const mesaFechada = await mesa.save();
    res.json(mesaFechada);
  } catch (error) {
    next(error);
  }
};
