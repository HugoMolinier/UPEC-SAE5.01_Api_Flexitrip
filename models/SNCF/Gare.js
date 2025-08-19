const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseSNCF");

const Gare = sequelize.define(
  "Gare",
  {
    gare_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    iata_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    icao_code: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "Gare",
    timestamps: false,
  }
);

module.exports = Gare;
