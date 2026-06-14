const User = require('../models/User');

async function create(user) {
  const criado = await User.create(user);
  return criado.toJSON();
}

async function findByEmail(email) {
  const user = await User.findOne({ where: { email } });
  return user ? user.toJSON() : null;
}

async function findById(id) {
  const user = await User.findOne({ where: { id } });
  return user ? user.toJSON() : null;
}

async function findByToken(token) {
  const user = await User.findOne({ where: { token } });
  return user ? user.toJSON() : null;
}

async function update(user) {
  await User.update(user, { where: { id: user.id } });
}

module.exports = { create, findByEmail, findById, findByToken, update };
