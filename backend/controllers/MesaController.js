import Mesa from '../models/MesaSchema.js';
import Produto from '../models/ProdutoSchema.js';
import Venda from '../models/VendaSchema.js';
import mongoose from 'mongoose';

// Retorna todas as mesas
export const getMesas = async (req, res, next) => {
  try {
    // Adicionamos .populate('cliente') para trazer os dados do cliente vinculado
    const mesas = await Mesa.find()
      .populate('cliente', 'nome') // Popula o campo 'cliente' e seleciona apenas o campo 'nome'
      .sort({ numero: 1 });
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
    const { clienteId } = req.body; // Recebe o ID do cliente opcionalmente

    const mesa = await Mesa.findById(mesaId);

    if (!mesa) {
      return res.status(404).json({ message: 'Mesa não encontrada.' });
    }

    // VERIFICAÇÃO: Garante que um cliente não pode ocupar duas mesas abertas.
    if (clienteId) {
      const mesaJaOcupada = await Mesa.findOne({ cliente: clienteId, status: 'aberta' });
      if (mesaJaOcupada) {
        return res.status(400).json({ message: `Este cliente já está com a mesa ${mesaJaOcupada.numero} aberta.` });
      }
    }

    // AQUI É ONDE O VÍNCULO ACONTECE EFETIVAMENTE
    if (clienteId) {
      mesa.cliente = clienteId; // Vincula o cliente à mesa
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

    const produto = await Produto.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    if (produto.qtd < quantidade) {
      throw new Error('Estoque insuficiente para este produto.');
    }

    produto.qtd -= quantidade;
    await produto.save();

    const mesa = await Mesa.findById(mesaId);
    if (!mesa || mesa.status === 'fechada') {
      throw new Error('Mesa não encontrada ou está fechada.');
    }

    // Lógica alterada: Sempre adiciona um novo item, sem agrupar.
    // A quantidade vinda do frontend é sempre 1 por clique.
    mesa.produtos.push({
      produto: produto._id,
      quantidade: quantidade,
      precoUnitario: produto.preco,
      nomeProduto: produto.nome
    });

    mesa.valorTotal = mesa.produtos.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
    await mesa.save();

    res.status(200).json(mesa);
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
      throw new Error('Mesa não encontrada.');
    }

    const itemIndex = mesa.produtos.findIndex(p => p._id.toString() === produtoConsumidoId);
    if (itemIndex === -1) {
      throw new Error('Item não encontrado na comanda.');
    }

    const [itemRemovido] = mesa.produtos.splice(itemIndex, 1);
    await Produto.findByIdAndUpdate(itemRemovido.produto, { $inc: { qtd: itemRemovido.quantidade } });

    mesa.valorTotal = mesa.produtos.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
    await mesa.save();
    res.status(200).json(mesa);
  } catch (error) {
    next(error);
  }
};

// Fecha uma mesa, gerando uma venda
export const fecharMesa = async (req, res, next) => {
  try {
    const { mesaId } = req.params;
    const { formaPagamento, totalComDesconto, cupomAplicado } = req.body;

    // CORREÇÃO: Popula tanto o cliente quanto os produtos dentro da comanda.
    const mesa = await Mesa.findById(mesaId).populate('cliente').populate('produtos.produto');

    if (!mesa || mesa.status === 'fechada') {
      return res.status(404).json({ message: 'Mesa não encontrada ou já está fechada.' });
    }

    // Se a mesa tiver um cliente vinculado, usa os dados dele.
    // Senão, cria um cliente genérico para a venda.
    const clienteDaVenda = mesa.cliente ? {
      _id: mesa.cliente._id,
      nome: mesa.cliente.nome
    } : {
      _id: new mongoose.Types.ObjectId(),
      nome: `Avulso - Mesa ${mesa.numero}`
    };

    // Calcula o custo total dos produtos vendidos na mesa
    const custoTotal = mesa.produtos.reduce((acc, item) => {
      // CORREÇÃO: Garante que, se um produto não tiver custo, ele seja tratado como 0.
      return acc + ((item.produto?.custo || 0) * item.quantidade);
    }, 0);

    // 1. Cria a Venda
    const vendaData = {
      cliente: clienteDaVenda,
      produtos: mesa.produtos.map(p => ({
        produto: { _id: p.produto._id, nome: p.nomeProduto, preco: p.precoUnitario, custo: p.produto.custo },
        quantidade: p.quantidade,
        subtotal: p.precoUnitario * p.quantidade
      })),
      formaPagamento: formaPagamento || 'dinheiro',
      total: totalComDesconto ?? mesa.valorTotal, // Usa o total com desconto se fornecido
      status: 'concluida',
      cupomAplicado: cupomAplicado || null,
      custoTotal: custoTotal // Salva o custo total na venda
    };
    await Venda.create(vendaData);

    // 2. Reseta a mesa
    mesa.status = 'fechada';
    mesa.produtos = [];
    mesa.valorTotal = 0;
    mesa.dataAbertura = null;
    mesa.cliente = null; // Desvincula o cliente da mesa

    const mesaFechada = await mesa.save();
    res.json(mesaFechada);
  } catch (error) {
    next(error);
  }
};

// Vincula um cliente a uma mesa já aberta
export const vincularCliente = async (req, res, next) => {
  try {
    const { mesaId } = req.params;
    const { clienteId } = req.body;

    if (!clienteId) {
      return res.status(400).json({ message: 'O ID do cliente é obrigatório.' });
    }

    // CORREÇÃO: Garante que o cliente não está em outra mesa aberta
    const mesaJaOcupada = await Mesa.findOne({ cliente: clienteId, status: 'aberta' });
    if (mesaJaOcupada) {
      return res.status(400).json({ message: `Este cliente já está com a mesa ${mesaJaOcupada.numero} aberta.` });
    }

    // Popula o cliente na resposta para que o frontend atualize corretamente
    const mesa = await Mesa.findByIdAndUpdate(mesaId, { cliente: clienteId }, { new: true })
      .populate('cliente', 'nome');
    if (!mesa) return res.status(404).json({ message: 'Mesa não encontrada.' });

    res.status(200).json(mesa);
  } catch (error) {
    next(error);
  }
};

// Desvincula um cliente de uma mesa
export const desvincularCliente = async (req, res, next) => {
  try {
    console.log('2. [BACKEND] Rota desvincularCliente alcançada.');
    const { mesaId } = req.params;
    console.log('[BACKEND] ID da Mesa recebido:', mesaId);

    const mesa = await Mesa.findById(mesaId);
    if (!mesa) return res.status(404).json({ message: 'Mesa não encontrada.' });

    // Define o campo cliente como nulo e salva
    mesa.cliente = null; 
    const mesaAtualizada = await mesa.save();
    console.log('[BACKEND] Mesa atualizada no DB. Enviando de volta:', mesaAtualizada);

    // Retorna a mesa atualizada. O campo 'cliente' agora é nulo.
    res.status(200).json(mesaAtualizada);
  } catch (error) {
    console.error('ERRO no backend ao desvincular:', error);
    next(error);
  }
};
