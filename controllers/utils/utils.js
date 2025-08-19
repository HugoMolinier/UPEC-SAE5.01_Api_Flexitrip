function generateRandomCode(length = 20) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Fonction pour envoyer un email
 * @param {string} to - L'adresse email du destinataire
 * @param {string} subject - L'objet de l'email
 * @param {string} text - Le contenu de l'email
 */
async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "votre_email@gmail.com",
      pass: "votre_mot_de_passe",
    },
  });

  let mailOptions = {
    from: "votre_email@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
}

module.exports = { generateRandomCode };
