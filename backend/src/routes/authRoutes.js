const express = require('express');
const authService = require('../services/authService');

const roteador = express.Router();

roteador.post('/signup', async (req, res, next) => {
  try {
    const resultado = await authService.signup(req.body);
    return res.status(201).json(resultado);
  } catch (erro) {
    if (erro.status) {
      return res.status(erro.status).json({ message: erro.message });
    }
    return next(erro);
  }
});

roteador.post('/signin', async (req, res, next) => {
  try {
    const resultado = await authService.signin(req.body);
    return res.status(200).json(resultado);
  } catch (erro) {
    if (erro.status) {
      return res.status(erro.status).json({ message: erro.message });
    }
    return next(erro);
  }
});

module.exports = roteador;
