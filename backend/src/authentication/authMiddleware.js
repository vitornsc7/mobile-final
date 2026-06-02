function authMiddleware(req, res, next) {
  const autorizacao = req.headers.authorization;
  const usuarioId = req.headers['x-user-id'];

  // Temporário até o fluxo real de signin/JWT estar pronto ~ ~ ~ ~ ~ 
  // Quando existir JWT, validar o token aqui e preencher req.user com o id do usuario ~ ~ ~ ~ ~ 
  if (!autorizacao && !usuarioId) {
    return res.status(401).json({ message: 'Token de autenticacao obrigatorio.' });
  }

  req.user = {
    id: usuarioId || 'demo-user',
  };

  return next();
}

module.exports = authMiddleware;
