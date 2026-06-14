const express = require('express');
const authMiddleware = require('../authentication/authMiddleware');
const servicoDespesa = require('../services/expenseService');

const roteador = express.Router();

roteador.use(authMiddleware);

roteador.get('/', async (req, res, next) => {
  try {
    const mesReferencia = req.query.mes || req.query.month;
    const despesas = await servicoDespesa.listarDespesas(req.user.id, mesReferencia);
    return res.json(despesas);
  } catch (erro) {
    return next(erro);
  }
});

roteador.post('/', async (req, res, next) => {
  try {
    const despesa = await servicoDespesa.criarDespesa(req.user.id, req.body);
    return res.status(201).json(despesa);
  } catch (erro) {
    return next(erro);
  }
});

roteador.put('/:id', async (req, res, next) => {
  try {
    const despesa = await servicoDespesa.atualizarDespesa(req.user.id, req.params.id, req.body);
    return res.json(despesa);
  } catch (erro) {
    return next(erro);
  }
});

roteador.delete('/:id', async (req, res, next) => {
  try {
    await servicoDespesa.excluirDespesa(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
});

module.exports = roteador;

