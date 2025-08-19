const { User, Voyage } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// fonction pour authentifier un utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { Email: email } });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.user = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.Password;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Logout failed" });
      }

      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// fonction pour enregistrer un nouvel utilisateur
exports.insertUser = async (req, res) => {
  const {
    name,
    surname,
    email,
    phone,
    address,
    role,
    password,
    pmr_assistance,
  } = req.body;

  if (!name || !surname || !email || !phone || !role || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires sont requis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email,
      phone,
      address,
      role,
      password: hashedPassword,
      pmr_assistance,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'utilisateur:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "L'email existe déjà." });
    }

    res
      .status(500)
      .json({ error: "Erreur lors de l'insertion de l'utilisateur" });
  }
};

exports.insertAgent = async (req, res) => {
  const { name, surname, email, phone, address, password } = req.body;

  if (!name || !surname || !email || !phone || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires sont requis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = await User.create({
      name,
      surname,
      email,
      phone,
      address,
      role: "Agent",
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Agent créé avec succès.",
      agent: {
        id: newAgent.id,
        name: newAgent.name,
        surname: newAgent.surname,
        email: newAgent.email,
        phone: newAgent.phone,
        address: newAgent.address,
        role: newAgent.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'agent:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "L'email existe déjà." });
    }

    res.status(500).json({ error: "Erreur lors de l'insertion de l'agent" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findOne({
      where: { user_id: req.params.id },
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { user_id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { User_ID: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWithPMRRole = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        Role: "PMR",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWithAccompagnantRole = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        Role: "Accompagnant",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fonction pour récupérer un voyage par ID PMR
 * @param {Request} req - L'objet de la requête Express
 * @param {Response} res - L'objet de la réponse Express
 */
exports.getVoyageWithIdPMR = async (req, res) => {
  const { idPMR } = req.params;
  try {
    const voyage = await Voyage.findOne({ id_pmr: idPMR });

    if (!voyage) {
      return res
        .status(404)
        .json({ error: "Voyage non trouvé pour cet ID PMR" });
    }

    res.status(200).json(voyage);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Erreur lors de la récupération du voyage : ${error.message}`,
    });
  }
};
