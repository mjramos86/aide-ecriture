/**
 * Normalisation, phonétique française approchée et syllabation.
 *
 * L'enfant dyslexique écrit souvent « comme ça s'entend » (fotö → photo,
 * ozo → oiseau) ou confond des lettres proches (b/d, p/q, m/n).
 * Ces fonctions permettent de retrouver le mot visé malgré ces écarts.
 */

const ACCENTS: Record<string, string> = {
  à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a', å: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', î: 'i', ï: 'i', ì: 'i',
  ó: 'o', ô: 'o', ö: 'o', ò: 'o', õ: 'o',
  ú: 'u', û: 'u', ü: 'u', ù: 'u',
  ý: 'y', ÿ: 'y', ç: 'c', ñ: 'n', œ: 'oe', æ: 'ae',
};

export function sansAccents(s: string): string {
  return s.toLowerCase().replace(/[^\x00-\x7F]/g, (c) => ACCENTS[c] ?? c);
}

/** Clé de comparaison : minuscules, sans accents, sans traits d'union ni apostrophes. */
export function normaliser(s: string): string {
  return sansAccents(s).replace(/[’']/g, "'").replace(/[-\s]/g, '');
}

/**
 * Transcription phonétique simplifiée du français.
 * Codes : X = ch, J = j/ge, N = gn, Y = ill, 4 = an/en, 3 = on, 5 = in/un, W = ou semi-voyelle.
 */
export function phonetiser(mot: string): string {
  let s = mot.toLowerCase().replace(/[’']/g, '').replace(/[-\s]/g, '');
  s = s.replace(/[^\x00-\x7F]/g, (c) => {
    if ('éèêë'.includes(c)) return 'e';
    if ('àâä'.includes(c)) return 'a';
    if ('ïî'.includes(c)) return 'i';
    if ('ôö'.includes(c)) return 'o';
    if ('ùûü'.includes(c)) return 'u';
    if (c === 'ç') return 's';
    if (c === 'œ') return 'eu';
    return ACCENTS[c] ?? c;
  });

  // Groupes consonantiques et voyelles complexes
  s = s.replace(/eaux?/g, 'O').replace(/au/g, 'O').replace(/eu|oeu/g, 'E2');
  s = s.replace(/ph/g, 'f').replace(/ch/g, 'X').replace(/sh/g, 'X').replace(/th/g, 't');
  s = s.replace(/gn/g, 'N');
  s = s.replace(/qu/g, 'k').replace(/q/g, 'k');
  s = s.replace(/gu([eiy])/g, 'g$1');
  s = s.replace(/ge([aou])/g, 'J$1');
  s = s.replace(/c([eiy])/g, 's$1').replace(/c/g, 'k').replace(/k/g, 'k');
  s = s.replace(/g([eiy])/g, 'J$1').replace(/g/g, 'g');
  s = s.replace(/x/g, 'ks');
  // Voyelles nasales (non suivies d'une voyelle ni d'un doublement)
  s = s.replace(/(ai|ei)n(?![aeiouynm])/g, '5').replace(/[ou]in(?![aeiouynm])/g, '5');
  s = s.replace(/[ai]m(?![aeioumn])/g, '5').replace(/in(?![aeiouynm])/g, '5');
  s = s.replace(/[uy]n(?![aeiouynm])/g, '5').replace(/um(?![aeioumn])/g, '5');
  s = s.replace(/[ae]n(?![aeiouynm])/g, '4').replace(/[ae]m(?![aeioumn])/g, '4');
  s = s.replace(/on(?![aeiouynm])/g, '3').replace(/om(?![aeioumn])/g, '3');
  // Voyelles composées restantes
  s = s.replace(/oi/g, 'Wa').replace(/ou/g, 'u').replace(/ai|ei|ay/g, 'e');
  s = s.replace(/ill/g, 'Y').replace(/([aeiou])il\b/g, '$1Y');
  s = s.replace(/y/g, 'i');
  // s intervocalique = z
  s = s.replace(/([aeiouE234])s([aeiouE234])/g, '$1z$2');
  s = s.replace(/h/g, '');
  // Terminaisons muettes
  s = s.replace(/(e[rz]|ez|et)$/g, 'e');
  s = s.replace(/[edtsxzp]$/g, '');
  s = s.replace(/e$/g, '');
  // Doublons
  s = s.replace(/(.)\1+/g, '$1');
  s = s.replace(/E2/g, 'E');
  return s.toUpperCase();
}

/** Paires de lettres fréquemment confondues (inversions, sons proches). */
const CONFUSIONS: string[][] = [
  ['b', 'd'], ['b', 'p'], ['d', 'q'], ['p', 'q'], ['d', 't'], ['m', 'n'], ['u', 'n'],
  ['f', 'v'], ['s', 'z'], ['s', 'c'], ['c', 'k'], ['g', 'j'], ['a', 'o'], ['e', 'a'],
  ['i', 'y'], ['o', 'u'], ['ch', 'j'], ['g', 'k'], ['v', 'w'], ['l', 'r'],
];
const PAIRES = new Set<string>();
for (const [a, b] of CONFUSIONS) { PAIRES.add(a + '|' + b); PAIRES.add(b + '|' + a); }

export function sontConfondues(a: string, b: string): boolean {
  return PAIRES.has(a + '|' + b);
}

/**
 * Compare le début tapé au mot candidat en tolérant une erreur.
 * Retourne un score 0 (aucun rapport) à 1 (identique).
 */
export function similaritePrefixe(tape: string, mot: string): number {
  if (!tape) return 0;
  if (mot.startsWith(tape)) return 1;
  const n = tape.length;
  let erreurs = 0;
  let i = 0;
  let j = 0;
  while (i < n && j < mot.length) {
    if (tape[i] === mot[j]) { i++; j++; continue; }
    erreurs++;
    if (erreurs > 1) return 0;
    if (sontConfondues(tape[i], mot[j])) { i++; j++; continue; } // substitution proche
    if (tape[i + 1] === mot[j] && tape[i] === mot[j + 1]) { i += 2; j += 2; continue; } // inversion
    if (tape[i + 1] === mot[j]) { i++; continue; } // lettre en trop
    if (tape[i] === mot[j + 1]) { j++; continue; } // lettre oubliée
    return 0;
  }
  if (i < n) return 0;
  return erreurs === 0 ? 1 : 0.72;
}

// ─── Syllabation (pour la coloration alternée) ───────────────────────────
const VOYELLES = 'aeiouyàâäéèêëîïôöùûüœ';
const GROUPES_INSECABLES = ['bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gn', 'gr', 'ph', 'pl', 'pr', 'th', 'tr', 'vr'];

export function syllabes(mot: string): string[] {
  const bas = mot.toLowerCase();
  if (bas.length < 4) return [mot];
  const estV = (i: number) => i >= 0 && i < bas.length && VOYELLES.includes(bas[i]);
  // Repérage des noyaux vocaliques (les groupes de voyelles comptent pour un)
  const noyaux: [number, number][] = [];
  for (let i = 0; i < bas.length; i++) {
    if (!estV(i)) continue;
    let fin = i;
    while (estV(fin + 1)) fin++;
    // voyelle nasale : le n/m appartient au noyau s'il n'est pas suivi d'une voyelle
    if ('nm'.includes(bas[fin + 1] ?? '') && !estV(fin + 2)) fin++;
    noyaux.push([i, fin]);
    i = fin;
  }
  if (noyaux.length < 2) return [mot];
  const coupures: number[] = [];
  for (let k = 0; k < noyaux.length - 1; k++) {
    const debutCons = noyaux[k][1] + 1;
    const finCons = noyaux[k + 1][0];
    const nb = finCons - debutCons;
    if (nb <= 0) coupures.push(finCons);
    else if (nb === 1) coupures.push(debutCons);
    else {
      const deux = bas.slice(debutCons, debutCons + 2);
      if (nb === 2 && GROUPES_INSECABLES.includes(deux)) coupures.push(debutCons);
      else coupures.push(finCons - 1 >= debutCons + 1 && GROUPES_INSECABLES.includes(bas.slice(finCons - 2, finCons)) ? finCons - 2 : debutCons + 1);
    }
  }
  const out: string[] = [];
  let prec = 0;
  for (const c of coupures) {
    if (c > prec && c < mot.length) { out.push(mot.slice(prec, c)); prec = c; }
  }
  out.push(mot.slice(prec));
  return out.filter(Boolean);
}
