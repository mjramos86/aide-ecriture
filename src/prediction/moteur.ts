/**
 * Moteur de prédiction : classe les mots possibles à partir des lettres tapées
 * et de tout ce que le contexte apprend (sens de la phrase, thème du texte,
 * grammaire, habitudes de l'enfant).
 */
import { lexique, specificite, estAbstrait, type MotForme, EMOJI_THEME } from '../lexique';
import { analyser, suitesProbables, groupesDuMot, type ContexteEcriture, type Attente } from './analyse';
import { THEMES_NON_TOPIQUES } from '../lexique/contexte';
import { normaliser, phonetiser, similaritePrefixe, sontConfondues } from './phonetique';
import { poidsUsage, suitesApprises, formesPersonnelles } from './perso';

export interface Proposition {
  /** Mot affiché dans la liste (avec la majuscule éventuelle). */
  forme: string;
  /** Texte réellement inséré dans le document. */
  insertion: string;
  emoji: string;
  lemme: string;
  score: number;
  /** Explication courte : pourquoi ce mot est proposé. */
  raison: string;
  /** Le mot ne commence pas exactement par ce qui a été tapé (aide phonétique). */
  approche: boolean;
  /** Position à partir de laquelle remplacer le texte (utile aux expressions). */
  debut: number;
  /** Mot difficile à illustrer par un emoji : un pictogramme sera plus clair. */
  abstrait: boolean;
}

export interface OptionsPrediction {
  nombre: number;
  minCaracteres: number;
  motSuivant: boolean;
  tolerance: boolean;
}

export const OPTIONS_DEFAUT: OptionsPrediction = { nombre: 6, minCaracteres: 1, motSuivant: true, tolerance: true };

const LETTRES_PROCHES: Record<string, string[]> = {};
for (const a of 'abcdefghijklmnopqrstuvwxyz') {
  const proches = [...'abcdefghijklmnopqrstuvwxyz'].filter((b) => b !== a && sontConfondues(a, b));
  if (proches.length) LETTRES_PROCHES[a] = proches;
}

function accordGrammatical(m: MotForme, a: Attente): number {
  let s = a.poids.get(m.pos) ?? a.defaut;
  const variable = m.pos === 'nom' || m.pos === 'adj';
  if (variable && a.genre && a.genre !== 'mf' && m.genre && m.genre !== 'mf') s += m.genre === a.genre ? 0.22 : -0.5;
  if (variable && a.nombre && a.nombre !== 'sp' && m.nombre && m.nombre !== 'sp') s += m.nombre === a.nombre ? 0.32 : -0.55;
  if (m.pos === 'verbe') {
    if (a.infinitif) s += m.temps === 'inf' ? 0.5 : -0.2;
    else if (a.participe) s += m.temps === 'pp' ? 0.5 : -0.25;
    else if (a.pers) {
      if (m.temps === 'inf') s -= 0.15;
      else if (m.pers === a.pers) s += 0.5;
      else if (m.pers) s -= 0.5;
    }
  }
  return s;
}

function scoreThematique(m: MotForme, ctx: ContexteEcriture): number {
  if (ctx.themes.size === 0) return 0;
  let meilleur = 0;
  for (const t of m.themes) {
    if (THEMES_NON_TOPIQUES.has(t)) continue;
    const v = ctx.themes.get(t);
    if (v) meilleur = Math.max(meilleur, v * specificite(t));
  }
  // Groupes d'associations : « fraise » va avec « fruits », « panier », « confiture »…
  // Indice bien plus précis qu'un thème large, donc mieux récompensé.
  for (const g of [...groupesDuMot(normaliser(m.lemme)), ...groupesDuMot(m.norm)]) {
    const v = ctx.themes.get('#' + g);
    if (v) meilleur = Math.max(meilleur, v * 1.5);
  }
  return Math.min(1.5, meilleur);
}

