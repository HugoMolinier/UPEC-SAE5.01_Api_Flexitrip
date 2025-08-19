const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const sequelize = new Sequelize("SAE_SNCF", "yassdah", "Y@ssine75010", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to the MySQL database"))
  .catch((err) =>
    console.error("Unable to connect to the MySQL database:", err)
  );

// Connexion à MongoDB avec Mongoose
const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://retro0970:w9fuKaxzFWGMPlAh@cluster.qmrpxnx.mongodb.net/flexitrip?retryWrites=true&w=majority&appName=Cluster"
    );
    console.log("Connected to the MongoDB database");
  } catch (err) {
    console.error("Unable to connect to the MongoDB database:", err);
  }
};

connectMongoDB();

module.exports = sequelize;
