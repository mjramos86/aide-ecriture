/**
 * Adjectifs, adverbes, mots-outils et expressions.
 */

/** Format : "masculin[:féminin irrégulier][:emoji]" — le féminin régulier est calculé. */
export const ADJECTIFS: [theme: string, freq: number, entries: string][] = [
  ['couleur', 5, 'rouge::🔴 bleu::🔵 vert::🟢 jaune::🟡 orange::🟠 violet:violette:🟣 rose::🌸 noir::⚫ blanc:blanche:⚪ gris::🩶 marron::🟤 beige::🟤 doré::🥇 argenté::🥈 coloré::🌈 clair::☀️ foncé::🌑 sombre::🌑'],
  ['taille', 5, 'grand::📏 petit::🤏 gros:grosse:🐘 mince::🪶 maigre::🪶 énorme::🦣 immense::🌌 minuscule::🐜 géant::🧌 long:longue:📏 court::✂️ haut::⬆️ bas:basse:⬇️ large::↔️ étroit::↕️ épais:épaisse:📚 fin:fine:🪶 profond::🕳️ léger:légère:🪶 lourd::🏋️ moyen:moyenne:➖'],
  ['qualité', 5, 'beau:belle:😍 joli::🌸 laid::🙁 moche::🙁 bon:bonne:👍 mauvais::👎 meilleur::🥇 super::🌟 génial::🤩 formidable::🎉 extraordinaire::✨ magnifique::😍 merveilleux:merveilleuse:✨ terrible::😱 horrible::😱 affreux:affreuse:😱 nul:nulle:👎 parfait::💯 sympa::😊 gentil:gentille:😇 méchant::😈 sage::😇 poli::🙇 impoli::😤 drôle::😄 amusant::🎉 rigolo:rigolote:😜 ennuyeux:ennuyeuse:😑 intéressant::🤓 important::❗ facile::😌 difficile::😖 dur:dure:🪨 simple::✅ compliqué::🌀 possible::✅ impossible::❌ vrai::✅ faux:fausse:❌ juste::⚖️ propre::🧼 sale::🧽 neuf:neuve:✨ vieux:vieille:👴 ancien:ancienne:🏛️ nouveau:nouvelle:🆕 moderne::📱 utile::🛠️ inutile::🚫 dangereux:dangereuse:⚠️ prudent::🦺 solide::🧱 fragile::🥚 doux:douce:🪶 rugueux:rugueuse:🪨 mou:molle:🫠 rigide::📏 souple::🤸'],
  ['état', 5, 'content::😃 heureux:heureuse:😄 malheureux:malheureuse:😢 triste::😢 fâché::😠 énervé::😤 calme::😌 tranquille::😌 fatigué::🥱 malade::🤒 en forme::💪 fort:forte:💪 faible::🥺 courageux:courageuse:🦁 peureux:peureuse:😨 timide::🙈 fier:fière:😌 jaloux:jalouse:😒 surpris:surprise:😲 étonné::😮 inquiet:inquiète:😟 pressé::🏃 occupé::📋 prêt:prête:✅ perdu::🗺️ seul::🧍 ensemble::👥 libre::🕊️ amoureux:amoureuse:😍 curieux:curieuse:🔍 attentif:attentive:👀 distrait::💭 poli::🙇 sérieux:sérieuse:🤓 paresseux:paresseuse:🦥 travailleur:travailleuse:💼 rapide::⚡ lent:lente:🐢 vif:vive:⚡ agité::🌀 endormi::😴 réveillé::⏰ affamé::🍽️ assoiffé::🥤 plein:pleine:🫗 vide::🫙 ouvert::🚪 fermé::🚪 cassé::💥 abîmé::💔 mouillé::💧 sec:sèche:🏜️ humide::💦 chaud::🔥 froid::❄️ tiède::🌡️ gelé::🧊 brûlant::🔥 sucré::🍬 salé::🧂 acide::🍋 amer:amère:☕ délicieux:délicieuse:😋 dégoûtant::🤢 bruyant::🔊 silencieux:silencieuse:🤫 lumineux:lumineuse:💡 brillant::✨ transparent::🪟 rond:ronde:⭕ carré::⬜ pointu::📌 plat:plate:🫓 droit::📏 tordu::🌀 riche::💰 pauvre::🪙 célèbre::🌟 connu::👀 secret:secrète:🤫 magique::✨ sauvage::🐺 domestique::🐕 gratuit::🆓 cher:chère:💸 premier:première:🥇 dernier:dernière:🏁 prochain::➡️ suivant::➡️ précédent::⬅️ pareil:pareille:🟰 différent::↔️ même::🟰 autre::↔️ chaque::☝️ tout:toute:💯 plusieurs::🔢 quelques::🔢 jeune::🧒 âgé::👴 adulte::🧑 humain::🧑 animal::🐾 naturel:naturelle:🌿 mort:morte:🪦 vivant::🌱 malin:maligne:🦊 intelligent::🧠 bête::🙃 fou:folle:🤪 bizarre::🤨 étrange::👽 normal::✅ habituel:habituelle:🔁 rare::💎 génial::🤩'],
];

