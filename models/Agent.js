const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Agent = sequelize.define(
  "Agent",
  {
    id_agent: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    entreprise: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Agent",
    timestamps: false,
  }
);

module.exports = Agent;
