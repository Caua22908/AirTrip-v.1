const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Agendamento = sequelize.define('Agendamento', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.BIGINT, allowNull: false, field: 'usuario_id' },
  origem: { type: DataTypes.STRING(100), allowNull: false },
  destino: { type: DataTypes.STRING(100), allowNull: false },
  dataIda: { type: DataTypes.DATEONLY, allowNull: false, field: 'data_ida' },
  dataVolta: { type: DataTypes.DATEONLY, allowNull: true, field: 'data_volta' },
  passageiros: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  aeroporto: { type: DataTypes.STRING(100), allowNull: true },
  empresaVoo: { type: DataTypes.STRING(100), allowNull: true, field: 'empresa_voo' },
  status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pendente' },
}, { tableName: 'agendamento', timestamps: false });

Usuario.hasMany(Agendamento, { foreignKey: 'usuarioId', as: 'agendamentos' });
Agendamento.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = Agendamento;