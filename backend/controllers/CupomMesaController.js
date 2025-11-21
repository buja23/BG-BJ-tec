import Mesa from '../models/MesaSchema.js';
import Cupom from '../models/Cupom.js';

// Aplicar cupom de desconto em uma mesa
export const aplicarCupom = async (req, res) => {
  try {
    // Suporte a id da mesa vindo de req.params.id ou req.body.id
    const mesaId = req.params.id || req.body.id;
    const { codigo } = req.body;
    const mesa = await Mesa.findById(mesaId).populate('cupom');
    if (!mesa || mesa.status !== 'aberta') return res.status(404).json({ error: 'Mesa não encontrada ou já fechada' });
    const cupom = await Cupom.findOne({ codigo, ativo: true });
    if (!cupom) return res.status(404).json({ error: 'Cupom não encontrado ou inativo.' });
    if (cupom.validade && new Date() > cupom.validade) return res.status(400).json({ error: 'Cupom expirado.' });
    if (cupom.usoUnico && cupom.usadoPor.includes(mesa._id)) return res.status(400).json({ error: 'Cupom já utilizado nesta mesa.' });

    // Calcular desconto
    let desconto = 0;
    if (cupom.tipo === 'percentual') {
      desconto = mesa.valorTotal * (cupom.valor / 100);
    } else {
      desconto = cupom.valor;
    }
    desconto = Math.min(desconto, mesa.valorTotal); // nunca maior que o total
    mesa.cupom = cupom._id;
    mesa.desconto = desconto;
    mesa.valorTotal = mesa.valorTotal - desconto;
    await mesa.save();
    // Marcar cupom como usado por esta mesa (se uso único)
    if (cupom.usoUnico) {
      cupom.usadoPor.push(mesa._id);
      await cupom.save();
    }
    res.json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
