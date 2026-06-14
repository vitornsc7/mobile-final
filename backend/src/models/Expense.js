const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define(
  'Expense',
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    usuarioId: { type: DataTypes.STRING(50), allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const v = this.getDataValue('valor');
        return v != null ? parseFloat(v) : null;
      },
    },
    mesReferencia: { type: DataTypes.STRING(7), allowNull: false },
    criadoEm: { type: DataTypes.DATE },
    atualizadoEm: { type: DataTypes.DATE },
  },
  {
    tableName: 'expenses',
    timestamps: false,
  },
);

module.exports = Expense;
