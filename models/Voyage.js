const { mongoose } = require("../config/database");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Schéma pour une étape de transport (vol, train, taxi, etc.)
const trajetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["avion", "train", "taxi"], required: true },
  compagnie: { type: String, required: true },
  adresse_1: { type: String, default: "" },
  adresse_2: { type: String, default: "" },
});

// Schéma pour un voyage
const voyageSchema = new mongoose.Schema({
  id_voyage: { type: Number, unique: true },
  pmrid: { type: Number, required: true },
  accompagnant_id: { type: Number, required: false },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  lieu_depart: {
    locomotion: {
      type: String,
      enum: ["train", "avion", "taxi"],
      required: true,
    },
    id: { type: String, required: true },
  },
  lieu_arrive: {
    locomotion: {
      type: String,
      enum: ["train", "avion", "taxi"],
      required: true,
    },
    id: { type: String, required: true },
  },
  bagage: [
    {
      id: { type: Number, required: false },
      poid: { type: Number, required: false },
      descriptif: { type: String, required: false },
    },
  ],
  etapes: [trajetSchema],
  prix_total: { type: Number, required: true },
});

voyageSchema.plugin(AutoIncrement, { inc_field: "id_voyage" });

module.exports = mongoose.model("Voyage", voyageSchema);
