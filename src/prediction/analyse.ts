/**
 * Analyse du contexte d'écriture : ce que l'enfant vient de taper,
 * ce que la grammaire laisse attendre, et de quoi parle le texte.
 */
import { lexique, type Pos, type Genre, type Nombre } from '../lexique';
import { BIGRAMMES, ASSOCIATIONS, THEMES_NON_TOPIQUES } from '../lexique/contexte';
import { normaliser } from './phonetique';
import { pluriel } from '../lexique/flexion';

export interface Attente {
  /** Poids de chaque classe grammaticale : > 0 attendue, < 0 improbable. */
  poids: Map<Pos, number>;
  /** Poids appliqué aux classes absentes de la table. */
  defaut: number;
  genre?: Genre;
  nombre?: Nombre;
  /** Personne attendue pour un verbe (1 = je … 6 = ils). */
  pers?: number;
  /** Un participe passé est attendu (après un auxiliaire). */
  participe?: boolean;
  /** Un infinitif est attendu (après « je vais », « il faut », « pour »…). */
  infinitif?: boolean;
}

export interface ContexteEcriture {
  /** Texte du mot en cours de frappe. */
  prefixe: string;
  /** Position de départ du mot en cours dans le texte. */
  debutMot: number;
  /**
   * Fenêtres de comparaison pour les expressions de plusieurs mots :
   * le mot en cours seul, puis avec le mot précédent, puis avec les deux.
   */
  fenetres: { debut: number; texte: string }[];
  /** Mot juste avant le curseur (normalisé, apostrophe comprise). */
  precedent: string;
  avantPrecedent: string;
  debutPhrase: boolean;
  /** Poids par thème, calculé sur tout le texte avec un effet de récence. */
  themes: Map<string, number>;
  /** Lemmes déjà employés dans le document. */
  dejaEcrits: Set<string>;
  /** Lemmes des tout derniers mots : on évite de les répéter aussitôt. */
  justeEcrits: Set<string>;
  attente: Attente;
}

function poids(table: Partial<Record<Pos, number>>): Map<Pos, number> {
  return new Map(Object.entries(table) as [Pos, number][]);
}

const DETERMINANTS: Record<string, [Genre, Nombre]> = {
  le: ['m', 's'], la: ['f', 's'], "l'": ['mf', 's'], les: ['mf', 'p'],
  un: ['m', 's'], une: ['f', 's'], des: ['mf', 'p'], du: ['m', 's'],
  ce: ['m', 's'], cet: ['m', 's'], cette: ['f', 's'], ces: ['mf', 'p'],
  mon: ['m', 's'], ma: ['f', 's'], mes: ['mf', 'p'], ton: ['m', 's'], ta: ['f', 's'], tes: ['mf', 'p'],
  son: ['m', 's'], sa: ['f', 's'], ses: ['mf', 'p'], notre: ['mf', 's'], nos: ['mf', 'p'],
  votre: ['mf', 's'], vos: ['mf', 'p'], leur: ['mf', 's'], leurs: ['mf', 'p'],
  quel: ['m', 's'], quelle: ['f', 's'], quels: ['m', 'p'], quelles: ['f', 'p'],
  chaque: ['mf', 's'], plusieurs: ['mf', 'p'], quelques: ['mf', 'p'], aucun: ['m', 's'], aucune: ['f', 's'],
  au: ['m', 's'], aux: ['mf', 'p'],
};

const PRONOMS_SUJETS: Record<string, number> = {
  je: 1, "j'": 1, tu: 2, il: 3, elle: 3, on: 3, "c'": 3, ce: 3, ça: 3, qui: 3,
  nous: 4, vous: 5, ils: 6, elles: 6,
};

const PRONOMS_COMP = new Set(['me', 'te', 'se', "m'", "t'", "s'", 'lui', 'leur', 'y', 'en', 'nous', 'vous', 'le', 'la', 'les', "l'"]);

const PREPOSITIONS = new Set(['a', 'au', 'aux', 'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par', 'chez', 'vers',
  'entre', 'contre', 'depuis', 'pendant', 'avant', 'apres', 'devant', 'derriere', 'de', "d'", 'en']);

const AUXILIAIRES = new Set(['ai', 'as', 'a', 'avons', 'avez', 'ont', 'avais', 'avait', 'avions', 'aviez', 'avaient',
  'suis', 'es', 'est', 'sommes', 'etes', 'sont', 'etais', 'etait', 'etions', 'etiez', 'etaient', 'aurai', 'aura', 'serai', 'sera']);

/** Verbes après lesquels on attend un infinitif. */
const AVANT_INFINITIF = new Set(['vais', 'vas', 'va', 'allons', 'allez', 'vont', 'veux', 'veut', 'voulons', 'voulez', 'veulent',
  'peux', 'peut', 'pouvons', 'pouvez', 'peuvent', 'dois', 'doit', 'devons', 'devez', 'doivent', 'faut', 'sais', 'sait',
  'aime', 'aimes', 'aimons', 'aimez', 'aiment', 'adore', 'adores', 'deteste', 'espere', 'prefere', 'viens', 'vient', 'venons',
  'commence', 'continue', 'arrete', 'essaie', 'oublie', 'ose', 'pour', 'sans', 'faire']);

