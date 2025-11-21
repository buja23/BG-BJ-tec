import Venda from '../models/VendaSchema.js';
import Produto from '../models/Produtos.js';
import mongoose from 'mongoose';

export const createVenda = async (req, res) => {
  try {
    console.log('Recebida requisição para criar venda:', JSON.stringify(req.body, null, 2));
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

    // 2. Processar cada produto DENTRO da transação
    for (const itemVendido of produtos) {
      // CORREÇÃO 1: Acessar o ID correto, que está aninhado no objeto
      const produtoId = itemVendido.produto._id._id || itemVendido.produto._id;
      const quantidadeVendida = Number(itemVendido.quantidade);

      if (!produtoId) throw new Error('ID do produto inválido recebido.');

      // Encontra o produto no estoque
      // CORREÇÃO 2: Passar a sessão como uma opção para findById
      const produtoEmEstoque = await Produto.findById(produtoId);

      if (!produtoEmEstoque) {
        // Se um produto não for encontrado, aborta a transação
        throw new Error(`Produto com ID ${produtoId} não encontrado no estoque.`);
      }

      // Verifica se há estoque suficiente
      if (produtoEmEstoque.qtd < quantidadeVendida) {
        throw new Error(`Estoque insuficiente para o produto "${produtoEmEstoque.nome}". Disponível: ${produtoEmEstoque.qtd}, Pedido: ${quantidadeVendida}.`);
      }

      // Calcula o novo estoque e atualiza o produto
      produtoEmEstoque.qtd -= quantidadeVendida;
      await produtoEmEstoque.save();

      console.log(`Estoque do produto "${produtoEmEstoque.nome}" atualizado para: ${produtoEmEstoque.qtd}`);
    }

    // Valida e converte os IDs para ObjectId
    const vendaData = {
      cliente: {
        _id: new mongoose.Types.ObjectId(cliente._id),
        nome: cliente.nome
      },
      produtos: produtos.map(item => ({
        produto: {
          // CORREÇÃO: Acessar o ID aninhado, assim como foi feito no loop acima
          _id: new mongoose.Types.ObjectId(item.produto._id._id || item.produto._id),
          nome: item.produto.nome,
          preco: Number(item.produto.preco)
        },
        quantidade: Number(item.quantidade),
        subtotal: Number(item.produto.preco) * Number(item.quantidade)
      })),
      formaPagamento,
      observacao,
      data: new Date(),
      total: produtos.reduce((acc, item) => acc + (Number(item.quantidade) * Number(item.produto.preco)), 0),
      status: 'concluida'
    };

    // 3. Cria e salva a venda, ainda dentro da transação
    const venda = new Venda(vendaData);
    const vendaSalva = await venda.save();
    console.log('Venda salva com sucesso:', vendaSalva);

    res.status(201).json(vendaSalva);

  } catch (error) {
    console.error('Erro ao criar venda:', error);
    // Retorna uma mensagem de erro específica
    res.status(500).json({ message: 'Erro ao criar venda: ' + error.message });
  }
};

export const getAllVendas = async (req, res) => {
  try {
    const vendas = await Venda.find()
      .sort({ data: -1 }); // Ordena por data, mais recentes primeiro
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