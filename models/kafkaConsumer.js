const { Kafka } = require("kafkajs");

// Configuration du consommateur Kafka
const kafka = new Kafka({
  clientId: "pmr-management-app",
  brokers: ["192.168.1.189:9092"],
});

const consumer = kafka.consumer({ groupId: "pmr-notifications-group" });

let messagesBuffer = [];

// Connexion au consommateur Kafka
const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Kafka Consumer connecté");
  } catch (error) {
    console.error("Erreur lors de la connexion du Consumer Kafka:", error);
    throw error;
  }
};

// Fonction pour consommer les messages
const consumeMessages = async () => {
  try {
    await connectConsumer();

    await consumer.subscribe({
      topic: "pmr-notifications",
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: "bagage-verification",
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: "e-billet-verification",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageContent = {
          topic,
          partition,
          key: message.key?.toString() || null,
          value: message.value.toString(),
          timestamp: new Date().toISOString(),
        };

        messagesBuffer.push(messageContent);

        if (messagesBuffer.length > 1000) {
          messagesBuffer.shift();
        }
      },
    });
  } catch (error) {
    console.error("Erreur lors de la consommation des messages:", error);
  }
};

const getConsumedMessages = () => {
  return messagesBuffer;
};

const clearMessagesBuffer = () => {
  messagesBuffer = [];
};

module.exports = {
  consumeMessages,
  getConsumedMessages,
  clearMessagesBuffer,
};
