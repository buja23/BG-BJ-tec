import React from 'react';
import { Card, Table } from 'antd';

const RankingPage = () => {
  const rankingAtendimentos = [
    { key: '1', funcionario: 'João Silva', atendimentos: 25, valorTotal: 3250.00 },
    { key: '2', funcionario: 'Maria Souza', atendimentos: 18, valorTotal: 2850.00 },
  ];

  return (
    <Card title="Ranking de Atendimentos">
      <Table 
        columns={[
          { title: 'Funcionário', dataIndex: 'funcionario', key: 'funcionario' },
          { title: 'Atendimentos', dataIndex: 'atendimentos', key: 'atendimentos' },
          { title: 'Valor Total', dataIndex: 'valorTotal', key: 'valorTotal', render: val => `R$ ${val.toFixed(2)}` },
        ]}
        dataSource={rankingAtendimentos}
      />
    </Card>
  );
};

export default RankingPage;