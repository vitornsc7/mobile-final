const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    dataNascimento: { type: DataTypes.STRING(10) },
    token: { type: DataTypes.STRING(100) },
    createdAt: { type: DataTypes.DATE },
  },
  {
    tableName: 'users',
    timestamps: false,
  },
);

module.exports = User;
