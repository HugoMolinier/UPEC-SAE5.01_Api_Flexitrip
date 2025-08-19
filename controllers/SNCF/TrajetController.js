const { Trajet } = require("../../models/SNCF");

// Récupérer tous les trajets
exports.getAllTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findAll();
    res.status(200).json(trajet);
  } catch (error) {
    console.error("Erreur lors de la récupération des trajets :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des trajets" });
  }
};
// Récupérer un trajet par l'ID des gares de départ et d'arrivée
exports.getTrajetByGareId = async (req, res) => {
  const { departure_gare_id, arrival_gare_id } = req.params;
  try {
    const trajet = await Trajet.findOne({
      where: {
        departure_gare_id: departure_gare_id,
        arrival_gare_id: arrival_gare_id,
      },
    });
    if (trajet) {
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ message: "Trajet non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du trajet :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du trajet" });
  }
};
// Récupérer un trajet par son ID
exports.getTrajetById = async (req, res) => {
  const { id } = req.params;
  try {
    // Recherche du trajet par ID
    const trajet = await Trajet.findByPk(id);
    if (trajet) {
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ message: "Trajet non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du trajet :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du trajet" });
  }
};

// Créer un trajet
exports.createTrajetSNCF = async (req, res) => {
  const {
    trajet_id,
    company,
    available_seats,
    price,
    max_weight_suitcase,
    departure_gare_id,
    arrival_gare_id,
    departure_time,
    arrival_time,
    status,
  } = req.body;
  try {
    const newtrajet = await Trajet.create({
      trajet_id,
      company,
      available_seats,
      price,
      max_weight_suitcase,
      departure_gare_id,
      arrival_gare_id,
      departure_time,
      arrival_time,
      status,
    });
    res.status(201).json(newtrajet);
  } catch (error) {
    console.error("Erreur lors de la création du trajet :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du trajet" });
  }
};

// Mettre à jour un vol
exports.updateTrajet = async (req, res) => {
  const { id } = req.params;
  const {
    trajet_id,
    company,
    available_seats,
    price,
    max_weight_suitcase,
    departure_gare_id,
    arrival_gare_id,
    departure_time,
    arrival_time,
    status,
  } = req.body;
  try {
    const trajet = await Trajet.findByPk(id);
    if (flight) {
      trajet.trajet_id = trajet_id || trajet.trajet_id;
      trajet.company = company || trajet.company;
      trajet.available_seats = available_seats || trajet.available_seats;
      trajet.price = price || trajet.price;
      trajet.max_weight_suitcase =
        max_weight_suitcase || trajet.max_weight_suitcase;
      trajet.departure_gare_id = departure_gare_id || trajet.departure_gare_id;
      trajet.arrival_gare_id = arrival_gare_id || trajet.arrival_gare_id;
      trajet.departure_time = departure_time || trajet.departure_time;
      trajet.arrival_time = arrival_time || trajet.arrival_time;
      trajet.status = status || trajet.status;

      await flight.save();
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ message: "Trajet non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du trajet :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du Trajet" });
  }
};

// Supprimer un vol
exports.deleteTrajet = async (req, res) => {
  const { id } = req.params;
  try {
    const trajet = await Trajet.findByPk(id);
    if (trajet) {
      await trajet.destroy();
      res.status(200).json({ message: "trajet supprimé avec succès" });
    } else {
      res.status(404).json({ message: "trajet non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du trajet :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du trajet" });
  }
};

// Récupérer tous les vols sous forme d'offre
exports.getAllTrajetAmadeusModel = async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    travelClass,
    includedAirlineCodes,
    excludedAirlineCodes,
    nonStop = false,
    currencyCode,
    maxPrice,
    max = 250,
  } = req.query;

  try {
    const trajet = await Trajet.findAll({
      include: [
        { model: Gare, as: "departure_gare" },
        { model: Gare, as: "arrival_gare" },
      ],
      where: {
        departure_gare_iata_code: originLocationCode || undefined,
        arrival_gare_iata_code: destinationLocationCode || undefined,
        departure_time: departureDate
          ? { [Op.gte]: new Date(departureDate) }
          : undefined,
        arrival_time: returnDate
          ? { [Op.lte]: new Date(returnDate) }
          : undefined,
        price: maxPrice ? { [Op.lte]: maxPrice } : undefined,
      },
      limit: max,
    });

    // Formater les résultats dans le format requis
    const TrajetOffers = trajet.map((trajet) => ({
      type: "trajet-offer",
      id: trajet.trajet_id,
      source: "RATP",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: new Date().toISOString(),
      numberOfBookableSeats: trajet.available_seats,
      itineraries: [
        {
          duration: `PT${Math.floor(Math.random() * 10) + 5}H${Math.floor(
            Math.random() * 60
          )}M`,
          segments: [
            {
              departure: {
                iataCode: trajet.departure_gare.iata_code,
                at: flight.departure_time.toISOString(),
              },
              arrival: {
                iataCode: trajet.arrival_gare.iata_code,
                at: trajet.arrival_time.toISOString(),
              },
              carrierCode: trajet.company,
              number: trajet.trajet_id,
              aircraft: {
                code: "777",
              },
              operating: {
                carrierCode: trajet.company,
              },
              duration: `PT${Math.floor(Math.random() * 5) + 4}H${Math.floor(
                Math.random() * 60
              )}M`,
              id: trajet.trajet_id,
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
    }));

    // Envoyer la réponse au format requis
    res.status(200).json({ data: TrajetOffers });
  } catch (error) {
    console.error("Erreur lors de la récupération des trajets :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des trajets" });
  }
};