/** Adjectifs à féminin/pluriel totalement irréguliers. */
export const ADJ_IRREG: Record<string, [fs: string, mp: string, fp: string, devantVoyelle?: string]> = {
  beau: ['belle', 'beaux', 'belles', 'bel'],
  nouveau: ['nouvelle', 'nouveaux', 'nouvelles', 'nouvel'],
  vieux: ['vieille', 'vieux', 'vieilles', 'vieil'],
  fou: ['folle', 'fous', 'folles', 'fol'],
  mou: ['molle', 'mous', 'molles', 'mol'],
  tout: ['toute', 'tous', 'toutes'],
};

/** Adverbes et mots de liaison : "mot[:emoji]". */
export const ADVERBES: [theme: string, freq: number, entries: string][] = [
  ['temps', 5, 'aujourd\'hui:📅 demain:📅 hier:📅 maintenant:⏰ bientôt:⏳ tard:🌙 tôt:🌅 toujours:♾️ jamais:🚫 souvent:🔁 parfois:🤷 quelquefois:🤷 rarement:💎 encore:🔁 déjà:✅ enfin:🏁 ensuite:➡️ puis:➡️ après:➡️ avant:⬅️ pendant:⏳ longtemps:⏳ immédiatement:⚡ soudain:💥 brusquement:💥 autrefois:🏛️ désormais:➡️ récemment:🆕 tantôt:🤷 aussitôt:⚡ d\'abord:1️⃣ finalement:🏁 alors:➡️ depuis:⏳ jusque:🛑 tout à coup:💥 tout de suite:⚡ en même temps:⏱️'],
  ['lieu', 4, 'ici:📍 là:📍 là-bas:👉 partout:🌍 ailleurs:🗺️ dehors:🌳 dedans:🏠 dessus:⬆️ dessous:⬇️ devant:⬅️ derrière:➡️ près:🤏 loin:🔭 autour:🔄 à côté:↔️ en haut:⬆️ en bas:⬇️ au milieu:🎯 à droite:➡️ à gauche:⬅️ tout droit:⬆️'],
  ['manière', 5, 'bien:👍 mal:👎 mieux:🥇 vite:⚡ lentement:🐢 doucement:🤫 fort:📢 gentiment:😇 calmement:😌 rapidement:⚡ facilement:😌 difficilement:😖 vraiment:💯 sûrement:✅ peut-être:🤷 certainement:✅ probablement:🤔 heureusement:😌 malheureusement:😢 surtout:⭐ presque:≈ complètement:💯 totalement:💯 exactement:🎯 simplement:👌 seulement:☝️ ensemble:👥 surtout:⭐ également:🟰 ainsi:👉 comment:❓ pourquoi:❓ combien:🔢 tellement:💯 joyeusement:😄 tristement:😢 poliment:🙇 silencieusement:🤫 soigneusement:✨ attentivement:👀'],
  ['quantité', 5, 'beaucoup:📈 peu:📉 trop:🚫 assez:👌 plus:➕ moins:➖ très:💯 si:💯 autant:🟰 tout:💯 rien:0️⃣ tant:💯 environ:≈ davantage:📈 un peu:🤏 pas du tout:🚫 énormément:🤯'],
  ['logique', 5, 'oui:✅ non:❌ si:✅ aussi:➕ non plus:➖ pourtant:🤔 cependant:🤔 quand même:💪 donc:➡️ alors:➡️ ainsi:👉 par contre:↔️ en effet:✅ bien sûr:✅ d\'accord:🤝 évidemment:💡 sinon:🔀 plutôt:🤷 vraiment:💯 même:🟰 ne:🚫 pas:🚫 plus:🚫 jamais:🚫 rien:0️⃣ personne:🚫 aucun:🚫 nulle part:🚫'],
];

