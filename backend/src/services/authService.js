const bcrypt = require('bcryptjs');
const { gerarToken } = require('../utils/token');
const userRepository = require('../repositories/userRepository');

function publicUser(user) {
  const { senha, token, ...dados } = user;
  return dados;
}

async function signup({ nome, email, senha, dataNascimento }) {
  if (userRepository.findByEmail(email)) {
    const err = new Error('E-mail já cadastrado');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(senha, 8);
  const token = gerarToken();

  const user = userRepository.create({
    id: 'u_' + Date.now(),
    nome,
    email,
    senha: hash,
    dataNascimento,
    token,
    createdAt: new Date().toISOString(),
  });

  return { token, user: publicUser(user) };
}

async function signin({ email, senha }) {
  const user = userRepository.findByEmail(email);

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    const err = new Error('E-mail ou senha inválidos');
    err.status = 401;
    throw err;
  }

  user.token = gerarToken();
  userRepository.update(user);

  return { token: user.token, user: publicUser(user) };
}

module.exports = { signup, signin };
