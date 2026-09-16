require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models/Notificacao');

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => app.listen(port, () => console.log(`AirTrip API rodando na porta ${port}`)))
  .catch((error) => {
    console.error('Erro ao conectar no banco:', error.message);
    process.exitCode = 1;
  });