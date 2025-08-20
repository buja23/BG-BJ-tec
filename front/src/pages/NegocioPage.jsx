import React from 'react';
import { Card, Form, Input, Button } from 'antd';

const NegocioPage = () => {
  const onFinish = (values) => {
    console.log('Configurações salvas:', values);
  };

  return (
    <Card title="Meu Negócio">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Nome do Estabelecimento" name="nome">
          <Input placeholder="Restaurante Delícia" />
        </Form.Item>
        <Form.Item label="CNPJ" name="cnpj">
          <Input placeholder="00.000.000/0000-00" />
        </Form.Item>
        <Form.Item label="Endereço" name="endereco">
          <Input placeholder="Av. Principal, 1234" />
        </Form.Item>
        <Form.Item label="Telefone" name="telefone">
          <Input placeholder="(11) 9999-9999" />
        </Form.Item>
        <Form.Item label="Horário de Funcionamento" name="horario">
          <Input placeholder="Seg-Sex: 11h-23h, Sáb-Dom: 12h-24h" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Salvar Configurações</Button>
      </Form>
    </Card>
  );
};

export default NegocioPage;
