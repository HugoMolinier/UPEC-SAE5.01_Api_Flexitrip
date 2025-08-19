const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.1",
    description:
      "Documentation de l'API pour la gestion des PMR, accompagnants, agents, et utilisateurs",
  },
  servers: [
    {
      url: "http://88.185.44.213:17777",
      description: "Serveur de développement",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
