Demarrer le projet

# Terminal 1 - Lancer le backend
cd flowstate-backend
npm run dev                  # Lance avec nodemon (reload auto quand tu modifies)

# Terminal 2 - Lancer le frontend
cd flowstate-frontend
npm start                    # Lance React sur localhost:3000
Commandes backend

cd flowstate-backend

npm install                  # Installe tous les packages du package.json
npm install express          # Installe UN package specifique
npm run dev                  # Lance le serveur avec auto-reload
npm start                    # Lance le serveur sans auto-reload

# Prisma (base de donnees)
npx prisma db push           # Pousse ton schema vers la DB (cree les tables)
npx prisma generate          # Regenere le client Prisma apres modif du schema
npx prisma studio            # Ouvre une interface web pour voir tes donnees


# Commandes frontend:
cd flowstate-frontend

npm install                  # Installe les packages
npm start                    # Lance le serveur de dev (localhost:3000)
npm run build                # Cree une version optimisee pour la production
Commandes git