/** Mots-outils : classe grammaticale et traits explicites. */
export interface MotOutil { w: string; pos: string; g?: 'm' | 'f' | 'mf'; n?: 's' | 'p' | 'sp'; pers?: number; freq: number; elide?: boolean }

export const MOTS_OUTILS: MotOutil[] = [
  // Déterminants
  { w: 'le', pos: 'det', g: 'm', n: 's', freq: 100 }, { w: 'la', pos: 'det', g: 'f', n: 's', freq: 100 },
  { w: 'les', pos: 'det', g: 'mf', n: 'p', freq: 100 }, { w: "l'", pos: 'det', g: 'mf', n: 's', freq: 90, elide: true },
  { w: 'un', pos: 'det', g: 'm', n: 's', freq: 100 }, { w: 'une', pos: 'det', g: 'f', n: 's', freq: 100 },
  { w: 'des', pos: 'det', g: 'mf', n: 'p', freq: 100 }, { w: 'du', pos: 'det', g: 'm', n: 's', freq: 95 },
  { w: 'de', pos: 'prep', freq: 100 }, { w: "d'", pos: 'prep', freq: 80, elide: true },
  { w: 'ce', pos: 'det', g: 'm', n: 's', freq: 90 }, { w: 'cet', pos: 'det', g: 'm', n: 's', freq: 70 },
  { w: 'cette', pos: 'det', g: 'f', n: 's', freq: 90 }, { w: 'ces', pos: 'det', g: 'mf', n: 'p', freq: 90 },
  { w: 'mon', pos: 'det', g: 'm', n: 's', freq: 95 }, { w: 'ma', pos: 'det', g: 'f', n: 's', freq: 95 },
  { w: 'mes', pos: 'det', g: 'mf', n: 'p', freq: 95 }, { w: 'ton', pos: 'det', g: 'm', n: 's', freq: 80 },
  { w: 'ta', pos: 'det', g: 'f', n: 's', freq: 80 }, { w: 'tes', pos: 'det', g: 'mf', n: 'p', freq: 80 },
  { w: 'son', pos: 'det', g: 'm', n: 's', freq: 90 }, { w: 'sa', pos: 'det', g: 'f', n: 's', freq: 90 },
  { w: 'ses', pos: 'det', g: 'mf', n: 'p', freq: 90 }, { w: 'notre', pos: 'det', g: 'mf', n: 's', freq: 75 },
  { w: 'nos', pos: 'det', g: 'mf', n: 'p', freq: 75 }, { w: 'votre', pos: 'det', g: 'mf', n: 's', freq: 70 },
  { w: 'vos', pos: 'det', g: 'mf', n: 'p', freq: 70 }, { w: 'leur', pos: 'det', g: 'mf', n: 's', freq: 80 },
  { w: 'leurs', pos: 'det', g: 'mf', n: 'p', freq: 80 },
  { w: 'quel', pos: 'det', g: 'm', n: 's', freq: 60 }, { w: 'quelle', pos: 'det', g: 'f', n: 's', freq: 60 },
  { w: 'quels', pos: 'det', g: 'm', n: 'p', freq: 50 }, { w: 'quelles', pos: 'det', g: 'f', n: 'p', freq: 50 },
  { w: 'chaque', pos: 'det', g: 'mf', n: 's', freq: 65 }, { w: 'plusieurs', pos: 'det', g: 'mf', n: 'p', freq: 60 },
  { w: 'quelques', pos: 'det', g: 'mf', n: 'p', freq: 60 }, { w: 'aucun', pos: 'det', g: 'm', n: 's', freq: 50 },
  { w: 'aucune', pos: 'det', g: 'f', n: 's', freq: 45 },
  // Pronoms sujets
  { w: 'je', pos: 'pron_suj', pers: 1, n: 's', freq: 100 }, { w: "j'", pos: 'pron_suj', pers: 1, n: 's', freq: 95, elide: true },
  { w: 'tu', pos: 'pron_suj', pers: 2, n: 's', freq: 90 }, { w: 'il', pos: 'pron_suj', pers: 3, n: 's', g: 'm', freq: 100 },
  { w: 'elle', pos: 'pron_suj', pers: 3, n: 's', g: 'f', freq: 100 }, { w: 'on', pos: 'pron_suj', pers: 3, n: 's', freq: 90 },
  { w: 'nous', pos: 'pron_suj', pers: 4, n: 'p', freq: 90 }, { w: 'vous', pos: 'pron_suj', pers: 5, n: 'p', freq: 90 },
  { w: 'ils', pos: 'pron_suj', pers: 6, n: 'p', g: 'm', freq: 95 }, { w: 'elles', pos: 'pron_suj', pers: 6, n: 'p', g: 'f', freq: 85 },
  // Pronoms compléments et réfléchis
  { w: 'me', pos: 'pron_comp', freq: 80 }, { w: 'te', pos: 'pron_comp', freq: 70 }, { w: 'se', pos: 'pron_comp', freq: 85 },
  { w: "m'", pos: 'pron_comp', freq: 70, elide: true }, { w: "t'", pos: 'pron_comp', freq: 60, elide: true }, { w: "s'", pos: 'pron_comp', freq: 75, elide: true },
  { w: 'lui', pos: 'pron_comp', freq: 85 }, { w: 'leur', pos: 'pron_comp', freq: 70 }, { w: 'y', pos: 'pron_comp', freq: 80 },
  { w: 'en', pos: 'pron_comp', freq: 85 }, { w: 'moi', pos: 'pron', freq: 85 }, { w: 'toi', pos: 'pron', freq: 75 },
  { w: 'eux', pos: 'pron', freq: 60 }, { w: 'celui', pos: 'pron', g: 'm', n: 's', freq: 55 }, { w: 'celle', pos: 'pron', g: 'f', n: 's', freq: 55 },
  { w: 'ceux', pos: 'pron', g: 'm', n: 'p', freq: 50 }, { w: 'celles', pos: 'pron', g: 'f', n: 'p', freq: 45 },
  { w: 'ça', pos: 'pron', freq: 90 }, { w: 'cela', pos: 'pron', freq: 60 }, { w: 'ceci', pos: 'pron', freq: 40 },
  { w: "c'", pos: 'pron_suj', pers: 3, n: 's', freq: 90, elide: true }, { w: 'ce', pos: 'pron_suj', pers: 3, n: 's', freq: 70 },
  { w: 'qui', pos: 'pron_rel', freq: 95 }, { w: 'que', pos: 'pron_rel', freq: 95 }, { w: "qu'", pos: 'pron_rel', freq: 85, elide: true },
  { w: 'quoi', pos: 'pron', freq: 70 }, { w: 'dont', pos: 'pron_rel', freq: 45 }, { w: 'où', pos: 'pron_rel', freq: 80 },
  { w: 'le', pos: 'pron_comp', freq: 80 }, { w: 'la', pos: 'pron_comp', freq: 75 }, { w: 'les', pos: 'pron_comp', freq: 75 },
  { w: 'tout', pos: 'pron', freq: 85 }, { w: 'rien', pos: 'pron', freq: 80 }, { w: 'quelque chose', pos: 'pron', freq: 70 },
  { w: 'quelqu\'un', pos: 'pron', freq: 65 }, { w: 'personne', pos: 'pron', freq: 60 }, { w: 'chacun', pos: 'pron', freq: 50 },
  // Prépositions
  { w: 'à', pos: 'prep', freq: 100 }, { w: 'au', pos: 'prep', g: 'm', n: 's', freq: 95 }, { w: 'aux', pos: 'prep', n: 'p', freq: 85 },
  { w: 'dans', pos: 'prep', freq: 95 }, { w: 'sur', pos: 'prep', freq: 95 }, { w: 'sous', pos: 'prep', freq: 85 },
  { w: 'avec', pos: 'prep', freq: 95 }, { w: 'sans', pos: 'prep', freq: 85 }, { w: 'pour', pos: 'prep', freq: 95 },
  { w: 'par', pos: 'prep', freq: 90 }, { w: 'chez', pos: 'prep', freq: 85 }, { w: 'vers', pos: 'prep', freq: 75 },
  { w: 'entre', pos: 'prep', freq: 75 }, { w: 'contre', pos: 'prep', freq: 70 }, { w: 'depuis', pos: 'prep', freq: 70 },
  { w: 'pendant', pos: 'prep', freq: 75 }, { w: 'avant', pos: 'prep', freq: 80 }, { w: 'après', pos: 'prep', freq: 85 },
  { w: 'devant', pos: 'prep', freq: 75 }, { w: 'derrière', pos: 'prep', freq: 70 }, { w: 'jusqu\'à', pos: 'prep', freq: 60 },
  { w: 'malgré', pos: 'prep', freq: 40 }, { w: 'selon', pos: 'prep', freq: 35 }, { w: 'grâce à', pos: 'prep', freq: 45 },
  { w: 'à côté de', pos: 'prep', freq: 55 }, { w: 'près de', pos: 'prep', freq: 60 }, { w: 'loin de', pos: 'prep', freq: 50 },
  { w: 'au-dessus de', pos: 'prep', freq: 40 }, { w: 'en face de', pos: 'prep', freq: 45 }, { w: 'autour de', pos: 'prep', freq: 45 },
  // Conjonctions
  { w: 'et', pos: 'conj', freq: 100 }, { w: 'ou', pos: 'conj', freq: 95 }, { w: 'mais', pos: 'conj', freq: 95 },
  { w: 'donc', pos: 'conj', freq: 80 }, { w: 'car', pos: 'conj', freq: 70 }, { w: 'ni', pos: 'conj', freq: 50 },
  { w: 'or', pos: 'conj', freq: 30 }, { w: 'parce que', pos: 'conj', freq: 90 }, { w: 'puisque', pos: 'conj', freq: 50 },
  { w: 'comme', pos: 'conj', freq: 90 }, { w: 'quand', pos: 'conj', freq: 90 }, { w: 'lorsque', pos: 'conj', freq: 50 },
  { w: 'si', pos: 'conj', freq: 90 }, { w: 'pendant que', pos: 'conj', freq: 55 }, { w: 'pour que', pos: 'conj', freq: 55 },
  { w: 'alors que', pos: 'conj', freq: 50 }, { w: 'même si', pos: 'conj', freq: 55 }, { w: 'dès que', pos: 'conj', freq: 45 },
  // Interjections & politesse
  { w: 'bonjour', pos: 'interj', freq: 85 }, { w: 'salut', pos: 'interj', freq: 80 }, { w: 'bonsoir', pos: 'interj', freq: 65 },
  { w: 'au revoir', pos: 'interj', freq: 75 }, { w: 'merci', pos: 'interj', freq: 90 }, { w: 'pardon', pos: 'interj', freq: 70 },
  { w: 's\'il te plaît', pos: 'interj', freq: 70 }, { w: 's\'il vous plaît', pos: 'interj', freq: 70 },
  { w: 'bravo', pos: 'interj', freq: 65 }, { w: 'attention', pos: 'interj', freq: 70 }, { w: 'chut', pos: 'interj', freq: 50 },
  { w: 'oh', pos: 'interj', freq: 60 }, { w: 'ah', pos: 'interj', freq: 60 }, { w: 'aïe', pos: 'interj', freq: 50 },
  { w: 'hourra', pos: 'interj', freq: 35 }, { w: 'coucou', pos: 'interj', freq: 55 }, { w: 'allô', pos: 'interj', freq: 50 },
  // Nombres
  { w: 'zéro', pos: 'num', freq: 60 }, { w: 'un', pos: 'num', freq: 95 }, { w: 'deux', pos: 'num', freq: 95 },
  { w: 'trois', pos: 'num', freq: 90 }, { w: 'quatre', pos: 'num', freq: 90 }, { w: 'cinq', pos: 'num', freq: 90 },
  { w: 'six', pos: 'num', freq: 85 }, { w: 'sept', pos: 'num', freq: 85 }, { w: 'huit', pos: 'num', freq: 85 },
  { w: 'neuf', pos: 'num', freq: 85 }, { w: 'dix', pos: 'num', freq: 85 }, { w: 'onze', pos: 'num', freq: 70 },
  { w: 'douze', pos: 'num', freq: 70 }, { w: 'treize', pos: 'num', freq: 65 }, { w: 'quatorze', pos: 'num', freq: 60 },
  { w: 'quinze', pos: 'num', freq: 65 }, { w: 'seize', pos: 'num', freq: 60 }, { w: 'dix-sept', pos: 'num', freq: 55 },
  { w: 'dix-huit', pos: 'num', freq: 55 }, { w: 'dix-neuf', pos: 'num', freq: 55 }, { w: 'vingt', pos: 'num', freq: 75 },
  { w: 'trente', pos: 'num', freq: 70 }, { w: 'quarante', pos: 'num', freq: 65 }, { w: 'cinquante', pos: 'num', freq: 65 },
  { w: 'soixante', pos: 'num', freq: 60 }, { w: 'cent', pos: 'num', freq: 75 }, { w: 'mille', pos: 'num', freq: 70 },
  { w: 'premier', pos: 'num', freq: 75 }, { w: 'deuxième', pos: 'num', freq: 70 }, { w: 'troisième', pos: 'num', freq: 65 },
  // Mots interrogatifs
  { w: 'qui', pos: 'interro', freq: 85 }, { w: 'quand', pos: 'interro', freq: 85 }, { w: 'où', pos: 'interro', freq: 85 },
  { w: 'comment', pos: 'interro', freq: 85 }, { w: 'pourquoi', pos: 'interro', freq: 85 }, { w: 'combien', pos: 'interro', freq: 80 },
  { w: 'est-ce que', pos: 'interro', freq: 80 }, { w: 'qu\'est-ce que', pos: 'interro', freq: 75 },
];

