# SAE5.01 - Gestion et assistance des PMR

Projet SAE5.01 réalisé dans le cadre du BUT Informatique. Ce projet s'est déroulé de septembre 2024 à janvier 2025 et constituait le projet majeur de notre cinquième semestre. L'objectif principal était de concevoir et de développer une API complète capable de faciliter la mobilité des personnes à mobilité réduite (PMR) dans des environnements multimodaux, tout en fournissant aux agents et accompagnants un outil de suivi et de gestion en temps réel.

L’API a été conçue l’application mobile et web destinée aux PMR, permettant aux utilisateurs de planifier et réserver leurs trajets, recevoir des notifications personnalisées et bénéficier d’une assistance adaptée à leurs besoins. Pour les agents et accompagnants, l’API fournit un tableau de bord en temps réel pour gérer les réservations, suivre les trajets, coordonner l’assistance et intervenir rapidement en cas de problème. Et pour communiquer avec les api des entreprises pour la reservation et optention des données de trajet.

---

## Réalisation BackEnd

- **Hugo Molinier** : développement de l’API, gestion des routes SQL et NoSQL, intégration des services externes (Air France, SNCF, Uber), sécurisation des données et implémentation des fonctionnalités principales.
- **Yassine Arrault** : configuration de l’infrastructure, gestion de l’environnement serveur, Redis et aide pour le middleware et kafka

Le projet combine un backend robuste et sécurisé avec une architecture orientée services pour gérer efficacement les trajets et l’assistance des PMR.

## Fonctionnalités principales

- Gestion des utilisateurs (PMR, agents, accompagnants)
- Gestion des réservations et trajets multimodaux
- Authentification et autorisation (y compris biométrique)
- Suivi des bagages et assistance PMR
- Notifications en temps réel
- Intégration simulée avec des services externes (Air France, SNCF/RATP, FlixBus, Uber) via le standard Amadeus
- Gestion sécurisée des données sensibles
- Suivi des événements via Apache Kafka

---

## Architecture

- **Backend** : Node.js, Express
- **Bases de données** : SQL pour les données sensibles, MongoDB pour les données évolutives
- **Middlewares** :
  - Authentification et gestion des tokens
  - Session et persistance des connexions
  - Gestion centralisée des erreurs
- **Mobile** : React Native + Expo + EAS pour compilation APK

---

## Installation

1. Cloner le dépôt :

```bash
git clone <URL_DU_DEPOT>
```

2. Installer les dépendances :

```bash
npm install
```

3. Configurer les variables d'environnement :

```env
PORT=3000
DB_SQL_HOST=...
DB_SQL_USER=...
DB_SQL_PASSWORD=...
DB_MONGO_URI=...
JWT_SECRET=...
KAFKA_BROKER=...
```

4. Lancer l'API :

```bash
npm run dev
```

---

## Routes principales

### Routes SQL

- `POST /reservations` : Gestion des réservations
- `POST /facturation` : Gestion de la facturation
- `POST /users` : Gestion des utilisateurs
- `POST /agent` : Gestion des agents

### Routes Air France (AF)

- `GET /AF/airports` : Liste des aéroports
- `GET /AF/flights` : Informations sur les vols

### Routes SNCF

- `GET /SNCF/gare` : Informations sur les gares
- `GET /SNCF/trajet` : Gestion des trajets SNCF

### Routes Uber

- `GET /UBER/ride` : Gestion des trajets en taxi

### Routes NoSQL

- `POST /voyage` : Gestion des voyages
- `POST /biometric` : Gestion de l'authentification biométrique
- `POST /notification` : Envoi des notifications
- `POST /blockchain` : Gestion des transactions e-wallet
- `POST /contact` : Gestion des contacts

### Routes HUB

- `POST /kafka` : Gestion des événements via Kafka

---

## Utilisation

L’API est conçue pour être utilisée par :

- L’application mobile PMR
- Les agents et accompagnants
- Le back-office de suivi et gestion des trajets

Toutes les requêtes sont sécurisées via JWT et les middlewares garantissent l’intégrité et la fiabilité des données.
