const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseUBER");

const reservations_trajet_Uber = sequelize.define(
  "reservations_trajet_Uber",
  {
    id_reservation_trajet: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    Nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Num_reza_PAX: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Num_reza_MMT: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    Enregistre: {
      type: DataTypes.TINYINT(4),
      defaultValue: 0,
    },
    Assistance_PMR: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    id_Ride: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    Bagage_Verifié: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "reservations_trajet_Uber",
    timestamps: false,
  }
);

module.exports = reservations_trajet_Uber;
