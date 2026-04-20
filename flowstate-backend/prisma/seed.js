const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const habitudes = [
  {
    titre: 'Méditation',
    description: 'La meditation consiste a t\'asseoir confortablement, fermer les yeux et porter ton attention sur ta respiration, sans juger tes pensees. Quelques minutes suffisent pour calmer ton esprit et reduire ton stress.\n\nEffets: Pratiquee regulierement, elle ameliore ta clarte mentale, ton humeur et ton equilibre emotionnel.'
  },
  {
    titre: 'Sport',
    description: 'Le sport consiste a bouger ton corps de maniere intense : course, musculation, natation ou tout autre exercice physique. L\'objectif est de te depasser un peu chaque jour.\n\nEffets: Il renforce ton corps, libere des endorphines et ameliore ta concentration et ton energie tout au long de la journee.'
  },
  {
    titre: 'Lecture',
    description: 'Lire 20 pages par jour, c\'est prendre un moment calme pour absorber de nouvelles idees, histoires ou connaissances. Choisis un livre qui t\'inspire ou te challenge.\n\nEffets: La lecture ameliore ta culture generale, stimule ta creativite et renforce ta capacite de concentration.'
  },
  {
    titre: 'Hydratation',
    description: 'L\'hydratation consiste a boire au moins 8 verres d\'eau repartis sur ta journee. Garde une bouteille a portee de main et bois regulierement, meme sans soif.\n\nEffets: Une bonne hydratation ameliore ta peau, ta digestion, ton energie et tes performances cognitives.'
  },
  {
    titre: 'Bien manger',
    description: 'Bien manger c\'est privilegier des aliments naturels et equilibres : fruits, legumes, proteines et feculents complets. Evite les plats ultra-transformes et le grignotage excessif.\n\nEffets: Une alimentation saine booste ton energie, renforce ton systeme immunitaire et ameliore ton humeur.'
  },
  {
    titre: 'Sommeil',
    description: 'Dormir 8 heures signifie te coucher et te lever a des heures regulieres, en evitant les ecrans avant de dormir. Cree un environnement calme et sombre pour un sommeil de qualite.\n\nEffets: Un bon sommeil ameliore ta memoire, ta recuperation physique et ta capacite a gerer le stress.'
  },
  {
    titre: 'Journaling',
    description: 'Le journaling consiste a ecrire chaque jour tes pensees, tes objectifs ou tes reflexions. Pas besoin d\'ecrire beaucoup, quelques lignes suffisent pour vider ton esprit.\n\nEffets: Il t\'aide a mieux te connaitre, a clarifier tes idees et a suivre ta progression personnelle.'
  },
  {
    titre: 'Détox réseaux',
    description: 'La detox reseaux consiste a eviter volontairement les reseaux sociaux pendant une periode definie. Desactive les notifications et remplace le scrolling par une activite constructive.\n\nEffets: Tu retrouves du temps libre, tu reduis ton anxiete et tu ameliores ta presence dans le moment.'
  },
  {
    titre: 'Gratitude',
    description: 'Pratiquer la gratitude c\'est noter chaque jour 3 choses pour lesquelles tu es reconnaissant. Elles peuvent etre simples : un bon repas, un moment agreable, une personne qui compte.\n\nEffets: La gratitude augmente ton bonheur, reduit le stress et t\'aide a voir la vie de maniere plus positive.'
  },
  {
    titre: 'Apprendre',
    description: 'Apprendre quelque chose de nouveau chaque jour : un mot, un concept, une technique. Regarde un tutoriel, lis un article ou explore un sujet qui te passionne.\n\nEffets: L\'apprentissage continu garde ton cerveau actif, elargit tes competences et renforce ta confiance en toi.'
  },
  {
    titre: 'Douche froide',
    description: 'La douche froide consiste a terminer ta douche par 1 a 3 minutes d\'eau froide. Commence progressivement si tu debutes, en baissant la temperature petit a petit.\n\nEffets: Elle stimule ta circulation sanguine, renforce ton systeme immunitaire et developpe ta discipline mentale.'
  },
  {
    titre: 'Marche',
    description: 'La marche du soir est une promenade de 20 a 30 minutes apres ta journee. Marche sans telephone si possible, observe ton environnement et profite du calme.\n\nEffets: Elle facilite la digestion, reduit le stress accumule et t\'aide a mieux dormir.'
  },
  {
    titre: 'Talent',
    description: 'Pratiquer un talent c\'est consacrer du temps chaque jour a une competence que tu veux developper : musique, dessin, code, cuisine ou tout autre domaine.\n\nEffets: La pratique reguliere accelere ta progression, renforce ta discipline et te donne un sentiment d\'accomplissement.'
  },
  {
    titre: 'Détox digital',
    description: 'La detox digitale consiste a passer au moins une heure par jour sans aucun ecran : pas de telephone, pas d\'ordinateur, pas de television. Lis, dessine, sors ou medite.\n\nEffets: Elle repose tes yeux, ameliore ta qualite de sommeil et te reconnecte au monde reel.'
  },
  {
    titre: 'Yoga',
    description: 'Le yoga combine des postures physiques, la respiration et la concentration. Meme 15 minutes par jour suffisent pour etirer ton corps et apaiser ton esprit.\n\nEffets: Il ameliore ta souplesse, reduit les tensions musculaires et t\'apporte un calme interieur durable.'
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
        data: { titre: h.titre, description: h.description, frequence: 'quotidienne', est_active: true }
      });
      console.log(`  + ${h.titre}`);
    } else {
      await prisma.habitude.update({
        where: { id_habitude: existing.id_habitude },
        data: { description: h.description }
      });
      console.log(`  ~ ${h.titre} (mise a jour)`);
    }
  }

  console.log('Seed termine.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
