const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Olá, mundo!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
git