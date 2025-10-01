import Carrinho from '../models/CarrinhoSchema.js';

export const adicionarAoCarrinho = async (req, res) => {
  const { usuarioId, produtoId, nome, preco, quantidade } = req.body;

  try {
    let carrinho = await Carrinho.findOne({ usuarioId });

    if (!carrinho) {
      carrinho = new Carrinho({ usuarioId, itens: [] });
    }

    const index = carrinho.itens.findIndex(item => item.produtoId.toString() === produtoId);
    if (index > -1) {
      // Produto já existe no carrinho, soma quantidade
      carrinho.itens[index].quantidade += quantidade;
    } else {
      carrinho.itens.push({ produtoId, nome, preco, quantidade });
    }

    carrinho.atualizadoEm = new Date();
    await carrinho.save();

    res.status(200).json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removerDoCarrinho = async (req, res) => {
  const { usuarioId, produtoId } = req.body;

  try {
    const carrinho = await Carrinho.findOne({ usuarioId });
    if (!carrinho) return res.status(404).json({ error: 'Carrinho não encontrado.' });

    carrinho.itens = carrinho.itens.filter(item => item.produtoId.toString() !== produtoId);
    carrinho.atualizadoEm = new Date();
    await carrinho.save();

    res.status(200).json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const limparCarrinho = async (req, res) => {
  const { usuarioId } = req.body;

  try {
    const carrinho = await Carrinho.findOne({ usuarioId });
    if (!carrinho) return res.status(404).json({ error: 'Carrinho não encontrado.' });

    carrinho.itens = [];
    carrinho.atualizadoEm = new Date();
    await carrinho.save();

    res.status(200).json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listarCarrinho = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const carrinho = await Carrinho.findOne({ usuarioId }).populate('itens.produtoId');
    if (!carrinho) return res.status(404).json({ itens: [] });

    res.status(200).json(carrinho);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
