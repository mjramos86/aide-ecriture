/**
 * Documents de l’enfant, conservés dans le navigateur (aucune donnée
 * n’est envoyée sur un serveur).
 */
export interface Document {
  id: string;
  titre: string;
  contenu: string;
  creeLe: number;
  modifieLe: number;
  /** Tant que l’enfant n’a pas renommé son texte, le titre suit la première ligne. */
  titreAuto?: boolean;
}

const CLE = 'aide-ecriture:documents:v1';

function nouvelId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function lireDocuments(): Document[] {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return [];
    const liste = JSON.parse(brut) as Document[];
    return Array.isArray(liste) ? liste.sort((a, b) => b.modifieLe - a.modifieLe) : [];
  } catch {
    return [];
  }
}

export function ecrireDocuments(docs: Document[]) {
  try {
    localStorage.setItem(CLE, JSON.stringify(docs));
  } catch {
    /* stockage plein ou indisponible */
  }
}

export function creerDocument(titre = 'Mon texte'): Document {
  const t = Date.now();
  return { id: nouvelId(), titre, contenu: '', creeLe: t, modifieLe: t, titreAuto: true };
}

/** Titre déduit de la première ligne, pour les documents jamais renommés. */
export function titreAutomatique(contenu: string, defaut = 'Mon texte'): string {
  const premiere = contenu.split('\n').find((l) => l.trim().length > 0);
  if (!premiere) return defaut;
  const mots = premiere.trim().split(/\s+/).slice(0, 6).join(' ');
  return mots.length > 42 ? mots.slice(0, 42) + '…' : mots;
}

export function compterMots(texte: string): number {
  const m = texte.match(/[\p{L}\p{M}'’-]+/gu);
  return m ? m.length : 0;
}
