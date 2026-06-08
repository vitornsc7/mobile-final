const express = require('express');
const authMiddleware = require('../authentication/authMiddleware');
const servicoLimiteMensal = require('../services/monthlyLimitService');

const roteador = express.Router();

roteador.use(authMiddleware);

roteador.get('/', (req, res, next) => {
  try {
    const mesReferencia = req.query.mes || req.query.month;
    const limites = servicoLimiteMensal.listarLimitesMensais(req.user.id, mesReferencia);
    return res.json(limites);
  } catch (erro) {
    return next(erro);
  }
});

roteador.post('/', (req, res, next) => {
  try {
    const limite = servicoLimiteMensal.criarLimiteMensal(req.user.id, req.body);
    return res.status(201).json(limite);
  } catch (erro) {
    return next(erro);
  }
});

roteador.put('/:id', (req, res, next) => {
  try {
    const limite = servicoLimiteMensal.atualizarLimiteMensal(req.user.id, req.params.id, req.body);
    return res.json(limite);
  } catch (erro) {
    return next(erro);
  }
});

roteador.delete('/:id', (req, res, next) => {
  try {
    servicoLimiteMensal.excluirLimiteMensal(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
});

module.exports = roteador;
