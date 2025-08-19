const { Reservations, Voyage, User, Facturation } = require("../models");

const sequelizeSAE_AF = require("../config/databaseAF");
const sequelizeSAE_SNCF = require("../config/databaseSNCF");
const { sequelize } = require("../config/database");
const sequelizeSAE_UBER = require("../config/databaseUBER");

const { generateRandomCode } = require("./utils/utils");
const { reservation_trajet } = require("../models/SNCF");
const { reservation_vol } = require("../models/AF/");
const { reservations_trajet_Uber } = require("../models/Uber");

/**
 *
 * @param req
 * @param res exemple :
 * curl -X POST http://88.185.44.213:17777/reservations/insert -H "Content-Type: application/json" -d '{
 *     "user_id": 1,
 *     "id_voyage": "4",
 *     "assistanceBesoin": true
 * }'
 * @returns {Promise<*>}
 */
exports.doReservationOfTravel = async (req, res) => {
  const t_AF = await sequelizeSAE_AF.transaction();
  const t_SNCF = await sequelizeSAE_SNCF.transaction();
  const t_UBER = await sequelizeSAE_UBER.transaction();
  const t_Multi = await sequelize.transaction();

  try {
    const { user_id, id_voyage, assistanceBesoin } = req.body;

    if (!user_id || !id_voyage) {
      return res
        .status(400)
        .json({ message: "Données manquantes : user_id ou id_voyage." });
    }

    const voyage = await Voyage.findOne({ id_voyage });
    if (!voyage) {
      return res.status(404).json({ message: "Voyage introuvable." });
    }

    if (user_id !== voyage.pmrid) {
      return res
        .status(403)
        .json({ message: "Utilisateur non associé à ce voyage." });
    }

    const user_register = await User.findByPk(user_id);
    if (!user_register) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const { etapes, prix_total } = voyage;
    const num_reza_MMT = generateRandomCode(20);
    const reservationsList = [];

    // Créer une facture
    const facturation = await Facturation.create(
      {
        amount: prix_total,
        payment_status: "Payé",
        date_payement: new Date(),
        id_user: user_id,
        type: "Billet_Voyage",
      },
      { transaction: t_Multi }
    );

    let compteur_etape = 1;

    // Parcourir les étapes et créer les réservations
    for (const etape of etapes) {
      const num_pax = generateRandomCode(20);

      switch (etape.type) {
        case "avion":
          await reservation_vol.create(
            {
              Nom: user_register.name,
              prenom: user_register.surname,
              Num_reza_PAX: num_pax,
              Num_reza_MMT: num_reza_MMT,
              Enregistre: false,
              Assistance_PMR: assistanceBesoin,
              id_vol: etape.id,
              Bagage_Verifié: false,
            },
            { transaction: t_AF }
          );
          break;

        case "train":
          await reservation_trajet.create(
            {
              Nom: user_register.name,
              prenom: user_register.surname,
              Num_reza_PAX: num_pax,
              Num_reza_MMT: num_reza_MMT,
              Enregistre: false,
              Assistance_PMR: assistanceBesoin,
              id_trajet: etape.id,
              Bagage_Verifié: false,
            },
            { transaction: t_SNCF }
          );
          break;

        case "taxi":
          await reservations_trajet_Uber.create(
            {
              Nom: user_register.name,
              prenom: user_register.surname,
              Num_reza_PAX: num_pax,
              Num_reza_MMT: num_reza_MMT,
              Enregistre: false,
              Assistance_PMR: assistanceBesoin,
              id_Ride: etape.id,
              Bagage_Verifié: false,
            },
            { transaction: t_UBER }
          );
          break;

        default:
          throw new Error(
            `Type de transport '${etape.type}' non pris en charge.`
          );
      }

      // Ajouter une réservation dans la table Reservations
      const reservation = await Reservations.create(
        {
          user_id,
          num_pax,
          num_reza_mmt: num_reza_MMT,
          Enregistré: false,
          assistance_PMR: assistanceBesoin,
          Type_Transport: etape.type,
          Facturation_Id: facturation.billing_id,
          id_voyage,
          etape_voyage: compteur_etape,
          date_reservation: new Date(),
        },
        { transaction: t_Multi }
      );
      reservationsList.push(reservation);
      compteur_etape++;
    }

    // Valider les transactions
    await t_Multi.commit();
    await t_UBER.commit();
    await t_SNCF.commit();
    await t_AF.commit();

    res.status(201).json({
      message: "Réservations créées avec succès.",
      reservations: reservationsList,
    });
  } catch (error) {
    console.error(error);
    await t_Multi.rollback();
    await t_UBER.rollback();
    await t_SNCF.rollback();
    await t_AF.rollback();

    res.status(500).json({
      message: "Erreur lors de la création des réservations.",
      error: error.message,
    });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const allReservations = await Reservations.findAll();
    res.status(200).json(allReservations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des réservations." });
  }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservations.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la réservation." });
  }
};

