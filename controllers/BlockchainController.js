const crypto = require("crypto");
const Block = require("../models/Block");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const createBlock = async (transactions, previousHash) => {
  const index = (await Block.countDocuments()) + 1;
  const nonce = Math.floor(Math.random() * 100000);
  const hash = crypto
    .createHash("sha256")
    .update(index + previousHash + JSON.stringify(transactions) + nonce)
    .digest("hex");

  const newBlock = new Block({
    index,
    transactions,
    previousHash,
    hash,
    nonce,
  });

  await newBlock.save();
  return newBlock;
};

// Create a transaction
const createTransaction = async (sender, receiver, amount) => {
  const transaction = new Transaction({ sender, receiver, amount });
  await transaction.save();
  return transaction;
};

const addBlock = async (req, res) => {
  try {
    const { sender, receiver, amount } = req.body;

    if (!sender || !receiver || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Données invalides pour la transaction" });
    }

    const senderUser = await User.findOne({ where: { user_id: sender } });

    if (!senderUser) {
      return res.status(404).json({ message: "Utilisateur sender non trouvé" });
    }

    if (senderUser.solde < amount) {
      return res
        .status(400)
        .json({ message: "Solde insuffisant pour effectuer la transaction" });
    }

    senderUser.solde -= amount;
    await senderUser.save();

    const transaction = await createTransaction(sender, receiver, amount);

    const lastBlock = await Block.findOne().sort({ index: -1 });
    const previousHash = lastBlock ? lastBlock.hash : "0";

    const newBlock = await createBlock([transaction._id], previousHash);

    res
      .status(201)
      .json({ message: "Bloc ajouté avec succès", block: newBlock });
  } catch (error) {
    console.error("Erreur lors de l'ajout du bloc :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du bloc", error });
  }
};

// Get the blockchain
const getBlockchain = async (req, res) => {
  try {
    const blocks = await Block.find().populate("transactions");
    res.status(200).json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving blockchain", error });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "user_id est requis" });
    }

    const blocks = await Block.find().populate("transactions");

    const userTransactions = blocks.flatMap((block) =>
      block.transactions.filter(
        (transaction) =>
          transaction.sender === user_id || transaction.receiver === user_id
      )
    );

    res.status(200).json(userTransactions);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des transactions utilisateur :",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des transactions",
        error,
      });
  }
};

const getUserBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "name", "surname", "solde"],
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Solde récupéré avec succès.",
      balance: user.solde,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du solde:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération du solde." });
  }
};

module.exports = {
  addBlock,
  getBlockchain,
  getUserBalance,
  getUserTransactions,
};
