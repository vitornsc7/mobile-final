const express = require('express');
const authMiddleware = require('../authentication/authMiddleware');
const userRepository = require('../repositories/userRepository');

const roteador = express.Router();

roteador.use(authMiddleware);

roteador.get('/me', (req, res) => {
  const user = userRepository.findById(req.user.id);
  const { senha, token, ...dados } = user;
  return res.json(dados);
});

module.exports = roteador;
