const { Kafka } = require("kafkajs");

// Configuration du client Kafka
const kafka = new Kafka({
  clientId: "pmr-management-app",
  brokers: ["192.168.1.189:9092"],
});

// Initialisation du producteur
const producer = kafka.producer({ groupId: "pmr-notifications-group" });

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connecté");
  } catch (error) {
    console.error("Erreur de connexion du Producteur Kafka:", error);
  }
};

module.exports = {
  producer,
  connectProducer,
};
