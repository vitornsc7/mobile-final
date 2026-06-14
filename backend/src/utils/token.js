const crypto = require('crypto');

function gerarToken() {
  return 'tok_' + crypto.randomBytes(24).toString('hex');
}

module.exports = { gerarToken };
