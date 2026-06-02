function httpError(codigoStatus, mensagem) {
  const erro = new Error(mensagem);
  erro.statusCode = codigoStatus;
  return erro;
}

module.exports = {
  httpError,
};
