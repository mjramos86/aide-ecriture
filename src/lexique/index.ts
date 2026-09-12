/**
 * Construction de l'index de formes fléchies à partir des données compactes.
 * Tout est calculé une seule fois, au démarrage, côté navigateur.
 */
import { NOMS } from './noms';
import { VERBES } from './verbes';
import { ADJECTIFS, ADJ_IRREG, ADVERBES, MOTS_OUTILS, EXPRESSIONS } from './mots';
import { PARENTS_THEMES } from './contexte';
import { pluriel, feminin, plurielAdj, conjuguer, type Temps } from './flexion';
import { normaliser, phonetiser } from '../prediction/phonetique';
import { coefficientFrequence } from './frequents';

export type Pos = 'nom' | 'verbe' | 'adj' | 'adv' | 'det' | 'pron' | 'pron_suj' | 'pron_comp' | 'pron_rel' | 'prep' | 'conj' | 'interj' | 'num' | 'interro' | 'expr';
export type Genre = 'm' | 'f' | 'mf';
export type Nombre = 's' | 'p' | 'sp';

export interface MotForme {
  /** Forme écrite, telle qu'elle sera inséree dans le texte. */
  forme: string;
  /** Mot de base (utile pour l'illustration et les statistiques). */
  lemme: string;
  pos: Pos;
  genre?: Genre;
  nombre?: Nombre;
  /** 1 à 6 pour les verbes conjugués (je, tu, il, nous, vous, ils). */
  pers?: number;
  temps?: Temps;
  freq: number;
  themes: string[];
  emoji?: string;
  /** L'emoji représente vraiment ce mot-là (et non son thème, faute de mieux). */
  emojiPropre?: boolean;
  norm: string;
  phon: string;
}

/** Illustration de repli quand le mot n'a pas d'emoji propre. */
export const EMOJI_THEME: Record<string, string> = {
  fruit: '🍎', légume: '🥕', nourriture: '🍽️', boisson: '🥤', repas: '🍽️', animal: '🐾',
  famille: '👪', personne: '🧑', métier: '🧰', corps: '🧍', santé: '💊', émotion: '💗',
  école: '🏫', matière: '📚', nombre: '🔢', forme: '⬜', maison: '🏠', meuble: '🪑',
  objet: '📦', nature: '🌿', météo: '🌤️', espace: '🚀', saison: '📅', ville: '🏙️',
  transport: '🚗', vêtement: '👕', jeu: '🎮', sport: '⚽', musique: '🎵', art: '🎨',
  idée: '💡', sortie: '🚪', base: '⚙️', action: '🏃', temps: '⏰', lieu: '📍',
  manière: '👌', quantité: '📊', logique: '🔗', couleur: '🎨', taille: '📏',
  qualité: '⭐', état: '🙂', courant: '💬', travail: '💼', loisir: '🎉', voyage: '🧳',
  lecture: '📖', jardin: '🌱', composé: '⚙️', re: '⚙️',
};

/**
 * Découpe une liste d'entrées séparées par des espaces, en recollant les
 * entrées de plusieurs mots : « petit pois:m:🫛 » ou « il y a:👉 ».
 * Repère : les champs d'une entrée commencent au premier « : ».
 */
function decouper(entries: string): string[] {
  const out: string[] = [];
  let tampon = '';
  for (const t of entries.split(/\s+/)) {
    if (!t) continue;
    tampon = tampon ? tampon + ' ' + t : t;
    if (t.includes(':')) { out.push(tampon); tampon = ''; }
  }
  if (tampon) out.push(tampon);
  return out;
}

function themesAvecParents(theme: string): string[] {
  const vus = new Set<string>();
  const pile = [theme];
  while (pile.length) {
    const t = pile.pop()!;
    if (vus.has(t)) continue;
    vus.add(t);
    for (const p of PARENTS_THEMES[t] ?? []) pile.push(p);
  }
  return [...vus];
}

const cacheThemes = new Map<string, string[]>();
function themes(t: string): string[] {
  let v = cacheThemes.get(t);
  if (!v) { v = themesAvecParents(t); cacheThemes.set(t, v); }
  return v;
}

/**
 * Thèmes dont les mots ne se laissent pas illustrer par un emoji :
 * un pictogramme dessiné dit « avant », « peur » ou « parce que »
 * beaucoup mieux qu'un symbole détourné.
 */
const THEMES_ABSTRAITS = new Set([
  'idée', 'émotion', 'logique', 'quantité', 'manière', 'qualité', 'état',
  'temps', 'courant', 'outil', 'nombre', 'santé',
]);

/** Ce mot gagnerait à être illustré par un pictogramme plutôt qu'un emoji. */
export function estAbstrait(m: MotForme): boolean {
  if (!m.emojiPropre) return true;
  return m.themes.some((t) => THEMES_ABSTRAITS.has(t));
}

