const { DataTypes } = require("sequelize");
const sequelize = require("../../config/databaseSNCF");

const Trajet = sequelize.define(
  "Trajet",
  {
    trajet_id: {
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
    departure_gare_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrival_gare_id: {
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
    tableName: "Trajet",
    timestamps: false,
  }
);

module.exports = Trajet;
