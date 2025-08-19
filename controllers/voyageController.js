const { Voyage } = require("../models");
const { Vol } = require("../models/AF");
const { Trajet } = require("../models/SNCF");
const { Ride } = require("../models/Uber");

const sequelizeSAE_UBER = require("../config/databaseUBER");

// Créer un nouveau voyage
//req : {"id_pmr":1,"id_accompagnant":1,"prixtotal":5,id_baguage[{"id":1,poid:"10kg","descriptif":"rouge"}],etapes:[{"type":"avion","id":"FL12345"},{"type":"avion","id":"FL55555"},{"type":"taxi","departure_time":...,"arrival_time":...,"adresse_1":"...","adresse_2":"..."}]'
//rep :{
//  pmrid:"1",
// accompagnant_id;'1',
//   "date_debut": "2024-01-01T00:00:00Z",
//   "date_fin": "2024-01-15T00:00:00Z",
//   "lieu_depart": {
//     locomotion:"train"
//     id:1
//   },
//   "lieu_arrive": {
//     locomotion:"avion"
//     id:3
//   },
//   "bagage":[{
//        "id": 1 ,
//        "poid":10,
//        "descriptif":"rouge
//      "}]
//   "etapes": [
//     1:{
//       "id": FL12345,
//       "type": "avion",
//       "compagnie": "Air France",
//     },
//     2:{
//       "id": FL5555,
//       "type": "train",
//       "compagnie": "Shinkansen",
//     },
//     3:{
//       "id": 1,
//       "type": "taxi",
//       "compagnie": "Uber",
//      "adresse_1":"2 rue albert mallet",
//      "adresse_2": "3 rue albert mallet "

//     },
//   ],
//   "prix_total": 971.25
// }
exports.createVoyage = async (req, res) => {
  try {
    // Analyse de l'entrée
    const t_UBER = await sequelizeSAE_UBER.transaction();
    const { id_pmr, id_accompagnant, prix_total, etapes, bagage } = req.body;

    console.log(req.body);
    if (!Array.isArray(etapes)) {
      return res
        .status(400)
        .json({ error: 'Le champ "etapes" doit être un tableau.' });
    }

    const etapesDetails = [];
    let lieu_depart = null;
    let lieu_arrive = null;
    let date_debut = null;
    let date_fin = null;

    // Traitement des étapes
    for (let i = 0; i < etapes.length; i++) {
      const { type, id } = etapes[i];
      let data = null;
      let id_data = null;

      // Récupérer les informations en fonction du type
      if (type == "avion") {
        data = await Vol.findByPk(id);
        id_data = data ? data.flight_id : null;
      } else if (type === "train") {
        data = await Trajet.findByPk(id);
        id_data = data ? data.Trajet_id : null;
      } else if (type === "taxi") {
        // Création d'une nouvelle "ride" pour l'étape "taxi"
        data = await Ride.create(
          {
            adresse_1: etapes[i].adresse_1,
            adresse_2: etapes[i].adresse_2,
            departure_time: etapes[i].departure_time,
            arrival_time: etapes[i].arrival_time,
            status: "Prévu",
            company: "UBER",
          },
          { transaction: t_UBER }
        );
        id_data = data ? data.Ride_Id : null;
      }

      if (!data) {
        await t_UBER.rollback();
        return res
          .status(404)
          .json({
            error: `Étape ${i} introuvable avec le type ${type} et l'id ${id}`,
          });
      }

      // Construction des étapes
      etapesDetails.push({
        id: id_data,
        type: type,
        compagnie: data.company || data.train_company || data.taxi_company,
        adresse_1: data.adresse_1 || "",
        adresse_2: data.adresse_2 || "",
      });

      // Mise à jour des informations principales pour lieu_depart et lieu_arrive
      if (i === 0) {
        let depart_id;

        if (type === "taxi") {
          depart_id = data.adresse_1;
        } else {
          depart_id = data.departure_airport_id || data.departure_station_id;
        }

        lieu_depart = {
          locomotion: type,
          id: depart_id,
        };
        date_debut = data.departure_time || null;
      }

      if (i === etapes.length - 1) {
        let arrive_id;

        if (type === "taxi") {
          arrive_id = data.adresse_2;
        } else {
          arrive_id =
            data.arrival_airport_id ||
            data.arrival_station_id ||
            data.arrival_taxi_id;
        }

        lieu_arrive = {
          locomotion: type,
          id: arrive_id,
        };
        date_fin = data.arrival_time || null;
      }
    }

    // Construction de la réponse finale
    const newVoyage = {
      pmrid: id_pmr,
      accompagnant_id: id_accompagnant || null,
      date_debut,
      date_fin,
      lieu_depart,
      lieu_arrive,
      bagage: bagage || [],
      etapes: etapesDetails,
      prix_total,
    };

    // Sauvegarde dans la base de données pour le voyage
    const voyageEnregistre = await Voyage.create(newVoyage);
    await t_UBER.commit();
    // Réponse
    res.status(201).json(voyageEnregistre);
  } catch (error) {
    await t_UBER.rollback();
    console.error("Erreur lors de la création du voyage :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création du voyage" });
  }
};

