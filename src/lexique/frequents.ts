/**
 * Hiérarchie de fréquence du vocabulaire enfantin.
 *
 * Le thème d'un mot ne suffit pas à dire s'il est courant : « caserne » et
 * « cuisine » appartiennent au même univers mais l'un s'écrit cent fois plus
 * souvent que l'autre. Ces deux listes corrigent le classement, en s'appuyant
 * sur le vocabulaire réellement produit par les élèves de cycle 2 et 3.
 */

/** Mots du quotidien, omniprésents dans les textes d'enfants. */
export const TRES_FREQUENTS = `
maman papa maison école jour nuit matin soir temps fois chose monsieur madame ami amie copain copine
enfant fille garçon frère sœur famille classe maîtresse maître élève cour récréation cahier livre
crayon stylo cartable devoir leçon histoire mot phrase page dessin jeu jouet ballon vélo voiture
chien chat animal oiseau poisson cheval vache souris lapin ours lion loup
eau pain gâteau bonbon chocolat glace fruit pomme fraise banane orange légume carotte soupe repas
lait jus fromage œuf riz pâtes frite pizza
main pied tête yeux œil cheveu dent bouche nez oreille bras jambe cœur ventre dos doigt corps visage
chambre cuisine jardin porte fenêtre table chaise lit mur salon jouet sac clé
arbre fleur feuille herbe forêt mer plage sable vague montagne ciel soleil lune étoile neige pluie vent
nuage froid chaud saison été hiver printemps automne
ville rue route magasin place parc pont village campagne pays monde terre
vêtement pull pantalon robe chaussure manteau chapeau
anniversaire cadeau fête vacances noël dimanche samedi
peur joie colère bonheur idée problème question réponse histoire secret rêve
être avoir aller faire dire voir venir prendre mettre vouloir pouvoir devoir savoir croire
parler manger boire dormir jouer courir marcher regarder écouter aimer donner demander trouver
chercher entendre partir arriver rester rentrer monter descendre tomber sauter rire pleurer crier
écrire lire compter apprendre comprendre penser oublier commencer finir continuer arrêter
ouvrir fermer laver ranger acheter payer porter poser prendre tenir attendre appeler aider
grand petit beau joli bon mauvais gros long court jeune vieux nouveau
content triste heureux gentil méchant drôle fort faible rapide vite doux
rouge bleu vert jaune noir blanc rose orange gris
chaud froid facile difficile important vrai faux propre sale plein vide
`;

/** Mots fréquents, mais moins que les précédents. */
export const FREQUENTS = `
voisin voisine cousin cousine bébé mamie papi grand-mère grand-père tante oncle
docteur médecin pompier policier boulanger fermier pilote chanteur artiste
cantine bibliothèque récré tableau feutre gomme règle ciseaux colle trousse feuille classeur
dictée poésie lecture calcul maths français anglais sport musique piscine stade match équipe
gâteau tarte crêpe biscuit confiture miel beurre sucre sel salade tomate pomme de terre poulet
poire cerise raisin melon pastèque abricot citron
lapin poule canard cochon mouton chèvre singe éléphant girafe tigre serpent grenouille papillon
abeille fourmi araignée escargot tortue dauphin requin baleine dinosaure écureuil renard hérisson
escalier garage cave grenier balcon toit couloir armoire placard étagère lampe miroir tapis
rivière lac champ colline île rocher caillou pierre boue grotte volcan désert
train bus avion bateau camion moto trottinette tracteur métro gare aéroport voyage valise
téléphone ordinateur télévision écran photo appareil musique chanson film dessin animé
docteur hôpital médicament maladie rhume fièvre bobo pansement
château princesse prince roi reine chevalier dragon sorcière fée monstre pirate trésor magie
football basket natation danse judo vélo course saut médaille victoire
matin midi soir minute heure semaine mois année date calendrier moment
amour amitié courage surprise chance danger silence bruit odeur goût force
maintenant bientôt hier demain toujours jamais souvent parfois encore déjà enfin ensuite
dehors dedans devant derrière dessus dessous partout ici là-bas près loin
mince énorme minuscule magnifique génial formidable terrible horrible parfait
fatigué malade prêt seul perdu curieux timide courageux sage calme
sucré salé délicieux mouillé sec cassé ouvert fermé lourd léger
sourire embrasser câliner partager prêter offrir remercier saluer inviter visiter
dessiner colorier découper coller construire fabriquer réparer casser nettoyer préparer
nager voler grimper glisser danser chanter siffler souffler respirer sentir toucher
expliquer raconter répéter montrer cacher choisir décider essayer réussir gagner perdre
grandir grossir vieillir remplir obéir punir guérir réfléchir choisir saisir
`;

function versEnsemble(source: string): Set<string> {
  return new Set(source.split(/\s+/).map((m) => m.trim().toLowerCase()).filter(Boolean));
}

export const ENSEMBLE_TRES_FREQUENTS = versEnsemble(TRES_FREQUENTS);
export const ENSEMBLE_FREQUENTS = versEnsemble(FREQUENTS);

/** Coefficient appliqué à la fréquence de base d'un lemme. */
export function coefficientFrequence(lemme: string): number {
  const l = lemme.toLowerCase();
  if (ENSEMBLE_TRES_FREQUENTS.has(l)) return 2.6;
  if (ENSEMBLE_FREQUENTS.has(l)) return 1.55;
  return 1;
}