function creer(forme: string, lemme: string, pos: Pos, freq: number, th: string[], emoji: string | undefined, extra: Partial<MotForme> = {}): MotForme {
  const ajustee = freq * coefficientFrequence(lemme);
  return { forme, lemme, pos, freq: Math.max(1, Math.round(ajustee)), themes: th, emoji, norm: normaliser(forme), phon: phonetiser(forme), ...extra };
}

/** Poids relatif des temps : le présent et l'infinitif priment. */
const POIDS_TEMPS: Record<Temps, number> = {
  pres: 1, inf: 0.92, pp: 0.8, imparfait: 0.62, futur: 0.6, cond: 0.34, imperatif: 0.4, ppr: 0.28,
};
/** Poids relatif des personnes : « je » et « il » dominent dans les récits d'enfants. */
const POIDS_PERS = [1, 0.75, 1, 0.6, 0.55, 0.8];

function construire(): MotForme[] {
  const out: MotForme[] = [];

  // Noms
  for (const [theme, freqGroupe, entries] of NOMS) {
    const th = themes(theme);
    const base = freqGroupe * 14;
    for (const brut of decouper(entries)) {
      if (!brut.trim()) continue;
      const [mot, genre = 'm', emoji, plurielForce] = brut.split(':');
      if (!mot) continue;
      const motPropre = mot.replace(/_/g, ' ');
      const ill = emoji || EMOJI_THEME[theme];
      const propre = Boolean(emoji);
      const genreT = (genre || 'm') as Genre;
      out.push(creer(motPropre, motPropre, 'nom', base, th, ill, { genre: genreT, nombre: 's', emojiPropre: propre }));
      const pl = plurielForce !== undefined && plurielForce !== '' ? plurielForce : pluriel(motPropre);
      out.push(creer(pl, motPropre, 'nom', base * (pl === motPropre ? 0.8 : 0.85), th, ill, { genre: genreT, nombre: 'p', emojiPropre: propre }));
    }
  }

  // Adjectifs
  for (const [theme, freqGroupe, entries] of ADJECTIFS) {
    const th = themes(theme);
    const base = freqGroupe * 12;
    for (const brut of decouper(entries)) {
      if (!brut.trim()) continue;
      const [mot, femForce, emoji] = brut.split(':');
      if (!mot) continue;
      const ill = emoji || EMOJI_THEME[theme];
      const propre = Boolean(emoji);
      const fs = femForce || feminin(mot);
      const mp = plurielAdj(mot);
      const fp = ADJ_IRREG[mot] ? ADJ_IRREG[mot][2] : plurielAdj(fs, true);
      out.push(creer(mot, mot, 'adj', base, th, ill, { ...{ genre: 'm', nombre: 's' }, emojiPropre: propre }));
      out.push(creer(fs, mot, 'adj', base * 0.9, th, ill, { ...{ genre: 'f', nombre: 's' }, emojiPropre: propre }));
      out.push(creer(mp, mot, 'adj', base * 0.78, th, ill, { ...{ genre: 'm', nombre: 'p' }, emojiPropre: propre }));
      out.push(creer(fp, mot, 'adj', base * 0.72, th, ill, { ...{ genre: 'f', nombre: 'p' }, emojiPropre: propre }));
      const irr = ADJ_IRREG[mot];
      if (irr && irr[3]) out.push(creer(irr[3], mot, 'adj', base * 0.6, th, ill, { genre: 'm', nombre: 's', emojiPropre: propre }));
    }
  }

  // Verbes
  const vus = new Set<string>();
  for (const [theme, freqGroupe, entries] of VERBES) {
    const th = themes(theme);
    const base = freqGroupe * 13;
    for (const brut of decouper(entries)) {
      if (!brut.trim()) continue;
      const [infBrut, groupeS, emoji] = brut.split(':');
      if (!infBrut) continue;
      const inf = infBrut.replace(/_/g, ' ');
      if (vus.has(inf)) continue;
      vus.add(inf);
      const ill = emoji || EMOJI_THEME[theme] || '🏃';
      const groupe = Number(groupeS) || 1;
      for (const f of conjuguer(inf, groupe)) {
        const poids = POIDS_TEMPS[f.temps] * (f.pers ? POIDS_PERS[f.pers - 1] : 1);
        out.push(creer(f.forme, inf, 'verbe', base * poids, th, ill, { temps: f.temps, pers: f.pers, emojiPropre: Boolean(emoji) }));
      }
    }
  }

  // Adverbes
  for (const [theme, freqGroupe, entries] of ADVERBES) {
    const th = themes(theme);
    const base = freqGroupe * 13;
    for (const brut of decouper(entries)) {
      if (!brut.trim()) continue;
      const [mot, emoji] = brut.split(':');
      if (!mot) continue;
      out.push(creer(mot.replace(/_/g, ' '), mot, 'adv', base, th, emoji || EMOJI_THEME[theme], { emojiPropre: Boolean(emoji) }));
    }
  }

  // Mots-outils
  for (const m of MOTS_OUTILS) {
    out.push(creer(m.w, m.w, m.pos as Pos, m.freq * 1.6, ['outil'], undefined, { genre: m.g, nombre: m.n, pers: m.pers }));
  }

  // Expressions
  for (const [theme, freqGroupe, entries] of EXPRESSIONS) {
    const th = themes(theme);
    for (const brut of decouper(entries)) {
      if (!brut.trim()) continue;
      const [mot, emoji] = brut.split(':');
      if (!mot) continue;
      const expr = mot.replace(/_/g, ' ');
      out.push(creer(expr, expr, 'expr', freqGroupe * 11, th, emoji || '💬', { emojiPropre: Boolean(emoji) }));
    }
  }

  return out;
}