/** V1 ne pas encore delete 21/01/25
exports.createVoyage = async (req, res) => {
  try {
    // Analyse de l'entrée
    const { id_pmr, id_accompagnant, etapes } = req.body;

    console.log(etapes);
    if (!Array.isArray(etapes)) {
      return res.status(400).json({ error: 'Le champ "etapes" doit être un tableau.' });
    }

    const etapesDetails = [];
    let lieu_depart = null;
    let lieu_arrive = null;
    let id = null;
    let date_debut = null;
    let date_fin = null;
    let prix_total = 0;

    // Traitement des étapes
    for (let i = 0; i < etapes.length; i++) {
      const { type, id } = etapes[i];
      let data = null;

      // Récupérer les informations en fonction du type
      if (type === 'avion') {
        data = await Vol.findByPk(id);
        id_data = data.flight_id
      } else if (type === 'train') {
        data = await Trajet.findByPk(id);
        id_data = data.Trajet_id
      }

      if (!data) {
        return res.status(404).json({ error: `Étape ${i} introuvable avec le type ${type} et l'id ${id}` });
      }

      // Construction des étapes
      etapesDetails.push({
        id:id_data,
        type_Transport: type,
        compagnie: data.company || data.train_company, // Exemple pour avions et trains
      });

      // Mise à jour des informations principales
      if (i === 0) {
        lieu_depart = {
          locomotion: type,
          id: data.departure_airport_id || data.departure_station_id, // Exemple pour avions/trains
        };
        date_debut = data.departure_time; // Exemple
      }

      if (i === etapes.length - 1) {
        lieu_arrive = {
          locomotion: type,
          id: data.arrival_airport_id || data.arrival_station_id, // Exemple pour avions/trains
        };
        date_fin = data.arrival_time; // Exemple
      }

      // Calcul du prix total
      prix_total += data.price;
    }

    // Construction de la réponse finale
    const newVoyage = {
      id_pmr,
      id_accompagnant,
      date_debut,
      date_fin,
      lieu_depart,
      lieu_arrive,
      etapes: etapesDetails,
      prix_total,
    };


    console.log(newVoyage)
    // Sauvegarde dans la base de données (optionnel)
    const voyageEnregistre = await Voyage.create(newVoyage);

    // Réponse
    res.status(201).json(voyageEnregistre);
  } catch (error) {
    console.error("Erreur lors de la création du voyage :", error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du voyage' });
  }
};
*/

// Récupérer tous les voyages
exports.getVoyages = async (req, res) => {
  try {
    const voyages = await Voyage.find();
    if (!voyages.length) {
      return res.status(404).json({ error: "Aucun voyage trouvé" });
    }
    res.status(200).json(voyages.map((voyage) => voyage.toJSON()));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des voyages" });
  }
};

exports.getVoyageById = async (req, res) => {
  const { id } = req.params;
  try {
    const voyage = await Voyage.findOne({ id_voyage: id });
    if (!voyage) {
      return res.status(404).json({ error: "Voyage non trouvé" });
    }
    res.status(200).json(voyage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du voyage" });
  }
};

// Mettre à jour un voyage
exports.updateVoyage = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Voyage.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Voyage non trouvé" });
    }
    const updatedVoyage = await Voyage.findByPk(id);
    res.status(200).json(updatedVoyage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du voyage" });
  }
};

// Supprimer un voyage
exports.deleteVoyage = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Voyage.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Voyage non trouvé" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression du voyage" });
  }
};
