import React from 'react';
import { Card, Statistic, Form, DatePicker, Select, Button } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinanceiroPage = () => {
  const financeiroResumo = {
    receitaMes: 25000.00,
    despesasMes: 18000.00,
    lucroMes: 7000.00,
    ticketMedio: 85.50
  };

  return (
    <div>
      <Card title="Resumo Financeiro" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          <Statistic title="Receita do Mês" value={financeiroResumo.receitaMes} precision={2} prefix="R$" />
          <Statistic title="Despesas do Mês" value={financeiroResumo.despesasMes} precision={2} prefix="R$" />
          <Statistic title="Lucro do Mês" value={financeiroResumo.lucroMes} precision={2} prefix="R$" />
          <Statistic title="Ticket Médio" value={financeiroResumo.ticketMedio} precision={2} prefix="R$" />
        </div>
      </Card>
      
      <Card title="Relatórios">
        <Form layout="inline">
          <Form.Item label="Período">
            <RangePicker />
          </Form.Item>
          <Form.Item label="Tipo de Relatório">
            <Select defaultValue="vendas" style={{ width: 200 }}>
              <Option value="vendas">Vendas</Option>
              <Option value="despesas">Despesas</Option>
              <Option value="lucro">Lucro</Option>
            </Select>
          </Form.Item>
          <Button type="primary">Gerar Relatório</Button>
        </Form>
      </Card>
    </div>
  );
};

export default FinanceiroPage;
