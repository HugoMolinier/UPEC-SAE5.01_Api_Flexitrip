const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseAF");

const Vol = sequelize.define(
  "Vol",
  {
    flight_id: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    available_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_weight_suitcase: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    departure_airport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrival_airport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Annulé", "Prévu", "Fini"),
      allowNull: false,
    },
  },
  {
    tableName: "Vol",
    timestamps: false,
  }
);

module.exports = Vol;
