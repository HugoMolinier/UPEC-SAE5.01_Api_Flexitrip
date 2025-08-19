const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Sequelize
const {sequelize} = require('./config/database');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

//Auth
const AuthRoutes = require('./routes/AuthRoutes');

// MySQL
const reservationsRoutes = require('./routes/reservationsRoutes');
const FacturationRoutes = require('./routes/FacturationRoutes');
const userRoutes = require('./routes/userRoutes');
const agentRoutes = require('./routes/AgentRoutes3');
const contactRoutes = require('./routes/ContactRoutes');

// AF
const AirportsRoutes = require('./routes/AF/AirportsRoutes');
const volRoutes = require('./routes/AF/volRoutes');

// SNCF
const GareRoutes = require('./routes/SNCF/GareRoutes');
const TrajetSNCFRoutes = require('./routes/SNCF/TrajetRoutes');

// UBER 
const TrajetTaxiUBERRoutes = require('./routes/UBER/TrajetTaxiRoutes');

// MongoDB
const voyageRoutes = require('./routes/voyageRoutes');
const biometricRoutes = require('./routes/biometricRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

// HUB AMQP (KAFKA)
const kafkaRoutes = require('./routes/kafkaRoutes');
const { connectProducer } = require('./models/Kafka');
// Connexion du producteur Kafka
connectProducer();

const { consumeMessages } = require('./models/kafkaConsumer');
// Lancer le consommateur Kafka
consumeMessages().catch((err) => {
    console.error('Erreur lors du démarrage du consommateur Kafka:', err);
  });


// Gestion d'erreurs
const errorHandler = require('./middleware/errorHandler');

// Redis
const sessionMiddleware = require('./middleware/sessionMiddleware');

const app = express();

app.use(express.json({ limit: '10mb' })); // Limite augmentée à 10 MB

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Middleware pour les sessions
app.use(sessionMiddleware);

// Documentation Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Auth
app.use('/auth', AuthRoutes);

// Routes SQL
app.use('/reservations', reservationsRoutes);
app.use('/facturation', FacturationRoutes);
app.use('/users', userRoutes);
app.use('/agent', agentRoutes);

// AF
app.use('/AF/airports', AirportsRoutes);
app.use('/AF/flights', volRoutes);

// SNCF
app.use('/SNCF/gare', GareRoutes);
app.use('/SNCF/trajet', TrajetSNCFRoutes);

// UBER
app.use('/SNCF/ride', TrajetTaxiUBERRoutes);

// Routes NoSQL
app.use('/voyage', voyageRoutes);
app.use('/biometric', biometricRoutes);
app.use('/notification', notificationRoutes);
app.use('/blockchain', blockchainRoutes);
app.use('/contact', contactRoutes);

// Routes HUB
app.use('/kafka', kafkaRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);


// Démarrer le serveur
const PORT = process.env.PORT || 17777;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await sequelize.sync();
        console.log('Database synced');

    } catch (error) {
        console.error('Erreur lors du démarrage de l\'application:', error);
    }
});

module.exports = app;
