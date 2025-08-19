const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Assure-toi du bon chemin d'import

/**
 * @swagger
 * /auth/verify-token:
 *   get:
 *     summary: Vérifier la validité d'un token JWT
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token valide"
 *                 user:
 *                   type: object
 *                   description: Données utilisateur décodées à partir du token.
 *       401:
 *         description: Token manquant ou non fourni.
 *       403:
 *         description: Token invalide ou expiré.
 */
router.get('/verify-token', authenticateToken, (req, res) => {
    // Si le middleware passe, cela signifie que le token est valide
    res.status(200).json({
        message: "Token valide",
        user: req.user, // Données utilisateur décodées ajoutées par le middleware
    });
});

module.exports = router;