function majuscule(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const FREQ_MAX = Math.log1p(170);

interface Candidat { m: MotForme; qualite: number; approche: boolean; debut?: number }

function rassembler(prefixeNorm: string, prefixeBrut: string, options: OptionsPrediction, fenetres: { debut: number; texte: string }[] = []): Candidat[] {
  const lex = lexique();
  const vues = new Map<MotForme, Candidat>();
  const ajouter = (m: MotForme, qualite: number, approche: boolean, debut?: number) => {
    const prec = vues.get(m);
    if (!prec || prec.qualite < qualite) vues.set(m, { m, qualite, approche, debut });
  };

  // Expressions de plusieurs mots : « il y a » doit encore se proposer
  // lorsque l'enfant a déjà écrit « il y ».
  for (const fenetre of fenetres.slice(1)) {
    const cle = normaliser(fenetre.texte);
    if (cle.length < 2) continue;
    for (const m of lex.multiMots) {
      if (m.norm.startsWith(cle)) ajouter(m, 1.05, false, fenetre.debut);
    }
  }

  const premiere = prefixeNorm[0] ?? '';
  const sources: MotForme[][] = [lex.parLettre.get(premiere) ?? [], formesPersonnelles()];
  for (const liste of sources) {
    for (const m of liste) {
      if (m.norm.startsWith(prefixeNorm)) ajouter(m, 1, false);
      else if (options.tolerance) {
        const sim = similaritePrefixe(prefixeNorm, m.norm);
        if (sim > 0) ajouter(m, sim * 0.8, true);
      }
    }
  }

  if (options.tolerance) {
    // Lettres visuellement ou phonétiquement confondues en début de mot (b/d, f/v, s/c…)
    for (const autre of LETTRES_PROCHES[premiere] ?? []) {
      for (const m of lex.parLettre.get(autre) ?? []) {
        const sim = similaritePrefixe(prefixeNorm, m.norm);
        if (sim > 0) ajouter(m, sim * 0.78, true);
      }
    }
    // Recherche par le son : « fotto » → photo, « ozo » → oiseau
    if (prefixeNorm.length >= 2) {
      const son = phonetiser(prefixeBrut);
      if (son) {
        for (const m of lex.parSon.get(son[0]) ?? []) {
          if (m.phon.startsWith(son)) ajouter(m, 0.66, !m.norm.startsWith(prefixeNorm));
        }
      }
    }
  }
  return [...vues.values()];
}

function emojiDe(m: MotForme): string {
  if (m.emoji) return m.emoji;
  for (const t of m.themes) if (EMOJI_THEME[t]) return EMOJI_THEME[t];
  return '🔤';
}

export interface ResultatPrediction {
  contexte: ContexteEcriture;
  propositions: Proposition[];
}

export function predire(texte: string, position: number, optionsPartielles: Partial<OptionsPrediction> = {}): ResultatPrediction {
  const options = { ...OPTIONS_DEFAUT, ...optionsPartielles };
  const ctx = analyser(texte, position);
  const prefixeNorm = normaliser(ctx.prefixe);

  // Pas encore de lettre : on propose la suite la plus probable, si l'option est active
  if (prefixeNorm.length === 0) {
    if (!options.motSuivant || !ctx.precedent) return { contexte: ctx, propositions: [] };
    return { contexte: ctx, propositions: motSuivant(ctx, options) };
  }
  if (prefixeNorm.length < options.minCaracteres) return { contexte: ctx, propositions: [] };

  const bigrammes = suitesProbables(ctx.precedent);
  const apprises = suitesApprises(ctx.precedent);
  const candidats = rassembler(prefixeNorm, ctx.prefixe, options, ctx.fenetres);
  const notes: Proposition[] = [];

  for (const { m, qualite, approche, debut } of candidats) {
    const freqN = Math.log1p(m.freq) / FREQ_MAX;
    let bonus = 0;
    let raison = '';
    let force = 0;

    const bg = bigrammes.get(m.norm) ?? 0;
    if (bg > 0) { bonus += 0.95 * bg; if (bg > force) { force = bg; raison = `on le dit souvent après « ${ctx.precedent} »`; } }

    const ap = apprises.get(m.norm) ?? 0;
    if (ap > 0) { bonus += 0.85 * ap; if (ap > force) { force = ap; raison = `tu l'écris souvent après « ${ctx.precedent} »`; } }

    const th = scoreThematique(m, ctx);
    if (th > 0) { bonus += 0.95 * th; if (th * 0.9 > force) { force = th * 0.9; raison = 'va avec le sujet de ton texte'; } }

    const usage = poidsUsage(m.norm);
    if (usage > 0) { bonus += 0.55 * usage; if (usage * 0.7 > force) { force = usage * 0.7; raison = 'un mot que tu utilises souvent'; } }

    if (debut !== undefined && debut !== ctx.debutMot) {
      // Expression reconnue sur plusieurs mots déjà écrits : indice très fiable,
      // et l'accord grammatical porte sur le début de l'expression, pas sur le mot en cours.
      bonus += 0.75;
      raison = 'une expression que tu as commencée';
    } else {
      bonus += accordGrammatical(m, ctx.attente);
    }
    if (ctx.dejaEcrits.has(m.lemme)) bonus += 0.12;
    // On ne répète pas un mot qui vient tout juste d'être écrit
    if (ctx.justeEcrits.has(m.lemme)) bonus -= 0.45;
    if (m.forme.length - ctx.prefixe.length >= 3) bonus += 0.08;
    if (m.norm === prefixeNorm) bonus -= 0.25;
    if (m.pos === 'expr') bonus += 0.1;

    const score = qualite * Math.max(0.02, 0.62 * freqN + bonus);
    if (score <= 0) continue;
    if (!raison) raison = approche ? 'ressemble à ce que tu as écrit' : 'mot fréquent qui commence pareil';

    const debutMaj = ctx.debutPhrase || /^[A-ZÀ-Ý]/.test(ctx.prefixe);
    const affichage = debutMaj ? majuscule(m.forme) : m.forme;
    notes.push({
      forme: affichage,
      insertion: affichage + (affichage.endsWith("'") ? '' : ' '),
      emoji: emojiDe(m),
      lemme: m.lemme,
      score,
      raison,
      approche,
      debut: debut ?? ctx.debutMot,
      abstrait: estAbstrait(m),
    });
  }

  return { contexte: ctx, propositions: trierEtLimiter(notes, options.nombre) };
}

function trierEtLimiter(props: Proposition[], nombre: number): Proposition[] {
  const parForme = new Map<string, Proposition>();
  for (const p of props) {
    const prec = parForme.get(p.forme);
    if (!prec || prec.score < p.score) parForme.set(p.forme, p);
  }
  return [...parForme.values()].sort((a, b) => b.score - a.score).slice(0, nombre);
}

/** Propositions affichées quand aucune lettre n'est encore tapée. */
function motSuivant(ctx: ContexteEcriture, options: OptionsPrediction): Proposition[] {
  const lex = lexique();
  const bigrammes = suitesProbables(ctx.precedent);
  const apprises = suitesApprises(ctx.precedent);
  const scores = new Map<string, number>();
  for (const [mot, v] of bigrammes) scores.set(mot, v);
  for (const [mot, v] of apprises) scores.set(mot, (scores.get(mot) ?? 0) + v * 1.2);
  if (scores.size === 0) return [];

  const out: Proposition[] = [];
  for (const [normMot, v] of scores) {
    const formes = lex.parNorm.get(normMot);
    if (!formes) continue;
    let meilleur: MotForme | null = null;
    let meilleurScore = -Infinity;
    for (const m of formes) {
      const s = accordGrammatical(m, ctx.attente) + Math.log1p(m.freq) / FREQ_MAX;
      if (s > meilleurScore) { meilleurScore = s; meilleur = m; }
    }
    if (!meilleur) continue;
    const debutMaj = ctx.debutPhrase;
    const affichage = debutMaj ? majuscule(meilleur.forme) : meilleur.forme;
    out.push({
      forme: affichage,
      insertion: affichage + (affichage.endsWith("'") ? '' : ' '),
      emoji: emojiDe(meilleur),
      lemme: meilleur.lemme,
      score: v * 2 + meilleurScore * 0.3,
      raison: `souvent après « ${ctx.precedent} »`,
      approche: false,
      debut: ctx.debutMot,
      abstrait: estAbstrait(meilleur),
    });
  }
  return trierEtLimiter(out, Math.min(options.nombre, 5));
}
