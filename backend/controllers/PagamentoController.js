import crypto from 'crypto';

export const processarPagamento = async (req, res) => {
  const { valor, formaPagamento } = req.body;

  console.log(`[Pagamento] Recebida tentativa de pagamento de R$${valor} via ${formaPagamento}`);

  // Simula um tempo de processamento
  const delay = formaPagamento.includes('cartao') ? 3000 : 500;

  setTimeout(() => {
    let sucesso = true;
    let mensagem = 'Pagamento aprovado com sucesso!';

    // Lógica de simulação para cartões
    if (formaPagamento.includes('cartao')) {
      // Simula recusa para valores "quebrados" terminando em .99
      if (valor.toFixed(2).endsWith('.99')) {
        sucesso = false;
        mensagem = 'Pagamento recusado pela operadora do cartão.';
      }
    }

    if (sucesso) {
      console.log(`[Pagamento] Aprovado. TransactionID: ${crypto.randomUUID()}`);
      res.status(200).json({
        sucesso: true,
        mensagem: mensagem,
        transactionId: crypto.randomUUID(),
      });
    } else {
      console.log(`[Pagamento] Recusado. Motivo: ${mensagem}`);
      res.status(400).json({ sucesso: false, mensagem });
    }
  }, delay);
};