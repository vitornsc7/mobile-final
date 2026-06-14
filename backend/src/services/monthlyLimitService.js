const { randomUUID } = require('crypto');
const { Op } = require('sequelize');
const MonthlyLimit = require('../models/MonthlyLimit');
const { httpError } = require('../utils/errors');
const { validarMesReferencia, mesReferenciaAnterior } = require('../utils/month');

function validarDadosLimiteMensal(dadosRecebidos, opcoes = {}) {
  const { valor, mesReferencia } = dadosRecebidos;
  const bloquearMesAnterior = opcoes.bloquearMesAnterior ?? true;
  const valorNumerico = Number(valor);

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    throw httpError(400, 'Valor deve ser maior que zero.');
  }

  const erroMes = validarMesReferencia(mesReferencia);

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  if (bloquearMesAnterior && mesReferenciaAnterior(mesReferencia)) {
    throw httpError(400, 'Não é permitido criar ou alterar limites de meses anteriores!');
  }

  return {
    valor: valorNumerico,
    mesReferencia,
  };
}

async function listarLimitesMensais(usuarioId, mesReferencia) {
  const erroMes = mesReferencia ? validarMesReferencia(mesReferencia) : null;

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  const where = { usuarioId };
  if (mesReferencia) where.mesReferencia = mesReferencia;

  const limites = await MonthlyLimit.findAll({ where });
  return limites.map((l) => l.toJSON());
}

async function criarLimiteMensal(usuarioId, dadosRecebidos) {
  const dadosValidados = validarDadosLimiteMensal(dadosRecebidos);

  const limiteJaExiste = await MonthlyLimit.findOne({
    where: { usuarioId, mesReferencia: dadosValidados.mesReferencia },
  });

  if (limiteJaExiste) {
    throw httpError(409, 'Esse mês já possui um limite cadastrado. Você pode editar o limite existente.');
  }

  const agora = new Date();
  const limiteMensal = await MonthlyLimit.create({
    id: randomUUID(),
    usuarioId,
    ...dadosValidados,
    criadoEm: agora,
    atualizadoEm: agora,
  });

  return limiteMensal.toJSON();
}

async function atualizarLimiteMensal(usuarioId, limiteId, dadosRecebidos) {
  const dadosValidados = validarDadosLimiteMensal(dadosRecebidos, { bloquearMesAnterior: false });

  const limite = await MonthlyLimit.findOne({ where: { id: limiteId, usuarioId } });

  if (!limite) {
    throw httpError(404, 'Limite não encontrado!');
  }

  const mesDuplicado = await MonthlyLimit.findOne({
    where: {
      usuarioId,
      mesReferencia: dadosValidados.mesReferencia,
      id: { [Op.ne]: limiteId },
    },
  });

  if (mesDuplicado) {
    throw httpError(409, 'Esse mês já possui um limite cadastrado. Você pode editar o limite existente.');
  }

  await limite.update({ ...dadosValidados, atualizadoEm: new Date() });

  return limite.toJSON();
}

async function excluirLimiteMensal(usuarioId, limiteId) {
  const limite = await MonthlyLimit.findOne({ where: { id: limiteId, usuarioId } });

  if (!limite) {
    throw httpError(404, 'Limite não encontrado!');
  }

  if (mesReferenciaAnterior(limite.mesReferencia)) {
    throw httpError(400, 'Não é permitido excluir limites de meses anteriores!');
  }

  await limite.destroy();
}

module.exports = {
  listarLimitesMensais,
  criarLimiteMensal,
  atualizarLimiteMensal,
  excluirLimiteMensal,
};
