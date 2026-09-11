/**
 * Verbes du vocabulaire courant de l\'enfant.
 *
 * Format : "infinitif:groupe[:emoji]"
 * Groupes de conjugaison (voir flexion.ts) :
 *   1 = premier groupe (-er, avec ses variantes orthographiques)
 *   2 = deuxième groupe (finir / finissons)
 *   4 = type « partir » (je pars, nous partons)
 *   5 = type « ouvrir » (j\'ouvre, nous ouvrons)
 *   6 = type « attendre » (j\'attends, il attend, nous attendons)
 *   9 = irrégulier : formes données dans IRREGULIERS
 */
export const VERBES: [theme: string, freq: number, entries: string][] = [
  ['base', 5, 'être:9 avoir:9 aller:9:🚶 faire:9:🔨 dire:9:💬 pouvoir:9 vouloir:9:🙏 savoir:9:🧠 voir:9:👁️ venir:9:🚶 prendre:9:✋ mettre:9:📥 devoir:9 falloir:9 croire:9:🤔 paraître:9 connaître:9:🤝 tenir:9:✊ valoir:9 vivre:9:🌱 suivre:9:👣 écrire:9:✍️ lire:9:📖 boire:9:🥤 rire:9:😂 sourire:9:😊 plaire:9:😍 recevoir:9:📥 apercevoir:9:👀 conduire:9:🚗 construire:9:🏗️ produire:9:🏭 traduire:9:🔤 détruire:9:💥 peindre:9:🎨 éteindre:9:💡 atteindre:9:🎯 craindre:9:😨 joindre:9:🔗 résoudre:9:💡 coudre:9:🪡 moudre:9:🌾 naître:9:👶 mourir:9:🪦 courir:9:🏃 cueillir:5:🌸 s\'asseoir:9:🪑 asseoir:9:🪑'],
  ['composé', 4, 'devenir:9 revenir:9 tenir:9 obtenir:9 retenir:9 appartenir:9 comprendre:9:🧠 apprendre:9:📚 surprendre:9:😲 reprendre:9 entreprendre:9 promettre:9:🤝 permettre:9 remettre:9 admettre:9 transmettre:9 défaire:9 refaire:9 satisfaire:9 revoir:9 prévoir:9 décrire:9 inscrire:9 relire:9 redire:9 contredire:9 sortir:4:🚪 partir:4:🚶 dormir:4:😴 sentir:4:👃 servir:4:🍽️ mentir:4:🤥 repartir:4 endormir:4:😴 ressentir:4 desservir:4 ouvrir:5:🚪 offrir:5:🎁 couvrir:5:🛏️ découvrir:5:🔍 souffrir:5:😖 rouvrir:5'],
  ['re', 4, 'attendre:6:⏳ entendre:6:👂 descendre:6:⬇️ rendre:6:🔄 répondre:6:💬 perdre:6:😞 vendre:6:🛍️ mordre:6:🦷 tordre:6 fondre:6:🫠 défendre:6:🛡️ dépendre:6 tendre:6 prétendre:6 confondre:6 correspondre:6 interrompre:6'],
  ['action', 5, 'parler:1:💬 demander:1:🙋 donner:1:🎁 aimer:1:❤️ adorer:1:😍 détester:1:😖 penser:1:💭 trouver:1:🔍 chercher:1:🔍 regarder:1:👀 écouter:1:👂 travailler:1:💼 jouer:1:🎮 manger:1:🍽️ goûter:1:👅 boire:9:🥤 dormir:4:😴 rêver:1:💭 marcher:1:🚶 courir:9:🏃 sauter:1:🦘 grimper:1:🧗 tomber:1:🤕 glisser:1:🛝 danser:1:💃 chanter:1:🎤 dessiner:1:✏️ colorier:1:🖍️ peindre:9:🎨 découper:1:✂️ coller:1:🩹 plier:1:📄 fabriquer:1:🔨 construire:9:🏗️ réparer:1:🔧 casser:1:💥 abîmer:1:💔 salir:2:🧽 laver:1:🧼 nettoyer:1:🧹 ranger:1:📦 préparer:1:🍳 cuisiner:1:👨‍🍳 acheter:1:🛒 payer:1:💶 vendre:6:🛍️ porter:1:🎒 apporter:1:📦 emporter:1:📦 poser:1:📥 lancer:1:🏐 attraper:1:🤲 pousser:1:👐 tirer:1:💪 lever:1:⬆️ baisser:1:⬇️ ouvrir:5:🚪 fermer:1:🚪 allumer:1:💡 éteindre:9:🌑 appuyer:1:👆 toucher:1:✋ tenir:9:✊ lâcher:1:🖐️ jeter:1:🗑️ ramasser:1:🤲 cacher:1:🙈 montrer:1:👉 dire:9:💬 raconter:1:📖 expliquer:1:🧑‍🏫 répéter:1:🔁 crier:1:📢 pleurer:1:😢 rire:9:😂 sourire:9:😊 embrasser:1:😘 câliner:1:🤗 aider:1:🤝 partager:1:🤝 prêter:1:🤝 offrir:5:🎁 remercier:1:🙏 saluer:1:👋 rencontrer:1:🤝 inviter:1:💌 visiter:1:👀 voyager:1:🧳 arriver:1:🛬 partir:4:🛫 rentrer:1:🏠 revenir:9:🔄 monter:1:⬆️ descendre:6:⬇️ entrer:1:🚪 sortir:4:🚪 rester:1:🪑 avancer:1:➡️ reculer:1:⬅️ tourner:1:🔄 traverser:1:🚸 continuer:1:➡️ arrêter:1:🛑 commencer:1:▶️ finir:2:🏁 terminer:1:🏁 réussir:2:🏆 gagner:1:🏆 perdre:6:😞 essayer:1:💪 réfléchir:2:🤔 comprendre:9:🧠 apprendre:9:📚 étudier:1:📚 lire:9:📖 écrire:9:✍️ compter:1:🔢 calculer:1:➕ mesurer:1:📏 dessiner:1:🎨 choisir:2:👉 décider:1:⚖️ oublier:1:🤷 rappeler:1:🔔 souvenir:9:🧠 imaginer:1:🌈 inventer:1:💡 deviner:1:🔮 vérifier:1:✅ corriger:1:✔️ recommencer:1:🔁 changer:1:🔄 grandir:2:📈 grossir:2:📈 maigrir:2:📉 vieillir:2:👴 rougir:2:😳 remplir:2:🫗 vider:2:🫗 obéir:2:🙇 punir:2:😤 avertir:2:⚠️ guérir:2:💊 nourrir:2:🍽️ bâtir:2:🏗️ ralentir:2:🐢 applaudir:2:👏 réunir:2:👥 saisir:2:✊ franchir:2:🚧 fleurir:2:🌸 pâlir:2:😰 durer:1:⏳ attendre:6:⏳ dépêcher:1:🏃 ranger:1:🗂️ installer:1:🔧 chercher:1:🔍 espérer:1:🤞 promettre:9:🤝 accepter:1:👍 refuser:1:👎 oser:1:😬 réveiller:1:⏰ coucher:1:🛏️ habiller:1:👕 déshabiller:1:👕 laver:1:🚿 brosser:1:🪥 peigner:1:💇 soigner:1:🩹 protéger:1:🛡️ garder:1:👁️ surveiller:1:👀 appeler:1:📞 téléphoner:1:📞 envoyer:1:📤 recevoir:9:📥 emprunter:1:🤲 rendre:6:🔄 remplacer:1:🔄 ajouter:1:➕ enlever:1:➖ couper:1:✂️ verser:1:🫗 mélanger:1:🥄 cuire:9:🍳 chauffer:1:🔥 refroidir:2:❄️ geler:1:🧊 fondre:6:🫠 souffler:1:💨 respirer:1:🫁 sentir:4:👃 écouter:1:🎧 observer:1:🔬 remarquer:1:👀 apercevoir:9:👀 briller:1:✨ voler:1:🕊️ nager:1:🏊 plonger:1:🤿 pêcher:1:🎣 chasser:1:🏹 cultiver:1:🌱 planter:1:🌱 arroser:1:💧 cueillir:5:🌸 récolter:1:🌾 semer:1:🌾 creuser:1:🪏 balayer:1:🧹 essuyer:1:🧻 plier:1:📄 tricoter:1:🧶 coudre:9:🪡 bricoler:1:🔨 filmer:1:🎬 photographier:1:📷 dessiner:1:✏️ imprimer:1:🖨️ taper:1:⌨️ cliquer:1:🖱️ enregistrer:1:💾 effacer:1:🧽 souligner:1:📏 barrer:1:✖️ recopier:1:✍️ copier:1:📋 signer:1:🖋️ colorier:1:🌈 accrocher:1:🪝 attacher:1:🔗 détacher:1:🔓 nouer:1:🪢 serrer:1:🤏 presser:1:👇 frapper:1:👊 taper:1:👊 battre:9:🥊 pousser:1:🫸 bousculer:1:💥 embêter:1:😤 gêner:1:😖 déranger:1:🚫 se moquer:1:😜 gronder:1:😠 disputer:1:😠 se fâcher:1:😡 pardonner:1:🕊️ calmer:1:😌 consoler:1:🤗 encourager:1:📣 féliciter:1:🎉 gagner:1:🥇 participer:1:🙋 s\'entraîner:1:💪 s\'amuser:1:🎉 s\'ennuyer:1:😑 se reposer:1:😴 se dépêcher:1:⏰ se cacher:1:🙈 se perdre:6:🗺️ se promener:1:🚶 se baigner:1:🏊 se souvenir:9:🧠 se lever:1:⬆️ se coucher:1:🛏️ se laver:1:🚿 s\'habiller:1:👕 s\'asseoir:9:🪑 se taire:9:🤫 devenir:9:🔄 sembler:1:🤔 paraître:9:🤔 ressembler:1:👯 exister:1:🌍 appartenir:9:🔑 contenir:9:📦 utiliser:1:🛠️ servir:4:🍽️ marcher:1:⚙️ fonctionner:1:⚙️ bouger:1:🕺 remuer:1:🥄 secouer:1:🫨 trembler:1:🥶 frissonner:1:🥶 tousser:1:😷 éternuer:1:🤧 bâiller:1:🥱 saigner:1:🩸 guérir:2:💚 tuer:1:💀 naître:9:👶 mourir:9:🪦'],
];