export interface IndexLexical {
  formes: MotForme[];
  /** Nombre de lemmes distincts par thème (sert à mesurer la précision d'un thème). */
  tailleThemes: Map<string, number>;
  /** formes regroupées par première lettre normalisée */
  parLettre: Map<string, MotForme[]>;
  /** formes regroupées par premier son */
  parSon: Map<string, MotForme[]>;
  /** recherche exacte d'une forme normalisée */
  parNorm: Map<string, MotForme[]>;
  /** formes composées de plusieurs mots (« il y a », « pomme de terre ») */
  multiMots: MotForme[];
  /** emoji du lemme, pour illustrer les mots appris */
  emojiParLemme: Map<string, string>;
}

let cache: IndexLexical | null = null;

function pousser(map: Map<string, MotForme[]>, cle: string, m: MotForme) {
  const liste = map.get(cle);
  if (liste) liste.push(m);
  else map.set(cle, [m]);
}

export function lexique(): IndexLexical {
  if (cache) return cache;
  const brut = construire();
  // Déduplication : on garde la variante la plus fréquente de chaque forme
  const map = new Map<string, MotForme>();
  for (const m of brut) {
    const k = [m.forme, m.pos, m.pers ?? '', m.temps ?? '', m.genre ?? '', m.nombre ?? ''].join('#');
    const prec = map.get(k);
    if (!prec || prec.freq < m.freq) map.set(k, m);
  }
  const formes = [...map.values()];
  const parLettre = new Map<string, MotForme[]>();
  const parSon = new Map<string, MotForme[]>();
  const parNorm = new Map<string, MotForme[]>();
  const emojiParLemme = new Map<string, string>();
  const lemmesParTheme = new Map<string, Set<string>>();
  for (const m of formes) {
    for (const t of m.themes) {
      const s = lemmesParTheme.get(t);
      if (s) s.add(m.lemme); else lemmesParTheme.set(t, new Set([m.lemme]));
    }
    pousser(parLettre, m.norm[0] ?? '', m);
    pousser(parSon, m.phon[0] ?? '', m);
    pousser(parNorm, m.norm, m);
    if (m.emoji && !emojiParLemme.has(m.lemme)) emojiParLemme.set(m.lemme, m.emoji);
  }
  const multiMots = formes.filter((m) => m.forme.includes(' '));
  const tailleThemes = new Map<string, number>();
  for (const [t, l] of lemmesParTheme) tailleThemes.set(t, l.size);
  cache = { formes, tailleThemes, parLettre, parSon, parNorm, multiMots, emojiParLemme };
  return cache;
}

/**
 * Lemmes qui méritent un pictogramme, du plus fréquent au moins fréquent.
 * C'est cette liste que le script `npm run pictogrammes` va chercher chez ARASAAC.
 */
export function motsAIllustrer(): string[] {
  const parLemme = new Map<string, number>();
  for (const m of lexique().formes) {
    if (!estAbstrait(m)) continue;
    parLemme.set(m.lemme, Math.max(parLemme.get(m.lemme) ?? 0, m.freq));
  }
  return [...parLemme.entries()].sort((a, b) => b[1] - a[1]).map(([lemme]) => lemme);
}

/**
 * Précision d'un thème, entre 0,3 et 1 : « fruit » (une trentaine de mots)
 * est un indice bien plus parlant que « objet » (plusieurs centaines).
 */
export function specificite(theme: string): number {
  if (theme.startsWith('#')) return 1; // groupe d'associations : déjà très précis
  const taille = lexique().tailleThemes.get(theme) ?? 50;
  return Math.min(1, Math.max(0.3, 2.6 / Math.log2(8 + taille)));
}
