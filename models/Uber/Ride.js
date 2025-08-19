const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseUBER");

const Ride = sequelize.define(
  "Ride",
  {
    Ride_Id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    adresse_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    adresse_2: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    departure_time: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "Ride",
    timestamps: false,
  }
);

module.exports = Ride;
