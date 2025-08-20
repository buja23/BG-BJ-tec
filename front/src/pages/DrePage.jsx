import React from 'react';
import { Card, Statistic, Button } from 'antd';

const DrePage = () => {
  const dreResumo = {
    receitaAnual: 300000.00,
    custos: 150000.00,
    despesas: 100000.00,
    lucro: 50000.00
  };

  return (
    <Card title="Resumo DRE">
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <Statistic title="Receita Anual" value={dreResumo.receitaAnual} precision={2} prefix="R$" />
        <Statistic title="Custos" value={dreResumo.custos} precision={2} prefix="R$" />
        <Statistic title="Despesas" value={dreResumo.despesas} precision={2} prefix="R$" />
        <Statistic title="Lucro" value={dreResumo.lucro} precision={2} prefix="R$" />
      </div>
      
      <Button type="primary">Gerar DRE Completo</Button>
    </Card>
  );
};

export default DrePage;