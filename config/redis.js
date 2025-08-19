const Redis = require("ioredis");

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "Y@ssine75010",
});

redisClient.on("connect", () => {
  console.log("Connecté à Redis avec succès !");
});

redisClient.on("error", (err) => {
  console.error("Erreur Redis :", err);
});

module.exports = redisClient;
