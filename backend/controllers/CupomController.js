import Cupom from '../models/CupomSchema.js';

// Criar um novo cupom
export const createCupom = async (req, res, next) => {
  try {
    const novoCupom = new Cupom(req.body);
    await novoCupom.save();
    res.status(201).json(novoCupom);
  } catch (error) {
    next(error);
  }
};

// Obter todos os cupons
export const getCupons = async (req, res, next) => {
  try {
    const cupons = await Cupom.find().sort({ createdAt: -1 });
    res.status(200).json(cupons);
  } catch (error) {
    next(error);
  }
};

// Atualizar um cupom
export const updateCupom = async (req, res, next) => {
  try {
    const cupom = await Cupom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cupom) return res.status(404).json({ message: 'Cupom não encontrado.' });
    res.status(200).json(cupom);
  } catch (error) {
    next(error);
  }
};

// Deletar um cupom
export const deleteCupom = async (req, res, next) => {
  try {
    const cupom = await Cupom.findByIdAndDelete(req.params.id);
    if (!cupom) return res.status(404).json({ message: 'Cupom não encontrado.' });
    res.status(200).json({ message: 'Cupom deletado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

// Validar um cupom para uso
export const validarCupom = async (req, res, next) => {
  try {
    const { codigo } = req.body;
    const cupom = await Cupom.findOne({ codigo: codigo.toUpperCase() });

    if (!cupom) return res.status(404).json({ message: 'Cupom inválido.' });
    if (!cupom.ativo) return res.status(400).json({ message: 'Este cupom não está mais ativo.' });
    if (cupom.dataExpiracao && cupom.dataExpiracao < new Date()) {
      return res.status(400).json({ message: 'Cupom expirado.' });
    }

    res.status(200).json(cupom);
  } catch (error) {
    next(error);
  }
};