const express = require('express');
const authMiddleware = require('../authentication/authMiddleware');
const servicoLimiteMensal = require('../services/monthlyLimitService');

const roteador = express.Router();

roteador.use(authMiddleware);

roteador.get('/', async (req, res, next) => {
  try {
    const mesReferencia = req.query.mes || req.query.month;
    const limites = await servicoLimiteMensal.listarLimitesMensais(req.user.id, mesReferencia);
    return res.json(limites);
  } catch (erro) {
    return next(erro);
  }
});

roteador.post('/', async (req, res, next) => {
  try {
    const limite = await servicoLimiteMensal.criarLimiteMensal(req.user.id, req.body);
    return res.status(201).json(limite);
  } catch (erro) {
    return next(erro);
  }
});

roteador.put('/:id', async (req, res, next) => {
  try {
    const limite = await servicoLimiteMensal.atualizarLimiteMensal(req.user.id, req.params.id, req.body);
    return res.json(limite);
  } catch (erro) {
    return next(erro);
  }
});

roteador.delete('/:id', async (req, res, next) => {
  try {
    await servicoLimiteMensal.excluirLimiteMensal(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
});

module.exports = roteador;

