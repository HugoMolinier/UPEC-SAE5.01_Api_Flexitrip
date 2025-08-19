const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("PMR", "Accompagnant", "Agent"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pmr_assistance: {
      type: DataTypes.STRING,
    },
    solde: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 700.0,
    },
  },
  {
    tableName: "User",
    timestamps: false,
  }
);

module.exports = User;
