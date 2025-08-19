const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const reservations = sequelize.define(
  "reservations",
  {
    reservation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_reza_mmt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_pax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Enregistré: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    assistance_PMR: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    Type_Transport: {
      type: DataTypes.ENUM("train", "taxi", "avion"),
      allowNull: true,
    },
    Facturation_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_voyage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    etape_voyage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_reservation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "reservations",
    timestamps: false,
  }
);

module.exports = reservations;
