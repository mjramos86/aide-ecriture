/**
 * Dictionnaire personnel : l'application apprend des choix de l'enfant
 * (mots retenus, enchaînements) et accepte des mots ajoutés à la main
 * (prénoms, animal de compagnie, mots du projet de classe…).
 * Tout reste dans le navigateur.
 */
import { normaliser, phonetiser } from './phonetique';
import type { MotForme, Pos } from '../lexique';

const CLE = 'aide-ecriture:perso:v1';

export interface MotAjoute { forme: string; emoji?: string; pos?: Pos }

interface DonneesPerso {
  usages: Record<string, number>;
  suites: Record<string, Record<string, number>>;
  ajoutes: MotAjoute[];
}

let donnees: DonneesPerso = { usages: {}, suites: {}, ajoutes: [] };
let charge = false;

function lire(): DonneesPerso {
  if (charge) return donnees;
  charge = true;
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) {
      const d = JSON.parse(brut) as Partial<DonneesPerso>;
      donnees = { usages: d.usages ?? {}, suites: d.suites ?? {}, ajoutes: d.ajoutes ?? [] };
    }
  } catch {
    /* stockage indisponible : on reste en mémoire */
  }
  return donnees;
}

function ecrire() {
  try {
    localStorage.setItem(CLE, JSON.stringify(donnees));
  } catch {
    /* quota dépassé ou navigation privée : sans conséquence */
  }
}

/** Mémorise qu'une proposition a été retenue après un mot donné. */
export function enregistrerChoix(forme: string, precedent: string) {
  const d = lire();
  const k = normaliser(forme);
  d.usages[k] = (d.usages[k] ?? 0) + 1;
  if (precedent) {
    const suites = (d.suites[precedent] ??= {});
    suites[k] = (suites[k] ?? 0) + 1;
  }
  ecrire();
}

/** Bonus de familiarité d'un mot, entre 0 et 1. */
export function poidsUsage(formeNormalisee: string): number {
  const n = lire().usages[formeNormalisee] ?? 0;
  return n === 0 ? 0 : n / (n + 3);
}

/** Enchaînements déjà observés chez cet enfant. */
export function suitesApprises(precedent: string): Map<string, number> {
  const out = new Map<string, number>();
  const suites = lire().suites[precedent];
  if (!suites) return out;
  let max = 0;
  for (const v of Object.values(suites)) max = Math.max(max, v);
  for (const [k, v] of Object.entries(suites)) out.set(k, v / (max || 1));
  return out;
}

export function motsPersonnels(): MotAjoute[] {
  return [...lire().ajoutes];
}

export function ajouterMot(forme: string, emoji?: string, pos: Pos = 'nom'): boolean {
  const d = lire();
  const propre = forme.trim();
  if (!propre) return false;
  if (d.ajoutes.some((m) => normaliser(m.forme) === normaliser(propre))) return false;
  d.ajoutes.push({ forme: propre, emoji, pos });
  ecrire();
  return true;
}

export function supprimerMot(forme: string) {
  const d = lire();
  d.ajoutes = d.ajoutes.filter((m) => m.forme !== forme);
  ecrire();
}

export function oublierApprentissage() {
  donnees = { usages: {}, suites: {}, ajoutes: donnees.ajoutes };
  ecrire();
}

/** Transforme les mots ajoutés en formes utilisables par le moteur. */
export function formesPersonnelles(): MotForme[] {
  return motsPersonnels().map((m) => ({
    forme: m.forme,
    lemme: m.forme,
    pos: m.pos ?? 'nom',
    freq: 70,
    themes: ['perso'],
    emoji: m.emoji ?? '⭐',
    norm: normaliser(m.forme),
    phon: phonetiser(m.forme),
  }));
}
