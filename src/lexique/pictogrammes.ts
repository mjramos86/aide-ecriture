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
 * Auteur des pictogrammes : Sergio Palao. Origine : ARASAAC (http://www.arasaac.org).
 * Licence : CC (BY-NC-SA). Propriétaire : Gouvernement d’Aragon (Espagne).
 *
 * Ce libellé est l'une des deux formulations d'attribution prescrites par
 * ARASAAC : il est repris tel quel, sans reformulation.
 */
import table from './pictogrammes.json';
import corrections from './pictogrammes-corrections.json';

/**
 * Attribution exigée par ARASAAC, reprise mot pour mot dans la formulation
 * qu'ils prescrivent. À ne pas reformuler : c'est une condition de la licence.
 */
export const CREDIT_ARASAAC_AUTEUR = 'Auteur des pictogrammes : Sergio Palao.';
export const CREDIT_ARASAAC_ORIGINE = 'Origine : ARASAAC';
export const CREDIT_ARASAAC_URL = 'http://www.arasaac.org';
export const CREDIT_ARASAAC_FIN = 'Licence : CC (BY-NC-SA). Propriétaire : Gouvernement d’Aragon (Espagne)';
export const CREDIT_ARASAAC = `${CREDIT_ARASAAC_AUTEUR} ${CREDIT_ARASAAC_ORIGINE} (${CREDIT_ARASAAC_URL}). ${CREDIT_ARASAAC_FIN}`;
/**
 * Logo officiel d'ARASAAC, tel qu'il est fourni par eux : il n'est ni
 * redessiné, ni recoloré, ni recadré — seule sa taille d'affichage est fixée.
 * La version noire sert aux contextes monochromes (impression, photocopie).
 */
export const LOGO_ARASAAC = 'logo_ARASAAC.png';
export const LOGO_ARASAAC_NOIR = 'logo_ARASAAC_black.png';
/** Proportions du fichier fourni, pour réserver la place avant son chargement. */
export const LOGO_ARASAAC_LARGEUR = 2083;
export const LOGO_ARASAAC_HAUTEUR = 495;

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
