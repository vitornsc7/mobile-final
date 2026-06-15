const bcrypt = require('bcryptjs');
const { gerarToken } = require('../utils/token');
const userRepository = require('../repositories/userRepository');

function publicUser(user) {
  const { senha, token, ...dados } = user;
  return dados;
}

function criarErro400(mensagem) {
  const err = new Error(mensagem);
  err.status = 400;
  return err;
}

function validarSignup({ nome, email, senha, dataNascimento }) {
  if (!nome || !nome.trim()) throw criarErro400('Nome é obrigatório.');
  if (!email || !/\S+@\S+\.\S+/.test(email.trim())) throw criarErro400('E-mail inválido.');
  if (!senha || senha.length < 6) throw criarErro400('Senha deve ter no mínimo 6 caracteres.');

  if (!dataNascimento) throw criarErro400('Data de nascimento é obrigatória.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) throw criarErro400('Data de nascimento inválida.');

  const [ano, mes, dia] = dataNascimento.split('-').map(Number);
  const dataObj = new Date(ano, mes - 1, dia);

  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() + 1 !== mes ||
    dataObj.getDate() !== dia
  ) {
    throw criarErro400('Data de nascimento inválida.');
  }

  if (ano < 1900) throw criarErro400('Ano de nascimento implausível.');
  if (dataObj > new Date()) throw criarErro400('Data de nascimento não pode ser futura.');
}

function validarSignin({ email, senha }) {
  if (!email || !email.trim()) throw criarErro400('E-mail é obrigatório.');
  if (!senha || !senha.trim()) throw criarErro400('Senha é obrigatória.');
}

async function signup({ nome, email, senha, dataNascimento }) {
  validarSignup({ nome, email, senha, dataNascimento });

  const emailNormalizado = email.trim().toLowerCase();

  if (userRepository.findByEmail(emailNormalizado)) {
    const err = new Error('E-mail já cadastrado');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(senha, 8);
  const token = gerarToken();

  const user = await userRepository.create({
    id: 'u_' + Date.now(),
    nome: nome.trim(),
    email: emailNormalizado,
    senha: hash,
    dataNascimento,
    token,
    createdAt: new Date(),
  });

  return { token, user: publicUser(user) };
}

async function signin({ email, senha }) {
  validarSignin({ email, senha });

  const emailNormalizado = email.trim().toLowerCase();
  const user = await userRepository.findByEmail(emailNormalizado);

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    const err = new Error('E-mail ou senha inválidos');
    err.status = 401;
    throw err;
  }

  user.token = gerarToken();
  await userRepository.update(user);

  return { token: user.token, user: publicUser(user) };
}

module.exports = { signup, signin, publicUser };