const ADVERBES_INTENSITE = new Set(['tres', 'trop', 'si', 'plus', 'moins', 'assez', 'aussi', 'bien', 'tellement', 'vraiment', 'peu']);

const PONCTUATION_FIN = /[.!?…]["»)\]]?\s*$/;

function motsDuTexte(texte: string): string[] {
  const trouves = texte.match(/[\p{L}\p{M}'’-]+/gu) ?? [];
  const out: string[] = [];
  for (const t of trouves) {
    // « l'enfant » compte comme deux mots : « l' » et « enfant »
    const parts = t.split(/(?<=[’'])/);
    for (const p of parts) if (p) out.push(normaliser(p));
  }
  return out;
}

// Index inverse des groupes d'associations : le mot et son pluriel y mènent
const GROUPES = new Map<string, number[]>();
for (let i = 0; i < ASSOCIATIONS.length; i++) {
  for (const mot of ASSOCIATIONS[i]) {
    for (const variante of new Set([normaliser(mot), normaliser(pluriel(mot))])) {
      const l = GROUPES.get(variante);
      if (l) { if (!l.includes(i)) l.push(i); } else GROUPES.set(variante, [i]);
    }
  }
}
/** Les mots de chaque groupe d'associations, normalisés. */
export const GROUPES_MOTS = ASSOCIATIONS.map((g) => new Set(g.map(normaliser)));
export function groupesDuMot(motNormalise: string): number[] {
  return GROUPES.get(motNormalise) ?? [];
}

function attenteApres(precedent: string, avantPrecedent: string, debutPhrase: boolean): Attente {
  const det = DETERMINANTS[precedent];
  if (det) {
    return { poids: poids({ nom: 0.8, adj: 0.45, num: 0.25, expr: 0.1 }), defaut: -0.55, genre: det[0], nombre: det[1] };
  }
  if (precedent in PRONOMS_SUJETS) {
    return { poids: poids({ verbe: 0.8, pron_comp: 0.45, adv: 0.2 }), defaut: -0.6, pers: PRONOMS_SUJETS[precedent] };
  }
  if (precedent === 'ne' || precedent === "n'") {
    return { poids: poids({ verbe: 0.8, pron_comp: 0.5 }), defaut: -0.6, pers: PRONOMS_SUJETS[avantPrecedent] };
  }
  if (PRONOMS_COMP.has(precedent)) {
    return { poids: poids({ verbe: 0.75, pron_comp: 0.4, adv: 0.15 }), defaut: -0.5, pers: PRONOMS_SUJETS[avantPrecedent] };
  }
  if (AUXILIAIRES.has(precedent)) {
    return { poids: poids({ verbe: 0.7, adj: 0.3, adv: 0.3, det: 0.35, nom: 0.2, prep: 0.2 }), defaut: -0.35, participe: true };
  }
  if (AVANT_INFINITIF.has(precedent)) {
    return { poids: poids({ verbe: 0.7, det: 0.45, nom: 0.3, adv: 0.3, pron_comp: 0.35, prep: 0.3, adj: 0.15 }), defaut: -0.25, infinitif: true };
  }
  if (PREPOSITIONS.has(precedent)) {
    return {
      poids: poids({ det: 0.65, nom: 0.6, pron: 0.4, verbe: 0.3, adj: 0.3, num: 0.25, expr: 0.15 }),
      defaut: -0.35,
      infinitif: precedent === 'pour' || precedent === 'sans' || precedent === 'de',
    };
  }
  if (ADVERBES_INTENSITE.has(precedent)) {
    // « très », « trop »… appellent un adjectif, accordé avec le nom qui précède
    const lex = lexique();
    const nomAvant = (lex.parNorm.get(avantPrecedent) ?? []).find((c) => c.pos === 'nom');
    return {
      poids: poids({ adj: 0.9, adv: 0.5, det: 0.15, nom: 0.1, verbe: 0.05, num: 0.1 }),
      defaut: -0.35,
      genre: nomAvant?.genre,
      nombre: nomAvant?.nombre,
    };
  }
  if (['et', 'ou', 'mais', 'donc', 'car', 'puis', 'ni', 'or'].includes(precedent)) {
    return { poids: poids({ det: 0.4, nom: 0.35, pron_suj: 0.4, verbe: 0.3, adj: 0.3, adv: 0.3, prep: 0.25, num: 0.2 }), defaut: 0 };
  }
  if (['que', "qu'", 'qui', 'parce', 'quand', 'si', 'comme', 'lorsque', 'puisque'].includes(precedent)) {
    return { poids: poids({ pron_suj: 0.7, det: 0.5, nom: 0.35, verbe: 0.45, adv: 0.25, conj: 0.1 }), defaut: -0.25 };
  }
  if (debutPhrase) {
    return {
      poids: poids({ pron_suj: 0.65, det: 0.6, nom: 0.3, adv: 0.35, expr: 0.4, interj: 0.3, interro: 0.35, prep: 0.25, conj: 0.15, num: 0.15, adj: 0.1, verbe: 0.05 }),
      defaut: -0.3,
    };
  }
  // Après un nom : adjectif, préposition, verbe, conjonction…
  const lex = lexique();
  const candidats = lex.parNorm.get(precedent) ?? [];
  const nom = candidats.find((c) => c.pos === 'nom');
  if (nom && !candidats.some((c) => c.pos === 'det' || c.pos === 'prep')) {
    return {
      poids: poids({ adj: 0.65, prep: 0.5, verbe: 0.4, conj: 0.35, adv: 0.3, pron_rel: 0.35, det: 0.1, nom: 0.1 }),
      defaut: -0.2,
      genre: nom.genre,
      nombre: nom.nombre,
    };
  }
  const adj = candidats.find((c) => c.pos === 'adj');
  if (adj) {
    return { poids: poids({ nom: 0.45, prep: 0.45, conj: 0.4, adv: 0.3, verbe: 0.3, det: 0.2, adj: 0.25 }), defaut: -0.15 };
  }
  return { poids: poids({}), defaut: 0 };
}

/** Analyse le texte autour du curseur. */
export function analyser(texte: string, position: number): ContexteEcriture {
  const avant = texte.slice(0, position);
  const m = avant.match(/[\p{L}\p{M}-]*$/u);
  const prefixe = m ? m[0] : '';
  const debutMot = position - prefixe.length;
  const amont = avant.slice(0, debutMot);
  const mots = motsDuTexte(amont);
  const precedent = mots[mots.length - 1] ?? '';
  const avantPrecedent = mots[mots.length - 2] ?? '';
  const debutPhrase = amont.trim() === '' || PONCTUATION_FIN.test(amont) || /\n\s*$/.test(amont);

  const fenetres = [{ debut: debutMot, texte: prefixe }];
  for (const nb of [1, 2]) {
    const recul = amont.match(new RegExp(`(?:[\\p{L}\\p{M}'’-]+[ ]+){${nb}}$`, 'u'));
    if (recul) {
      const debut = debutMot - recul[0].length;
      fenetres.push({ debut, texte: texte.slice(debut, position) });
    }
  }

  // Poids thématiques : les mots récents comptent davantage
  const lex = lexique();
  const themes = new Map<string, number>();
  const dejaEcrits = new Set<string>();
  const motsTexte = motsDuTexte(texte);
  const scoresGroupes = new Map<number, number>();
  const total = mots.length;
  for (let i = 0; i < motsTexte.length; i++) {
    const mot = motsTexte[i];
    const distance = Math.abs(total - i);
    const poids = 1 / (1 + distance / 10);
    const entrees = lex.parNorm.get(mot);
    if (!entrees) continue;
    const e = entrees[0];
    dejaEcrits.add(e.lemme);
    if (e.pos === 'det' || e.pos === 'prep' || e.pos === 'conj' || e.pos === 'pron' || e.pos === 'pron_suj' || e.pos === 'pron_comp') continue;
    for (const t of e.themes) {
      if (THEMES_NON_TOPIQUES.has(t)) continue;
      themes.set(t, (themes.get(t) ?? 0) + poids);
    }
    for (const g of groupesDuMot(mot)) scoresGroupes.set(g, (scoresGroupes.get(g) ?? 0) + poids);
  }
  // Saturation douce plutôt que normalisation par le maximum : un seul mot
  // du texte ne doit pas suffire à imposer son thème à toutes les propositions.
  for (const [k, v] of themes) themes.set(k, v / (v + 1.6));
  for (const [g, v] of scoresGroupes) themes.set('#' + g, v / (v + 0.9));

  const justeEcrits = new Set<string>();
  for (const mot of mots.slice(-5)) {
    const e = lex.parNorm.get(mot);
    if (e) justeEcrits.add(e[0].lemme);
  }

  return { prefixe, debutMot, fenetres, precedent, avantPrecedent, debutPhrase, themes, dejaEcrits, justeEcrits, attente: attenteApres(precedent, avantPrecedent, debutPhrase) };
}

/** Mots probables après un mot donné, d'après la table de bigrammes. */
export function suitesProbables(precedent: string): Map<string, number> {
  const out = new Map<string, number>();
  const liste = BIGRAMMES[precedent];
  if (!liste) return out;
  const mots = liste.split(' ');
  mots.forEach((mot, i) => {
    const k = normaliser(mot);
    out.set(k, Math.max(out.get(k) ?? 0, 1 - i / (mots.length + 2)));
  });
  return out;
}
