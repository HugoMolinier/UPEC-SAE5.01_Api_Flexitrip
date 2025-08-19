const Facturation = require("./Facturation");
const Reservations = require("./Reservations");
const User = require("./User");
const Biometric = require("./Biometric");
const Notification = require("./Notification");
const Voyage = require("./Voyage");
const Agent = require("./Agent");

// Associations

// User et Reservations
Reservations.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
User.hasMany(Reservations, {
  foreignKey: "user_id",
  as: "reservations",
});

module.exports = {
  Facturation,
  Agent,
  Reservations,
  User,
  Biometric,
  Notification,
  Voyage,
};
