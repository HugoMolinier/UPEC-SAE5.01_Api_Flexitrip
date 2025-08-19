const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseSNCF");

const reservation_trajet = sequelize.define(
  "reservation_trajet",
  {
    id_reservation_trajet: {
      type: DataTypes.INTEGER(7),
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
    Enregistré: {
      type: DataTypes.TINYINT,
    },
    Assistance_PMR: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_trajet: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    Bagage_Verifié: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "reservation_trajet",
    timestamps: false,
  }
);

module.exports = reservation_trajet;
