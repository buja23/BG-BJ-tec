import Venda from '../models/VendaSchema.js';

export const getRelatorioDRE = async (req, res, next) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const matchStage = {};
    if (dataInicio && dataFim) {
      matchStage.createdAt = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim),
      };
    }

    const dreData = await Venda.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          receitaBruta: { $sum: { $add: ['$total', { $ifNull: ['$cupomAplicado.valorDesconto', 0] }] } },
          totalDescontos: { $sum: { $ifNull: ['$cupomAplicado.valorDesconto', 0] } },
          custoMercadoriaVendida: { $sum: '$custoTotal' },
        }
      },
      {
        $project: {
          _id: 0,
          receitaBruta: 1,
          totalDescontos: 1,
          receitaLiquida: { $subtract: ['$receitaBruta', '$totalDescontos'] },
          custoMercadoriaVendida: 1,
          lucroBruto: { $subtract: [{ $subtract: ['$receitaBruta', '$totalDescontos'] }, '$custoMercadoriaVendida'] }
        }
      }
    ]);

    // Se não houver vendas, retorna um objeto zerado
    const resultado = dreData[0] || {
      receitaBruta: 0,
      totalDescontos: 0,
      receitaLiquida: 0,
      custoMercadoriaVendida: 0,
      lucroBruto: 0,
    };

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};