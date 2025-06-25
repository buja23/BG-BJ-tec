import Mesa from '../models/Mesas.js';

// Abrir nova mesa
export const abrirMesa = async (req, res) => {
  try {
    const { mesa, cliente } = req.body;
    const novaMesa = await Mesa.create({ mesa, cliente });
    res.status(201).json(novaMesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Adicionar produto à mesa
export const adicionarProduto = async (req, res) => {
  try {
    const { produtoId, nome, preco, qtd } = req.body;
    const mesa = await Mesa.findById(req.params.id);
    if (!mesa || mesa.status !== 'aberta') return res.status(404).json({ error: 'Mesa não encontrada ou já fechada' });
    mesa.produtos.push({ produtoId, nome, preco, qtd });
    mesa.valorTotal += preco * qtd;
    await mesa.save();
    res.json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fechar mesa
export const fecharMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findById(req.params.id);
    if (!mesa || mesa.status !== 'aberta') return res.status(404).json({ error: 'Mesa não encontrada ou já fechada' });
    mesa.status = 'fechada';
    mesa.fechadoEm = new Date();
    await mesa.save();
    res.json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar mesas (todas, abertas, fechadas)
export const listarMesas = async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = status ? { status } : {};
    const mesas = await Mesa.find(filtro).populate('cliente');
    res.json(mesas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Detalhar uma mesa
export const detalharMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findById(req.params.id).populate('cliente');
    if (!mesa) return res.status(404).json({ error: 'Mesa não encontrada' });
    res.json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remover mesa (opcional)
export const removerMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByIdAndDelete(req.params.id);
    if (!mesa) return res.status(404).json({ error: 'Mesa não encontrada' });
    res.json({ message: 'Mesa removida' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
