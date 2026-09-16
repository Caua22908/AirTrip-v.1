const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  tipoUsuario: { type: DataTypes.STRING(50), allowNull: false, field: 'tipo_usuario' },
  foto: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'usuario', timestamps: false });

module.exports = Usuario;