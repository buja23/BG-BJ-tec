import Caixa from '../models/CaixaSchema.js';
import Venda from '../models/VendaSchema.js';

// Função para buscar o status atual do caixa
export const getStatusAtual = async (req, res, next) => {
  try {
    const caixaAberto = await Caixa.findOne({ status: 'aberto' });

    if (!caixaAberto) {
      return res.json({ status: 'fechado' });
    }

    // Calcula o total de vendas desde a abertura do caixa
    const vendas = await Venda.find({
      data: { $gte: caixaAberto.dataAbertura }
    });
    const totalVendas = vendas.reduce((acc, venda) => acc + venda.total, 0);
    const saldoEsperado = caixaAberto.valorAbertura + totalVendas;

    res.json({
      status: 'aberto',
      caixa: caixaAberto,
      totalVendas,
      saldoEsperado
    });
  } catch (error) {
    next(error);
  }
};

// Função para abrir um novo caixa
export const abrirCaixa = async (req, res, next) => {
  try {
    const { valorAbertura, responsavelAbertura } = req.body;

    const caixaJaAberto = await Caixa.findOne({ status: 'aberto' });
    if (caixaJaAberto) {
      return res.status(400).json({ message: 'Já existe um caixa aberto.' });
    }

    const novoCaixa = await Caixa.create({ valorAbertura, responsavelAbertura });
    res.status(201).json(novoCaixa);
  } catch (error) {
    next(error);
  }
};

// Função para fechar o caixa atual
export const fecharCaixa = async (req, res, next) => {
  try {
    const { valorFechamento, responsavelFechamento } = req.body;
    const caixaAberto = await Caixa.findOne({ status: 'aberto' });

    if (!caixaAberto) {
      return res.status(404).json({ message: 'Nenhum caixa aberto para fechar.' });
    }

    // Calcula o total de vendas
    const vendas = await Venda.find({
      data: { $gte: caixaAberto.dataAbertura, $lte: new Date() }
    });
    const totalVendas = vendas.reduce((acc, venda) => acc + venda.total, 0);
    const saldoEsperado = caixaAberto.valorAbertura + totalVendas;
    const diferenca = valorFechamento - saldoEsperado;

    // Atualiza o documento do caixa
    caixaAberto.status = 'fechado';
    caixaAberto.valorFechamento = valorFechamento;
    caixaAberto.responsavelFechamento = responsavelFechamento;
    caixaAberto.dataFechamento = new Date();
    caixaAberto.totalVendas = totalVendas;
    caixaAberto.diferenca = diferenca;

    const caixaFechado = await caixaAberto.save();
    res.json(caixaFechado);
  } catch (error) {
    next(error);
  }
};

// Função para buscar o histórico de caixas fechados
export const getHistorico = async (req, res, next) => {
  try {
    const historico = await Caixa.find({ status: 'fechado' }).sort({ dataAbertura: -1 });
    res.json(historico);
  } catch (error) {
    next(error);
  }
};
