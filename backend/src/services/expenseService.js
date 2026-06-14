const { randomUUID } = require('crypto');
const { Op } = require('sequelize');
const Expense = require('../models/Expense');
const { httpError } = require('../utils/errors');
const { validarMesReferencia, mesReferenciaAnterior } = require('../utils/month');

function validarDadosDespesa(dadosRecebidos, opcoes = {}) {
  const { descricao, valor, mesReferencia } = dadosRecebidos;
  const bloquearMesAnterior = opcoes.bloquearMesAnterior ?? true;

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

  if (bloquearMesAnterior && mesReferenciaAnterior(mesReferencia)) {
    throw httpError(400, 'Não é permitido criar ou alterar despesas de meses anteriores!');
  }

  return {
    descricao: descricao.trim(),
    valor: valorNumerico,
    mesReferencia,
  };
}

async function listarDespesas(usuarioId, mesReferencia) {
  const erroMes = mesReferencia ? validarMesReferencia(mesReferencia) : null;

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  const where = { usuarioId };
  if (mesReferencia) where.mesReferencia = mesReferencia;

  const despesas = await Expense.findAll({ where });
  return despesas.map((d) => d.toJSON());
}

async function criarDespesa(usuarioId, dadosRecebidos) {
  const dadosValidados = validarDadosDespesa(dadosRecebidos);
  const agora = new Date();

  const despesa = await Expense.create({
    id: randomUUID(),
    usuarioId,
    ...dadosValidados,
    criadoEm: agora,
    atualizadoEm: agora,
  });

  return despesa.toJSON();
}

async function atualizarDespesa(usuarioId, despesaId, dadosRecebidos) {
  const dadosValidados = validarDadosDespesa(dadosRecebidos, { bloquearMesAnterior: false });

  const despesa = await Expense.findOne({ where: { id: despesaId, usuarioId } });

  if (!despesa) {
    throw httpError(404, 'Despesa não encontrada!');
  }

  await despesa.update({ ...dadosValidados, atualizadoEm: new Date() });

  return despesa.toJSON();
}

async function excluirDespesa(usuarioId, despesaId) {
  const despesa = await Expense.findOne({ where: { id: despesaId, usuarioId } });

  if (!despesa) {
    throw httpError(404, 'Despesa não encontrada!');
  }

  if (mesReferenciaAnterior(despesa.mesReferencia)) {
    throw httpError(400, 'Não é permitido excluir despesas de meses anteriores!');
  }

  await despesa.destroy();
}

module.exports = {
  listarDespesas,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
};
