const express = require('express');
const rotasDespesas = require('./routes/expenseRoutes');
const rotasLimitesMensais = require('./routes/monthlyLimitRoutes');

const aplicativo = express();

aplicativo.use(express.json());

aplicativo.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

aplicativo.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

aplicativo.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

aplicativo.use('/expenses', rotasDespesas);
aplicativo.use('/monthly-limits', rotasLimitesMensais);

aplicativo.use((erro, req, res, next) => {
  if (erro.statusCode) {
    return res.status(erro.statusCode).json({ message: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

module.exports = aplicativo;
