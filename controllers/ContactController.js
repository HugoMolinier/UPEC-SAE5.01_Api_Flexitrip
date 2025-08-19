const nodemailer = require("nodemailer");

// Constantes
const MailCompany = "retro0970@gmail.com";
const senderPassword = "ghxlvxxhglmimpob";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MailCompany,
    pass: senderPassword,
  },
});

// Fonction pour envoyer un email à l'utilisateur
exports.sendContactMail = async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  if (!recipientEmail || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const mailOptions = {
    from: MailCompany,
    to: recipientEmail,
    subject: `Message: ${subject}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "E-mail envoyé avec succès.",
      emailIn: MailCompany,
      emailOut: recipientEmail,
      subject: subject,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
  }
};

// Fonction pour recevoir un message de l'utilisateur
exports.receiveUserMessage = async (req, res) => {
  const { Nom, Prenom, userEmail, message } = req.body;

  if (!userEmail || !message) {
    return res
      .status(400)
      .json({ error: "L'email de l'utilisateur et le message sont requis." });
  }

  const mailOptions = {
    from: userEmail,
    to: MailCompany,
    subject: `Message de ${Nom} ${Prenom}`,
    text: `${message}\n\nContact: ${userEmail}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Le message a été envoyé avec succès à l'entreprise.",
      userEmail: userEmail,
      companyEmail: MailCompany,
      subject: `Message de ${Nom} ${Prenom}`,
      message: message,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
};
