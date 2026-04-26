const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const habitudes = [
  {
    titre: 'Méditation',
    description: 'Installe-toi dans un endroit calme, assieds-toi confortablement et ferme les yeux. Porte ton attention uniquement sur ta respiration : observe l\'air qui entre et sort, sans chercher a le controler. Quand une pensee arrive, laisse-la passer sans la juger, puis reviens a ta respiration. Commence par 5 minutes par jour, puis augmente progressivement jusqu\'a 15 ou 20 minutes.',
    effets: 'Reduit le stress et l\'anxiete, ameliore la clarte mentale, renforce ta capacite a rester concentre, stabilise ton humeur et t\'apporte un equilibre emotionnel durable.',
    points: 8
  },
  {
    titre: 'Sport',
    description: 'Choisis une activite physique qui te plait : course, musculation, natation, velo, sport collectif. Fixe-toi une duree minimum (30 minutes) et une intensite qui te sort de ta zone de confort. L\'important n\'est pas la performance mais la regularite : mieux vaut 4 seances moyennes par semaine qu\'une seule seance extreme.',
    effets: 'Renforce ton corps et ton systeme cardiovasculaire, libere des endorphines qui ameliorent ton humeur, augmente ton energie quotidienne et aide a mieux dormir.',
    points: 10
  },
  {
    titre: 'Lecture',
    description: 'Lis au moins 20 pages par jour d\'un livre qui t\'interesse : roman, essai, biographie, livre de developpement personnel. Trouve un moment calme (le matin ou avant de dormir) et evite les distractions comme ton telephone. Garde toujours un livre a portee de main pour profiter des temps morts.',
    effets: 'Elargit ta culture generale, stimule ta creativite et ton imagination, renforce ta concentration et ton vocabulaire, et t\'expose a de nouvelles idees et perspectives.',
    points: 8
  },
  {
    titre: 'Hydratation',
    description: 'Bois au moins 2 litres d\'eau repartis tout au long de la journee (environ 8 verres). Garde une bouteille ou une gourde toujours visible sur ton bureau. Bois un grand verre au reveil, avant chaque repas et entre les repas, sans attendre d\'avoir soif (la soif est deja un signe de deshydratation).',
    effets: 'Ameliore la qualite de ta peau, facilite la digestion, booste tes performances cognitives et physiques, reduit les maux de tete et aide a l\'elimination des toxines.',
    points: 5
  },
  {
    titre: 'Bien manger',
    description: 'Construis tes repas autour d\'aliments naturels : legumes, fruits, proteines (viande, poisson, œufs, legumineuses), feculents complets et bonnes graisses (avocat, noix, huile d\'olive). Evite les plats ultra-transformes, les sodas et le grignotage sucre. Mange lentement et arrete-toi avant d\'etre completement rassasie.',
    effets: 'Booste ton energie sur la duree, renforce ton systeme immunitaire, stabilise ton humeur, ameliore ta concentration et contribue a une meilleure composition corporelle.',
    points: 8
  },
  {
    titre: 'Sommeil',
    description: 'Vise 7 a 9 heures de sommeil par nuit, en te couchant et te levant a des heures regulieres (meme le week-end). Arrete les ecrans au moins 30 minutes avant de dormir, garde ta chambre sombre, fraiche et silencieuse. Evite la cafeine apres 15h et les repas lourds le soir.',
    effets: 'Ameliore la memoire et l\'apprentissage, renforce ton systeme immunitaire, regule tes hormones, accelere la recuperation physique et stabilise ton humeur.',
    points: 10
  },
  {
    titre: 'Journaling',
    description: 'Prends 5 a 10 minutes chaque jour pour ecrire a la main ou sur ton ordinateur. Note tes pensees, tes emotions, tes objectifs ou simplement ce que tu as vecu dans la journee. Pas besoin de bien ecrire : l\'important est la regularite et l\'honnetete avec toi-meme.',
    effets: 'T\'aide a mieux comprendre tes emotions, clarifie tes idees, reduit le stress mental, te permet de suivre ta progression personnelle et stimule ta creativite.',
    points: 6
  },
  {
    titre: 'Détox réseaux',
    description: 'Fixe-toi des plages horaires sans reseaux sociaux (au reveil, pendant les repas, avant de dormir). Desactive les notifications non essentielles et range ton telephone dans une autre piece. Remplace le scrolling par une activite utile : lecture, marche, conversation reelle.',
    effets: 'Tu recuperes plusieurs heures libres par semaine, tu reduis ton anxiete et ta comparaison sociale, tu ameliores ta concentration et tu es plus present avec tes proches.',
    points: 7
  },
  {
    titre: 'Gratitude',
    description: 'Chaque soir, note 3 choses pour lesquelles tu es reconnaissant aujourd\'hui. Elles peuvent etre grandes (une opportunite, une personne importante) ou petites (un bon cafe, un rayon de soleil). Prends le temps de ressentir vraiment la gratitude, pas juste de cocher une case.',
    effets: 'Augmente ton niveau de bonheur a long terme, reduit le stress et les pensees negatives, ameliore tes relations et t\'aide a voir la vie de maniere plus positive.',
    points: 5
  },
  {
    titre: 'Apprendre',
    description: 'Consacre au moins 20 minutes par jour a apprendre quelque chose de nouveau : un mot dans une langue etrangere, un concept, une competence pratique, un fait historique. Utilise des tutoriels, des podcasts, des articles ou des cours en ligne. Varie les sujets selon ta curiosite.',
    effets: 'Garde ton cerveau actif et jeune, elargit tes competences professionnelles et personnelles, renforce ta confiance en toi et t\'ouvre de nouvelles opportunites.',
    points: 8
  },
  {
    titre: 'Douche froide',
    description: 'Termine ta douche habituelle par 1 a 3 minutes d\'eau froide. Commence progressivement : d\'abord tiede, puis fraiche, puis froide. Respire profondement et detends tes muscles. Concentre-toi sur la sensation plutot que de la fuir. Tu peux augmenter la duree au fil des semaines.',
    effets: 'Stimule ta circulation sanguine, renforce ton systeme immunitaire, booste ton energie et ta vigilance, developpe ta discipline mentale et ta tolerance a l\'inconfort.',
    points: 10
  },
  {
    titre: 'Marche',
    description: 'Fais une promenade de 20 a 30 minutes par jour, de preference apres un repas ou en fin de journee. Laisse ton telephone de cote, observe ton environnement, respire profondement et profite du moment. Marche d\'un bon pas sans forcer.',
    effets: 'Facilite la digestion, reduit le stress accumule, ameliore la circulation, aide a mieux dormir et stimule la creativite grace au mouvement et au changement d\'environnement.',
    points: 6
  },
  {
    titre: 'Talent',
    description: 'Identifie une competence que tu veux developper (musique, dessin, code, cuisine, ecriture...) et consacre-lui au moins 30 minutes par jour. Travaille sur un aspect precis a la fois et accepte de progresser lentement. La regularite compte plus que la duree.',
    effets: 'Accelere ta progression grace a la pratique deliberee, renforce ta discipline, te procure un sentiment d\'accomplissement et peut devenir une source de fierte ou de revenus.',
    points: 8
  },
  {
    titre: 'Détox digital',
    description: 'Passe au moins 1 heure par jour totalement sans ecran : pas de telephone, pas d\'ordinateur, pas de television. Utilise ce temps pour lire un livre papier, dessiner, cuisiner, sortir marcher, jouer d\'un instrument ou discuter en face a face.',
    effets: 'Repose tes yeux et reduit la fatigue visuelle, ameliore la qualite de ton sommeil, te reconnecte au monde reel et diminue la dependance aux notifications.',
    points: 7
  },
  {
    titre: 'Yoga',
    description: 'Pratique 15 a 30 minutes de yoga par jour en suivant une video ou une seance guidee. Enchaine des postures simples en te concentrant sur ta respiration profonde. Ecoute ton corps, ne force jamais et adapte les postures a ton niveau.',
    effets: 'Ameliore ta souplesse et ta posture, reduit les tensions musculaires et le mal de dos, apaise ton mental et t\'apporte un calme interieur durable.',
    points: 8
  },
];

