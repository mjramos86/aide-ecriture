/**
 * Pictogrammes ARASAAC.
 *
 * Les emojis illustrent très bien « pomme » ou « chien », beaucoup moins
 * « parce que », « avant » ou « peur ». Pour ces mots-là, on affiche un
 * pictogramme ARASAAC, dessiné pour la communication et bien plus lisible.
 *
 * La table ci-dessous (mot → numéro de pictogramme) est produite par
 * `npm run pictogrammes`, qui interroge l’API officielle d’ARASAAC et
 * télécharge les images dans `public/pictos/`. Tant qu’elle est vide,
 * l’application affiche simplement les emojis : rien ne casse.
 *
 * Pictogrammes : Sergio Palao pour ARASAAC (arasaac.org), propriété du
 * Gouvernement d’Aragon, sous licence CC BY-NC-SA.
 */
import table from './pictogrammes.json';
import corrections from './pictogrammes-corrections.json';

export const CREDIT_ARASAAC =
  'Pictogrammes : Sergio Palao pour ARASAAC (arasaac.org), propriété du Gouvernement d’Aragon, licence CC BY-NC-SA.';

const automatiques = table as Record<string, number>;
const manuelles = corrections as Record<string, number | null | string>;

/** Numéro du pictogramme ARASAAC d’un mot, s’il en existe un. */
export function pictogrammeDe(lemme: string): number | undefined {
  const correction = manuelles[lemme];
  if (correction === null) return undefined;
  if (typeof correction === 'number') return correction;
  const auto = automatiques[lemme];
  return typeof auto === 'number' ? auto : undefined;
}

/** Adresse de l’image, relative à la page (le site peut vivre dans un sous-dossier). */
export function urlPictogramme(id: number): string {
  return `pictos/${id}.png`;
}

export function nombreDePictogrammes(): number {
  return Object.keys(automatiques).length;
}
