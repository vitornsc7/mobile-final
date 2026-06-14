const fs = require('fs');
const path = require('path');

function caminhoDb() {
  if (process.env.NODE_ENV === 'test') {
    return path.resolve(__dirname, '../../db.test.json');
  }
  return path.resolve(__dirname, '../../data/db.json');
}

function lerBanco() {
  const arquivo = caminhoDb();
  if (!fs.existsSync(arquivo)) {
    return { users: [], despesas: [], limitesMensais: [] };
  }
  return JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
}

function escreverBanco(banco) {
  fs.writeFileSync(caminhoDb(), JSON.stringify(banco, null, 2));
}

function create(user) {
  const banco = lerBanco();
  if (!banco.users) banco.users = [];
  banco.users.push(user);
  escreverBanco(banco);
  return user;
}

function findByEmail(email) {
  const banco = lerBanco();
  return (banco.users || []).find((u) => u.email === email) || null;
}

function findById(id) {
  const banco = lerBanco();
  return (banco.users || []).find((u) => u.id === id) || null;
}

function findByToken(token) {
  const banco = lerBanco();
  return (banco.users || []).find((u) => u.token === token) || null;
}

function update(user) {
  const banco = lerBanco();
  const indice = (banco.users || []).findIndex((u) => u.id === user.id);
  if (indice === -1) return;
  banco.users[indice] = user;
  escreverBanco(banco);
}

module.exports = { create, findByEmail, findById, findByToken, update };