async function main() {
  console.log('Nettoyage des anciennes habitudes...');

  // Supprimer les suivis et validations liees aux anciennes habitudes
  const allHabits = await prisma.habitude.findMany();
  const titresValides = habitudes.map((h) => h.titre);
  const aSupprimer = allHabits.filter((h) => !titresValides.includes(h.titre));

  for (const h of aSupprimer) {
    await prisma.suivre.deleteMany({ where: { id_habitude: h.id_habitude } });
    await prisma.validationHabitude.deleteMany({ where: { id_habitude: h.id_habitude } });
    await prisma.habitude.delete({ where: { id_habitude: h.id_habitude } });
    console.log(`  x ${h.titre} (supprimee)`);
  }

  console.log('Seeding habitudes...');

  for (const h of habitudes) {
    const existing = await prisma.habitude.findFirst({ where: { titre: h.titre } });
    if (!existing) {
      await prisma.habitude.create({
        data: { titre: h.titre, description: h.description,effets:h.effets,points:h.points, frequence: 'quotidienne', est_active: true }
      });
      console.log(`  + ${h.titre}`);
    } else {
      await prisma.habitude.update({
        where: { id_habitude: existing.id_habitude },
        data: { description: h.description,effets:h.effets,points:h.points  }
      });
      console.log(`  ~ ${h.titre} (mise a jour)`);
    }
  }

  console.log('Seed termine.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