/**
 * Expressions et locutions figées : proposées en un seul bloc.
 * Format : "expression[:emoji]"
 */
export const EXPRESSIONS: [theme: string, freq: number, entries: string][] = [
  ['courant', 4, 'il y a:👉 il était une fois:📖 c\'est-à-dire:💬 tout le monde:👥 quelque chose:📦 quelqu\'un:🧑 n\'importe quoi:🤪 beaucoup de:📈 un peu de:🤏 pas de:🚫 plus de:➕ moins de:➖ à cause de:⚠️ grâce à:🙏 en train de:⏳ être en train de:⏳ avoir envie de:🤩 avoir besoin de:🙏 avoir peur de:😨 avoir mal:🤕 avoir faim:🍽️ avoir soif:🥤 avoir chaud:🥵 avoir froid:🥶 avoir raison:✅ avoir tort:❌ faire attention:⚠️ faire plaisir:🎁 faire semblant:🎭 s\'il te plaît:🙏 tout à coup:💥 tout de suite:⚡ de temps en temps:🔁 en même temps:⏱️ bien sûr:✅ d\'abord:1️⃣ ensuite:2️⃣ enfin:🏁 par exemple:👉 c\'est pourquoi:➡️ au fait:💭 à mon avis:💭 je pense que:💭 je crois que:🤔 je voudrais:🙏 j\'aimerais:🙏 il faut:❗ il ne faut pas:🚫 est-ce que:❓ qu\'est-ce que:❓ parce que:➡️ pendant que:⏳ même si:🤷'],
];
