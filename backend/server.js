const aplicativo = require('./src/app');

const PORTA = process.env.PORT || 3000;

aplicativo.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
