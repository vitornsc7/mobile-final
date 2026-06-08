const { randomUUID } = require('crypto');
const { lerBanco, escreverBanco } = require('../repositories/jsonDatabase');
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

function listarLimitesMensais(usuarioId, mesReferencia) {
  const erroMes = mesReferencia ? validarMesReferencia(mesReferencia) : null;

  if (erroMes) {
    throw httpError(400, erroMes);
  }

  const banco = lerBanco();

  return banco.limitesMensais.filter((limite) => {
    const pertenceAoUsuario = limite.usuarioId === usuarioId;
    const pertenceAoMes = !mesReferencia || limite.mesReferencia === mesReferencia;
    return pertenceAoUsuario && pertenceAoMes;
  });
}

function criarLimiteMensal(usuarioId, dadosRecebidos) {
  const dadosValidados = validarDadosLimiteMensal(dadosRecebidos);
  const banco = lerBanco();
  const limiteJaExiste = banco.limitesMensais.some(
    (limite) => limite.usuarioId === usuarioId && limite.mesReferencia === dadosValidados.mesReferencia,
  );

  if (limiteJaExiste) {
    throw httpError(409, 'Esse mês já possui um limite cadastrado. Você pode editar o limite existente.');
  }

  const agora = new Date().toISOString();
  const limiteMensal = {
    id: randomUUID(),
    usuarioId,
    ...dadosValidados,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  banco.limitesMensais.push(limiteMensal);
  escreverBanco(banco);

  return limiteMensal;
}

function atualizarLimiteMensal(usuarioId, limiteId, dadosRecebidos) {
  const dadosValidados = validarDadosLimiteMensal(dadosRecebidos, { bloquearMesAnterior: false });
  const banco = lerBanco();
  const indice = banco.limitesMensais.findIndex((limite) => limite.id === limiteId && limite.usuarioId === usuarioId);

  if (indice === -1) {
    throw httpError(404, 'Limite não encontrado!');
  }

  const limiteAtual = banco.limitesMensais[indice];

  const mesDuplicado = banco.limitesMensais.some((limite) => {
    return limite.id !== limiteId && limite.usuarioId === usuarioId && limite.mesReferencia === dadosValidados.mesReferencia;
  });

  if (mesDuplicado) {
    throw httpError(409, 'Esse mês já possui um limite cadastrado. Você pode editar o limite existente.');
  }

  const limiteAtualizado = {
    ...limiteAtual,
    ...dadosValidados,
    atualizadoEm: new Date().toISOString(),
  };

  banco.limitesMensais[indice] = limiteAtualizado;
  escreverBanco(banco);

  return limiteAtualizado;
}

function excluirLimiteMensal(usuarioId, limiteId) {
  const banco = lerBanco();
  const limiteMensal = banco.limitesMensais.find((limite) => limite.id === limiteId && limite.usuarioId === usuarioId);

  if (!limiteMensal) {
    throw httpError(404, 'Limite não encontrado!');
  }

  if (mesReferenciaAnterior(limiteMensal.mesReferencia)) {
    throw httpError(400, 'Não é permitido excluir limites de meses anteriores!');
  }

  banco.limitesMensais = banco.limitesMensais.filter((limite) => limite.id !== limiteId);
  escreverBanco(banco);
}

module.exports = {
  listarLimitesMensais,
  criarLimiteMensal,
  atualizarLimiteMensal,
  excluirLimiteMensal,
};
