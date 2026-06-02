const { randomUUID } = require('crypto');
const { lerBanco, escreverBanco } = require('../repositories/jsonDatabase');
const { httpError } = require('../utils/errors');
const { validarMesReferencia, mesReferenciaAnterior } = require('../utils/month');

function validarDadosDespesa(dadosRecebidos) {
  const { descricao, valor, mesReferencia } = dadosRecebidos;

  if (!descricao || !descricao.trim()) {
    throw httpError(400, 'Descrição é obrigatória!');
  }

  const valorNumerico = Number(valor);

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    throw httpError(400, 'Valor deve ser maior que zero!');
  }

  const erroMes = validarMesReferencia(mesReferencia);

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  if (mesReferenciaAnterior(mesReferencia)) {
    throw httpError(400, 'Não é permitido criar ou alterar despesas de meses anteriores!');
  }

  return {
    descricao: descricao.trim(),
    valor: valorNumerico,
    mesReferencia,
  };
}

function listarDespesas(usuarioId, mesReferencia) {
  const erroMes = mesReferencia ? validarMesReferencia(mesReferencia) : null;

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  const banco = lerBanco();

  return banco.despesas.filter((despesa) => {
    const pertenceAoUsuario = despesa.usuarioId === usuarioId;
    const pertenceAoMes = !mesReferencia || despesa.mesReferencia === mesReferencia;
    return pertenceAoUsuario && pertenceAoMes;
  });
}

function criarDespesa(usuarioId, dadosRecebidos) {
  const dadosValidados = validarDadosDespesa(dadosRecebidos);
  const banco = lerBanco();
  const agora = new Date().toISOString();

  const despesa = {
    id: randomUUID(),
    usuarioId,
    ...dadosValidados,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  banco.despesas.push(despesa);
  escreverBanco(banco);

  return despesa;
}

function atualizarDespesa(usuarioId, despesaId, dadosRecebidos) {
  const dadosValidados = validarDadosDespesa(dadosRecebidos);
  const banco = lerBanco();
  const indice = banco.despesas.findIndex((despesa) => despesa.id === despesaId && despesa.usuarioId === usuarioId);

  if (indice === -1) {
    throw httpError(404, 'Despesa não encontrada!');
  }

  const despesaAtual = banco.despesas[indice];

  if (mesReferenciaAnterior(despesaAtual.mesReferencia)) {
    throw httpError(400, 'Não é permitido alterar despesas de meses anteriores!');
  }

  const despesaAtualizada = {
    ...despesaAtual,
    ...dadosValidados,
    atualizadoEm: new Date().toISOString(),
  };

  banco.despesas[indice] = despesaAtualizada;
  escreverBanco(banco);

  return despesaAtualizada;
}

function excluirDespesa(usuarioId, despesaId) {
  const banco = lerBanco();
  const despesa = banco.despesas.find((item) => item.id === despesaId && item.usuarioId === usuarioId);

  if (!despesa) {
    throw httpError(404, 'Despesa não encontrada!');
  }

  if (mesReferenciaAnterior(despesa.mesReferencia)) {
    throw httpError(400, 'Não é permitido excluir despesas de meses anteriores!');
  }

  banco.despesas = banco.despesas.filter((item) => item.id !== despesaId);
  escreverBanco(banco);
}

module.exports = {
  listarDespesas,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
};
