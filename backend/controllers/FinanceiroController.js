import Venda from '../models/VendaSchema.js';
import mongoose from 'mongoose';

export const getRelatorioFinanceiro = async (req, res, next) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const matchStage = {};
    if (dataInicio && dataFim) {
      matchStage.createdAt = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim),
      };
    }

    // 1. Agregação para calcular totais por forma de pagamento
    const statsPorPagamento = await Venda.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$formaPagamento',
          totalVendido: { $sum: '$total' },
          numeroDeVendas: { $sum: 1 },
        },
      },
    ]);

    // 2. Cálculo dos totais gerais
    const faturamentoTotal = statsPorPagamento.reduce((acc, item) => acc + item.totalVendido, 0);
    const totalVendas = statsPorPagamento.reduce((acc, item) => acc + item.numeroDeVendas, 0);
    const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    // 3. Busca das últimas 100 vendas para a tabela
    const vendasRecentes = await Venda.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(100); // REMOVIDO: O .populate() estava causando o erro, pois o nome do cliente já está no documento da venda.

    // Formata os dados para o frontend
    const distribuicaoPagamento = statsPorPagamento.map(item => ({
      tipo: item._id,
      valor: item.totalVendido,
    }));

    res.status(200).json({
      faturamentoTotal,
      totalVendas,
      ticketMedio,
      distribuicaoPagamento,
      vendasRecentes,
    });

  } catch (error) {
    next(error);
  }
};