const mongoose = require("mongoose");

const biometricSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Biometric", biometricSchema);
