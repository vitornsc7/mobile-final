const fs = require('fs');
const path = require('path');

const caminhoBanco = path.join(__dirname, '..', '..', 'data', 'db.json');
const bancoInicial = {
  despesas: [],
  limitesMensais: [],
};

function garantirBanco() {
  const diretorio = path.dirname(caminhoBanco);

  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true });
  }

  if (!fs.existsSync(caminhoBanco)) {
    fs.writeFileSync(caminhoBanco, JSON.stringify(bancoInicial, null, 2));
  }
}

function lerBanco() {
  garantirBanco();
  const conteudo = fs.readFileSync(caminhoBanco, 'utf-8');
  return JSON.parse(conteudo);
}

function escreverBanco(banco) {
  garantirBanco();
  fs.writeFileSync(caminhoBanco, JSON.stringify(banco, null, 2));
}

module.exports = {
  lerBanco,
  escreverBanco,
};
