import Cliente from '../models/ClienteSchema.js';

// Criar um novo cliente
export const createCliente = async (req, res, next) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    next(error);
  }
};

// Obter todos os clientes
export const getClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find().sort({ nome: 1 });
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

// Atualizar um cliente
export const updateCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

// Deletar um cliente
export const deleteCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.status(200).json({ message: 'Cliente deletado com sucesso.' });
  } catch (error) {
    next(error);
  }
};