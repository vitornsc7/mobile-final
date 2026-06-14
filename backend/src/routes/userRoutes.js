const express = require('express');
const authMiddleware = require('../authentication/authMiddleware');
const userRepository = require('../repositories/userRepository');

const roteador = express.Router();

roteador.use(authMiddleware);

roteador.get('/me', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    const { senha, token, ...dados } = user;
    return res.json(dados);
  } catch (err) {
    return next(err);
  }
});

module.exports = roteador;

