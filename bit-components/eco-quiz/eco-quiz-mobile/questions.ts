import type { Question } from './types';

/**
 * Pool of general-knowledge questions about animals, oceans and the environment.
 */
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Quel est le plus grand animal ayant jamais existé sur Terre ?",
    options: ['Le rorqual bleu', "L'éléphant d'Afrique", 'Le brachiosaure', 'Le requin-baleine'],
    correctIndex: 0,
    explanation: "La baleine bleue (rorqual bleu) peut mesurer jusqu'à 30 mètres et peser 170 tonnes.",
    category: 'animaux',
  },
  {
    id: 2,
    text: "Quelle proportion de la surface de la Terre est couverte par les océans ?",
    options: ['Environ 50 %', 'Environ 60 %', 'Environ 71 %', 'Environ 85 %'],
    correctIndex: 2,
    explanation: "Les océans couvrent environ 71 % de la surface de notre planète.",
    category: 'oceans',
  },
  {
    id: 3,
    text: "Combien de temps met une bouteille en plastique à se décomposer dans la nature ?",
    options: ['10 ans', '50 ans', '100 ans', "Jusqu'à 450 ans"],
    correctIndex: 3,
    explanation: "Une bouteille en plastique peut mettre jusqu'à 450 ans à se dégrader.",
    category: 'environnement',
  },
  {
    id: 4,
    text: "Quel animal est souvent recueilli par la SPA ?",
    options: ['Le chat', 'Le chien', 'Le lapin', 'Tous ces animaux'],
    correctIndex: 3,
    explanation: "La SPA recueille chiens, chats, lapins et de nombreux autres animaux.",
    category: 'animaux',
  },
  {
    id: 5,
    text: "Quel gaz est le principal responsable du réchauffement climatique ?",
    options: ["Le dioxyde de carbone (CO₂)", "L'oxygène", "L'azote", "L'hélium"],
    correctIndex: 0,
    explanation: "Le CO₂ issu des activités humaines est le principal gaz à effet de serre.",
    category: 'environnement',
  },
  {
    id: 6,
    text: "Comment appelle-t-on un groupe de poissons nageant ensemble ?",
    options: ['Une meute', 'Un banc', 'Une horde', 'Une nuée'],
    correctIndex: 1,
    explanation: "Les poissons se déplacent en banc pour se protéger des prédateurs.",
    category: 'oceans',
  },
  {
    id: 7,
    text: "Quelle abeille joue un rôle clé dans la pollinisation ?",
    options: ['Le frelon', "L'abeille domestique", 'La guêpe', 'Le moustique'],
    correctIndex: 1,
    explanation: "L'abeille domestique est essentielle à la pollinisation de nombreuses cultures.",
    category: 'environnement',
  },
  {
    id: 8,
    text: "Quel mammifère marin est connu pour son intelligence et ses sauts ?",
    options: ['Le requin', 'Le dauphin', 'La méduse', 'Le thon'],
    correctIndex: 1,
    explanation: "Le dauphin est un mammifère marin très intelligent et social.",
    category: 'oceans',
  },
  {
    id: 9,
    text: "Que faire pour réduire les déchets plastiques dans les océans ?",
    options: ['Utiliser des sacs réutilisables', 'Jeter le plastique à la mer', 'Tout brûler', 'Ne rien changer'],
    correctIndex: 0,
    explanation: "Réduire le plastique à usage unique protège directement la vie marine.",
    category: 'oceans',
  },
  {
    id: 10,
    text: "Quel animal terrestre est le plus rapide du monde ?",
    options: ['Le lion', 'Le guépard', 'Le cheval', "L'antilope"],
    correctIndex: 1,
    explanation: "Le guépard peut atteindre 110 km/h sur de courtes distances.",
    category: 'animaux',
  },
];