/**
 * Verbes irréguliers (groupe 9).
 *   p  : les 6 formes du présent (je, tu, il, nous, vous, ils)
 *   ra : radical du futur / conditionnel (on y ajoute -ai, -as, -a, -ons, -ez, -ont)
 *   pp : participe passé (masculin singulier)
 *   ri : radical de l\'imparfait (par défaut : forme « nous » du présent sans -ons)
 *   aux: auxiliaire du passé composé ('e' pour être, 'a' par défaut)
 */
export interface FormesIrreg { p: string[]; ra: string; pp: string; ri?: string; aux?: 'a' | 'e'; imp?: string[] }
export const IRREGULIERS: Record<string, FormesIrreg> = {
  être: { p: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], ra: 'ser', pp: 'été', ri: 'ét', aux: 'e', imp: ['sois', 'soyons', 'soyez'] },
  avoir: { p: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], ra: 'aur', pp: 'eu', imp: ['aie', 'ayons', 'ayez'] },
  aller: { p: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], ra: 'ir', pp: 'allé', aux: 'e', imp: ['va', 'allons', 'allez'] },
  faire: { p: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], ra: 'fer', pp: 'fait' },
  dire: { p: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], ra: 'dir', pp: 'dit' },
  pouvoir: { p: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], ra: 'pourr', pp: 'pu' },
  vouloir: { p: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], ra: 'voudr', pp: 'voulu', imp: ['veuille', 'voulons', 'veuillez'] },
  savoir: { p: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], ra: 'saur', pp: 'su', imp: ['sache', 'sachons', 'sachez'] },
  voir: { p: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], ra: 'verr', pp: 'vu' },
  venir: { p: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], ra: 'viendr', pp: 'venu', aux: 'e' },
  prendre: { p: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], ra: 'prendr', pp: 'pris' },
  mettre: { p: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], ra: 'mettr', pp: 'mis' },
  devoir: { p: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], ra: 'devr', pp: 'dû' },
  falloir: { p: ['', '', 'faut', '', '', ''], ra: 'faudr', pp: 'fallu', ri: 'fall' },
  croire: { p: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], ra: 'croir', pp: 'cru' },
  paraître: { p: ['parais', 'parais', 'paraît', 'paraissons', 'paraissez', 'paraissent'], ra: 'paraîtr', pp: 'paru' },
  connaître: { p: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'], ra: 'connaîtr', pp: 'connu' },
  tenir: { p: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'], ra: 'tiendr', pp: 'tenu' },
  valoir: { p: ['vaux', 'vaux', 'vaut', 'valons', 'valez', 'valent'], ra: 'vaudr', pp: 'valu' },
  vivre: { p: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'], ra: 'vivr', pp: 'vécu' },
  suivre: { p: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'], ra: 'suivr', pp: 'suivi' },
  écrire: { p: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], ra: 'écrir', pp: 'écrit' },
  lire: { p: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], ra: 'lir', pp: 'lu' },
  boire: { p: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], ra: 'boir', pp: 'bu' },
  rire: { p: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'], ra: 'rir', pp: 'ri' },
  sourire: { p: ['souris', 'souris', 'sourit', 'sourions', 'souriez', 'sourient'], ra: 'sourir', pp: 'souri' },
  plaire: { p: ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent'], ra: 'plair', pp: 'plu' },
  taire: { p: ['tais', 'tais', 'tait', 'taisons', 'taisez', 'taisent'], ra: 'tair', pp: 'tu' },
  recevoir: { p: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'], ra: 'recevr', pp: 'reçu' },
  apercevoir: { p: ['aperçois', 'aperçois', 'aperçoit', 'apercevons', 'apercevez', 'aperçoivent'], ra: 'apercevr', pp: 'aperçu' },
  conduire: { p: ['conduis', 'conduis', 'conduit', 'conduisons', 'conduisez', 'conduisent'], ra: 'conduir', pp: 'conduit' },
  construire: { p: ['construis', 'construis', 'construit', 'construisons', 'construisez', 'construisent'], ra: 'construir', pp: 'construit' },
  produire: { p: ['produis', 'produis', 'produit', 'produisons', 'produisez', 'produisent'], ra: 'produir', pp: 'produit' },
  traduire: { p: ['traduis', 'traduis', 'traduit', 'traduisons', 'traduisez', 'traduisent'], ra: 'traduir', pp: 'traduit' },
  détruire: { p: ['détruis', 'détruis', 'détruit', 'détruisons', 'détruisez', 'détruisent'], ra: 'détruir', pp: 'détruit' },
  cuire: { p: ['cuis', 'cuis', 'cuit', 'cuisons', 'cuisez', 'cuisent'], ra: 'cuir', pp: 'cuit' },
  peindre: { p: ['peins', 'peins', 'peint', 'peignons', 'peignez', 'peignent'], ra: 'peindr', pp: 'peint' },
  éteindre: { p: ['éteins', 'éteins', 'éteint', 'éteignons', 'éteignez', 'éteignent'], ra: 'éteindr', pp: 'éteint' },
  atteindre: { p: ['atteins', 'atteins', 'atteint', 'atteignons', 'atteignez', 'atteignent'], ra: 'atteindr', pp: 'atteint' },
  craindre: { p: ['crains', 'crains', 'craint', 'craignons', 'craignez', 'craignent'], ra: 'craindr', pp: 'craint' },
  joindre: { p: ['joins', 'joins', 'joint', 'joignons', 'joignez', 'joignent'], ra: 'joindr', pp: 'joint' },
  résoudre: { p: ['résous', 'résous', 'résout', 'résolvons', 'résolvez', 'résolvent'], ra: 'résoudr', pp: 'résolu' },
  coudre: { p: ['couds', 'couds', 'coud', 'cousons', 'cousez', 'cousent'], ra: 'coudr', pp: 'cousu' },
  moudre: { p: ['mouds', 'mouds', 'moud', 'moulons', 'moulez', 'moulent'], ra: 'moudr', pp: 'moulu' },
  naître: { p: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'], ra: 'naîtr', pp: 'né', aux: 'e' },
  mourir: { p: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'], ra: 'mourr', pp: 'mort', aux: 'e' },
  courir: { p: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'], ra: 'courr', pp: 'couru' },
  battre: { p: ['bats', 'bats', 'bat', 'battons', 'battez', 'battent'], ra: 'battr', pp: 'battu' },
  asseoir: { p: ['assieds', 'assieds', 'assied', 'asseyons', 'asseyez', 'asseyent'], ra: 'assiér', pp: 'assis' },
  souvenir: { p: ['souviens', 'souviens', 'souvient', 'souvenons', 'souvenez', 'souviennent'], ra: 'souviendr', pp: 'souvenu', aux: 'e' },
};

/** Verbes construits sur un verbe irrégulier : on réutilise le modèle avec un préfixe. */
export const DERIVES: Record<string, [base: string, prefixe: string]> = {
  devenir: ['venir', 'de'], revenir: ['venir', 're'], obtenir: ['tenir', 'ob'], retenir: ['tenir', 're'],
  appartenir: ['tenir', 'appar'], contenir: ['tenir', 'con'], maintenir: ['tenir', 'main'],
  comprendre: ['prendre', 'com'], apprendre: ['prendre', 'ap'], surprendre: ['prendre', 'sur'],
  reprendre: ['prendre', 're'], entreprendre: ['prendre', 'entre'],
  promettre: ['mettre', 'pro'], permettre: ['mettre', 'per'], remettre: ['mettre', 're'],
  admettre: ['mettre', 'ad'], transmettre: ['mettre', 'trans'],
  défaire: ['faire', 'dé'], refaire: ['faire', 're'], satisfaire: ['faire', 'satis'],
  revoir: ['voir', 're'], prévoir: ['voir', 'pré'],
  décrire: ['écrire', 'd'], inscrire: ['écrire', 'ins'], relire: ['lire', 're'],
  redire: ['dire', 're'], contredire: ['dire', 'contre'],
};
