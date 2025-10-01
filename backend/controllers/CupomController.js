import Cupom from '../models/Cupom.js';

const CupomController = {
  async listarCupons(req, res) {
    const cupons = await Cupom.find();
    res.json(cupons);
  },
  async criarCupom(req, res) {
    try {
      const cupom = await Cupom.create(req.body);
      res.status(201).json(cupom);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async atualizarCupom(req, res) {
    try {
      const { id } = req.params;
      const cupom = await Cupom.findByIdAndUpdate(id, req.body, { new: true });
      res.json(cupom);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async removerCupom(req, res) {
    try {
      const { id } = req.params;
      await Cupom.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async validarCupom(req, res) {
    const { codigo } = req.body;
    const cupom = await Cupom.findOne({ codigo, ativo: true });
    if (!cupom) return res.status(404).json({ error: 'Cupom não encontrado ou inativo.' });
    if (cupom.validade && new Date() > cupom.validade) return res.status(400).json({ error: 'Cupom expirado.' });
    res.json(cupom);
  }
};

export default CupomController;
