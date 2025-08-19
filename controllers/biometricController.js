const { Biometric } = require("../models");
const mongoose = require("mongoose");

const saveBiometricData = async (req, res) => {
  try {
    const { userId, image } = req.body;

    if (!userId || !image) {
      return res
        .status(400)
        .json({ error: "Données manquantes (userId ou image)." });
    }

    const validUserId = mongoose.isValidObjectId(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const newBiometric = new Biometric({
      userId: validUserId,
      image: image,
    });

    await newBiometric.save();

    res.status(201).json({
      message: "Image enregistrée avec succès dans la base de données.",
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de l'image dans MongoDB:",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveBiometricData };
