const userRepository = require('../repositories/userRepository');

async function authMiddleware(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação obrigatório.' });
  }

  try {
    const user = await userRepository.findByToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.user = { id: user.id };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = authMiddleware;

