const padraoMes = /^\d{4}-(0[1-9]|1[0-2])$/;

function validarMesReferencia(mesReferencia) {
  if (!mesReferencia || !padraoMes.test(mesReferencia)) {
    return 'Mes referencia deve estar no formato YYYY-MM.';
  }

  return null;
}

function obterMesReferenciaAtual() {
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

function mesReferenciaAnterior(mesReferencia) {
  return mesReferencia < obterMesReferenciaAtual();
}

module.exports = {
  validarMesReferencia,
  obterMesReferenciaAtual,
  mesReferenciaAnterior,
};
