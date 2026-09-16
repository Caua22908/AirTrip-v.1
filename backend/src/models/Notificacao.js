const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agendamento = require('./Agendamento');

const Notificacao = sequelize.define('Notificacao', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  agendamentoId: { type: DataTypes.BIGINT, allowNull: false, field: 'agendamento_id' },
  dataNotificacao: { type: DataTypes.DATEONLY, allowNull: false, field: 'data_notificacao' },
  horario: { type: DataTypes.TIME, allowNull: false },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'notificacao', timestamps: false });

Agendamento.hasMany(Notificacao, { foreignKey: 'agendamentoId', as: 'notificacoes' });
Notificacao.belongsTo(Agendamento, { foreignKey: 'agendamentoId', as: 'agendamento' });

module.exports = Notificacao;