// Récupérer une réservation par user_id
exports.getReservationByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;

    const reservation = await Reservations.findAll({
      where: { user_id: id_user },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la réservation." });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      num_reza_mmt,
      num_pax,
      Enregistré,
      assistance_PMR,
      Type_Transport,
      Facturation_Id,
      id_voyage,
    } = req.body;

    const reservation = await reservations.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    reservation.user_id = user_id ?? reservation.user_id;
    reservation.num_reza_mmt = num_reza_mmt ?? reservation.num_reza_mmt;
    reservation.num_pax = num_pax ?? reservation.num_pax;
    reservation.Enregistré = Enregistré ?? reservation.Enregistré;
    reservation.assistance_PMR = assistance_PMR ?? reservation.assistance_PMR;
    reservation.Type_Transport = Type_Transport ?? reservation.Type_Transport;
    reservation.Facturation_Id = Facturation_Id ?? reservation.Facturation_Id;
    reservation.id_voyage = id_voyage ?? reservation.id_voyage;

    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la réservation." });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await reservations.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    await reservation.destroy();
    res.status(200).json({ message: "Réservation supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la réservation." });
  }
};

// Fonction pour récupérer l'objet voyage associé à une réservation
exports.getVoyageObjectOfReservations = async (req, res) => {
  const { reservationId } = req.params; // Récupérer l'ID de la réservation depuis les paramètres de la requête

  try {
    // Récupérer la réservation en fonction de l'ID de la réservation
    const reservation = await Reservations.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Récupérer le voyage associé à la réservation
    const voyage = await Voyage.findOne({ id_voyage: reservation.id_voyage });

    if (!voyage) {
      return res.status(404).json({ error: "Voyage associé non trouvé" });
    }

    res.status(200).json(voyage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

// Mettre à jour "Enregistré" pour un voyage spécifique
// Mettre à jour "Enregistré" pour un voyage spécifique
exports.updateEnregistreByVoyageId = async (req, res) => {
  try {
    const id_voyage = req.body.id_voyage;
    const etat = req.body.etat || req.body.état;

    // Validation des données d'entrée
    if (id_voyage === undefined || etat === undefined) {
      return res
        .status(400)
        .json({ message: "Données manquantes : id_voyage ou état." });
    }

    // Vérifie si des réservations existent pour ce voyage
    const reservations = await Reservations.findAll({ where: { id_voyage } });

    if (reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune réservation trouvée pour ce voyage." });
    }

    // Vérifie si l'état est déjà le même pour toutes les réservations
    const allSameState = reservations.every((r) => r.Enregistré === etat);

    if (allSameState) {
      return res.status(200).json({
        message: "Les réservations sont déjà dans l'état souhaité.",
        etat,
      });
    }
    // Met à jour toutes les réservations pour le voyage
    const [updatedRows] = await Reservations.update(
      { Enregistré: etat },
      { where: { id_voyage } }
    );

    res.status(200).json({
      message: `${updatedRows} réservation(s) mise(s) à jour avec succès.`,
      etat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour des réservations.",
      error: error.message,
    });
  }
};

// Récupérer une réservation par user_id avec l'état Enregistré = 1
exports.getReservationEnregistrerByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    const reservation = await Reservations.findAll({
      where: {
        user_id: id_user,
        Enregistré: 1,
      },
    });

    if (reservation.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la réservation." });
  }
};
