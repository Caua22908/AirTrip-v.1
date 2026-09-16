const express = require('express');
const cors = require('cors');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'airtrip-api' }));
app.use('/usuarios', usuarioRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.use((error, req, res, next) => {
  if (error) return res.status(400).json({ erro: error.message });
  return next();
});

module.exports = app;