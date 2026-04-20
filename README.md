# FlowState

> Reprenez le controle de votre attention.

FlowState est une application web axee sur la discipline individuelle, la gestion des habitudes et l'hygiene numerique. Dans un environnement de surstimulation constante (reseaux sociaux, alertes, contenus brefs), FlowState aide les utilisateurs a regagner la maitrise de leur attention, organiser leurs habitudes et surveiller leur progression grace a des signaux visuels explicites et inspirants.

---

## Technologies utilisees

### Frontend
- **React 19** — Interface utilisateur
- **React Router** — Navigation entre les pages
- **Axios** — Requetes HTTP vers le backend

### Backend
- **Node.js / Express** — Serveur et API REST
- **Prisma** — ORM pour la base de donnees
- **JWT (jsonwebtoken)** — Authentification par token
- **Bcrypt** — Hashage des mots de passe
- **Dotenv** — Gestion des variables d'environnement

### Outils
- **Nodemon** — Rechargement automatique en developpement
- **GitHub Actions** — Pipeline CI/CD
- **Concurrently** — Lancement simultane frontend + backend

---

## Installation

### Prerequis
- Node.js v18+
- npm

### Cloner le projet
```bash
git clone https://github.com/anas-dev523/FlowState.git
cd FlowState
```

### Installer les dependances
```bash
npm install                              # Racine (concurrently)
cd flowstate-backend && npm install      # Backend
cd flowstate-frontend && npm install     # Frontend
```

### Variables d'environnement
Creer un fichier `.env` dans `flowstate-backend/` :
```
DATABASE_URL="..."
JWT_SECRET="..."
```

---

## Lancer le projet

```bash
# Depuis la racine — lance le backend ET le frontend en une commande
npm run dev
```
- Frontend : http://localhost:3000
- Backend  : http://localhost:5000

---

## Commandes utiles

### Backend
```bash
cd flowstate-backend
npm run dev          # Lance avec auto-reload (nodemon)
npm start            # Lance sans auto-reload
```

### Frontend
```bash
cd flowstate-frontend
npm start            # Lance React sur localhost:3000
npm run build        # Build de production
```

### Base de donnees (Prisma)
```bash
cd flowstate-backend
npx prisma db push       # Applique le schema vers la DB
npx prisma generate      # Regenere le client apres modif du schema
npx prisma studio        # Interface web pour visualiser les donnees
#lancer la migration : 
npx prisma migrate dev --name update_schema_v2
```

---

## Structure du projet

```
FlowState/
├── flowstate-frontend/    # Application React
├── flowstate-backend/     # API Express + Prisma
└── .github/workflows/     # Pipeline CI/CD
```

---

## Auteur

**Anas Chebbi** — Projet individuel dans le cadre du module de conception et developpement
