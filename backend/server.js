require('dotenv').config();

const aplicativo = require('./src/app');
const sequelize = require('./src/config/database');

// Import models so Sequelize registers them before sync
require('./src/models/User');
require('./src/models/Expense');
require('./src/models/MonthlyLimit');

const PORTA = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Banco MySQL conectado e tabelas sincronizadas.');
    aplicativo.listen(PORTA, () => {
      console.log(`Servidor rodando na porta ${PORTA}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  });

