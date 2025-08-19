const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "default_secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token invalide ou expiré" });
      }

      req.user = decoded;
      next();
    }
  );
};

module.exports = authenticateToken;
