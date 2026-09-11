/** Préférences d’affichage et d’aide, enregistrées dans le navigateur. */
export interface Parametres {
  police: string;
  taille: number;
  interligne: number;
  espacementLettres: number;
  espacementMots: number;
  theme: 'clair' | 'creme' | 'bleu' | 'sombre';
  reglette: boolean;
  colorationSyllabes: boolean;
  /** Prédiction */
  nombrePropositions: number;
  minCaracteres: number;
  motSuivant: boolean;
  tolerance: boolean;
  validationEntree: boolean;
  /** Voix */
  lireProposition: boolean;
  vitesseVoix: number;
}

export const PARAMETRES_DEFAUT: Parametres = {
  police: 'Verdana',
  taille: 22,
  interligne: 2,
  espacementLettres: 0.06,
  espacementMots: 0.28,
  theme: 'creme',
  reglette: false,
  colorationSyllabes: true,
  nombrePropositions: 6,
  minCaracteres: 1,
  motSuivant: true,
  tolerance: true,
  validationEntree: false,
  lireProposition: true,
  vitesseVoix: 0.9,
};

const CLE = 'aide-ecriture:parametres:v1';

export function lireParametres(): Parametres {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return PARAMETRES_DEFAUT;
    return { ...PARAMETRES_DEFAUT, ...(JSON.parse(brut) as Partial<Parametres>) };
  } catch {
    return PARAMETRES_DEFAUT;
  }
}

export function ecrireParametres(p: Parametres) {
  try {
    localStorage.setItem(CLE, JSON.stringify(p));
  } catch {
    /* sans conséquence */
  }
}

export const POLICES: { nom: string; pile: string; note: string }[] = [
  { nom: 'OpenDyslexic', pile: '"OpenDyslexic", "Open Dyslexic", Verdana, sans-serif', note: 'si la police est installée sur l’ordinateur' },
  { nom: 'Verdana', pile: 'Verdana, Geneva, sans-serif', note: 'lettres larges et bien séparées' },
  { nom: 'Andika', pile: '"Andika", "Andika New Basic", Verdana, sans-serif', note: 'conçue pour l’apprentissage de la lecture' },
  { nom: 'Comic Sans MS', pile: '"Comic Sans MS", "Comic Neue", cursive', note: 'lettres proches de l’écriture manuscrite' },
  { nom: 'Arial', pile: 'Arial, Helvetica, sans-serif', note: 'police classique' },
  { nom: 'Tahoma', pile: 'Tahoma, Geneva, sans-serif', note: 'compacte et lisible' },
];

export function pilePolice(nom: string): string {
  return POLICES.find((p) => p.nom === nom)?.pile ?? POLICES[1].pile;
}
