import Venda from '../models/VendaSchema.js';
import JsonExporter from '../adapters/JsonExporter.js';
import CsvAdapter from '../adapters/CsvAdapter.js';

export const exportarVendas = async (req, res, next) => {
  try {
    const { formato } = req.params;

    // 1. Busca os dados brutos do banco
    const vendas = await Venda.find()
      .select('createdAt cliente.nome produtos.produto.nome produtos.quantidade total formaPagamento -_id')
      .lean();

    // Formata os dados para um JSON simples
    const dadosFormatados = vendas.map(venda => ({
      data: new Date(venda.createdAt).toLocaleDateString('pt-BR'),
      cliente: venda.cliente.nome,
      produtos: venda.produtos.map(p => `${p.quantidade}x ${p.produto.nome}`).join('; '),
      forma_pagamento: venda.formaPagamento,
      total: venda.total.toFixed(2),
    }));

    let exporter;
    let contentType;
    let fileExtension;

    // 2. Decide qual exportador/adapter usar
    if (formato === 'csv') {
      exporter = new CsvAdapter();
      contentType = 'text/csv';
      fileExtension = 'csv';
    } else {
      exporter = new JsonExporter();
      contentType = 'application/json';
      fileExtension = 'json';
    }

    // 3. Usa o exportador para gerar o conteúdo e envia o arquivo para download
    const conteudoArquivo = exporter.export(dadosFormatados);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_vendas.${fileExtension}`);
    res.status(200).send(conteudoArquivo);

  } catch (error) {
    next(error);
  }
};