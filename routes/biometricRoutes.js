const express = require('express');
const router = express.Router();
const multer = require('multer');
const {saveBiometricData} = require('../controllers/biometricController');

// Configurer multer pour gérer les fichiers d'image uploadés
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Biometrics
 *   description: API pour la gestion des données biométriques
 */

/**
 * @swagger
 * /biometric/recognize:
 *   post:
 *     summary: Reconnaître les points faciaux et enregistrer les données biométriques
 *     tags: [Biometrics]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Image contenant le visage à analyser
 *         required: true
 *       - in: formData
 *         name: userId
 *         type: string
 *         description: ID de l'utilisateur pour lequel les données biométriques seront associées
 *         required: true
 *     responses:
 *       201:
 *         description: Données biométriques enregistrées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Données biométriques enregistrées avec succès
 *                 landmarks:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Liste des points de repère faciaux détectés
 *       500:
 *         description: Erreur lors de la détection ou de l'enregistrement des données biométriques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur lors de la création des données biométriques
 */

// Route pour la reconnaissance faciale et l'enregistrement des données biométriques
router.post('/recognize', saveBiometricData);

module.exports = router;
