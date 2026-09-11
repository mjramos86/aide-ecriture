/**
 * Flexion : génération automatique des pluriels, féminins et conjugaisons
 * à partir des entrées compactes du lexique.
 */
import { IRREGULIERS, DERIVES, type FormesIrreg } from './verbes';
import { ADJ_IRREG } from './mots';

// ─── Noms : pluriel ──────────────────────────────────────────────────────
const PLURIEL_X = new Set(['bijou', 'caillou', 'chou', 'genou', 'hibou', 'joujou', 'pou']);
const AL_EN_ALS = new Set(['bal', 'carnaval', 'festival', 'récital', 'chacal', 'régal', 'final']);
const AIL_EN_AUX = new Set(['travail', 'vitrail', 'corail', 'émail', 'bail']);
const EU_EN_S = new Set(['pneu', 'bleu', 'landau']);

export function pluriel(mot: string): string {
  // Groupes nominaux : « pomme de terre » → « pommes de terre »
  const sep = mot.match(/^(\S+)( (?:de|à|aux|au|d'|en) .+)$/);
  if (sep) return pluriel(sep[1]) + sep[2];
  if (/[sxz]$/.test(mot)) return mot;
  if (AIL_EN_AUX.has(mot)) return mot.slice(0, -3) + 'aux';
  if (/al$/.test(mot) && !AL_EN_ALS.has(mot)) return mot.slice(0, -2) + 'aux';
  if (/(eau|au)$/.test(mot)) return mot + 'x';
  if (/eu$/.test(mot)) return EU_EN_S.has(mot) ? mot + 's' : mot + 'x';
  if (/ou$/.test(mot)) return PLURIEL_X.has(mot) ? mot + 'x' : mot + 's';
  return mot + 's';
}

// ─── Adjectifs : féminin et pluriel ──────────────────────────────────────
export function feminin(mot: string): string {
  if (ADJ_IRREG[mot]) return ADJ_IRREG[mot][0];
  if (/e$/.test(mot)) return mot;
  if (/er$/.test(mot)) return mot.slice(0, -2) + 'ère';
  if (/eux$/.test(mot)) return mot.slice(0, -3) + 'euse';
  if (/eur$/.test(mot)) return mot.slice(0, -3) + 'euse';
  if (/teur$/.test(mot)) return mot.slice(0, -4) + 'trice';
  if (/f$/.test(mot)) return mot.slice(0, -1) + 've';
  if (/(el|eil|ul|en|on|et)$/.test(mot)) return mot + mot.slice(-1) + 'e';
  if (/s$/.test(mot)) return mot + 'e';
  return mot + 'e';
}

const AL_ADJ_ALS = new Set(['banal', 'fatal', 'natal', 'naval', 'final', 'bancal']);

export function plurielAdj(mot: string, fem = false): string {
  if (ADJ_IRREG[mot] && !fem) return ADJ_IRREG[mot][1];
  if (ADJ_IRREG[mot] && fem) return ADJ_IRREG[mot][2];
  if (fem) return /s$/.test(mot) ? mot : mot + 's';
  if (/[sx]$/.test(mot)) return mot;
  if (/(eau|au)$/.test(mot)) return mot + 'x';
  if (/al$/.test(mot) && !AL_ADJ_ALS.has(mot)) return mot.slice(0, -2) + 'aux';
  return mot + 's';
}

// ─── Verbes ──────────────────────────────────────────────────────────────
export type Temps = 'inf' | 'pres' | 'imparfait' | 'futur' | 'cond' | 'pp' | 'ppr' | 'imperatif';
export interface FormeVerbale { forme: string; temps: Temps; pers?: number }

const FIN_PRES_ER = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
const FIN_IMPARFAIT = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
const FIN_FUTUR = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];

/** Verbes en e_er / é_er qui prennent un accent grave devant une syllabe muette. */
const ACCENT_GRAVE = /^(.*)([eé])([bcdfgjklmnprstvz])er$/;
/** -eler / -eter qui doublent la consonne (appeler, jeter). */
const DOUBLE_CONSONNE = new Set(['appeler', 'rappeler', 'jeter', 'rejeter', 'épeler', 'renouveler', 'ficeler', 'feuilleter']);

function radicalMuet(inf: string): string | null {
  if (DOUBLE_CONSONNE.has(inf)) {
    const r = inf.slice(0, -2);
    return r + r.slice(-1);
  }
  const m = inf.match(ACCENT_GRAVE);
  if (m && !DOUBLE_CONSONNE.has(inf)) {
    // préférer → préfèr- ; acheter → achèt- ; lever → lèv-
    return m[1] + 'è' + m[3];
  }
  if (/yer$/.test(inf) && !/(ayer)$/.test(inf)) return inf.slice(0, -3) + 'i';
  return null;
}

function conjuguerGroupe1(inf: string): FormeVerbale[] {
  const rad = inf.slice(0, -2);
  const muet = radicalMuet(inf);
  const out: FormeVerbale[] = [];
  const radDevantAO = /cer$/.test(inf) ? rad.slice(0, -1) + 'ç' : /ger$/.test(inf) ? rad + 'e' : rad;
  const pres = FIN_PRES_ER.map((fin, i) => {
    const estMuet = i === 0 || i === 1 || i === 2 || i === 5;
    const base = estMuet && muet ? muet : i === 3 ? radDevantAO : rad;
    return base + fin;
  });
  // -ayer : les deux orthographes sont correctes (je paie / je paye)
  if (/ayer$/.test(inf)) {
    const alt = inf.slice(0, -3) + 'i';
    [0, 1, 2, 5].forEach((i) => out.push({ forme: alt + FIN_PRES_ER[i], temps: 'pres', pers: i + 1 }));
  }
  pres.forEach((f, i) => out.push({ forme: f, temps: 'pres', pers: i + 1 }));
  const radImp = radDevantAO;
  FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: (i === 3 || i === 4 ? rad : radImp) + fin, temps: 'imparfait', pers: i + 1 }));
  // Futur : radical = infinitif, avec accent grave pour lever/acheter/appeler
  let radFut = inf;
  if (DOUBLE_CONSONNE.has(inf)) radFut = radicalMuet(inf)! + 'er';
  else if (/yer$/.test(inf) && !/ayer$/.test(inf)) radFut = inf.slice(0, -3) + 'ier';
  else {
    const m = inf.match(/^(.*)e([bcdfgjklmnprstvz]+)er$/);
    if (m) radFut = m[1] + 'è' + m[2] + 'er';
  }
  FIN_FUTUR.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'futur', pers: i + 1 }));
  FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'cond', pers: i + 1 }));
  out.push({ forme: rad + 'é', temps: 'pp' }, { forme: radDevantAO + 'ant', temps: 'ppr' });
  out.push({ forme: pres[0], temps: 'imperatif', pers: 2 }, { forme: pres[3], temps: 'imperatif', pers: 4 }, { forme: pres[4], temps: 'imperatif', pers: 5 });
  return out;
}

function conjuguerSimple(rad: string, presFins: string[], radImp: string, radFut: string, pp: string): FormeVerbale[] {
  const out: FormeVerbale[] = [];
  presFins.forEach((fin, i) => out.push({ forme: rad + fin, temps: 'pres', pers: i + 1 }));
  FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: radImp + fin, temps: 'imparfait', pers: i + 1 }));
  FIN_FUTUR.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'futur', pers: i + 1 }));
  FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'cond', pers: i + 1 }));
  out.push({ forme: pp, temps: 'pp' }, { forme: radImp + 'ant', temps: 'ppr' });
  out.push(
    { forme: rad + presFins[1], temps: 'imperatif', pers: 2 },
    { forme: rad + presFins[3], temps: 'imperatif', pers: 4 },
    { forme: rad + presFins[4], temps: 'imperatif', pers: 5 },
  );
  return out;
}

function conjuguerIrregulier(f: FormesIrreg, prefixe = ''): FormeVerbale[] {
  const out: FormeVerbale[] = [];
  const p = f.p.map((x) => (x ? prefixe + x : ''));
  p.forEach((forme, i) => forme && out.push({ forme, temps: 'pres', pers: i + 1 }));
  const radImp = prefixe + (f.ri ?? (f.p[3] ? f.p[3].replace(/ons$/, '') : ''));
  if (radImp) {
    FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: radImp + fin, temps: 'imparfait', pers: i + 1 }));
    out.push({ forme: radImp + 'ant', temps: 'ppr' });
  }
  const radFut = prefixe + f.ra;
  FIN_FUTUR.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'futur', pers: i + 1 }));
  FIN_IMPARFAIT.forEach((fin, i) => out.push({ forme: radFut + fin, temps: 'cond', pers: i + 1 }));
  out.push({ forme: prefixe + f.pp, temps: 'pp' });
  const imp = f.imp ? f.imp.map((x) => prefixe + x) : [p[1], p[3], p[4]];
  [2, 4, 5].forEach((pers, i) => imp[i] && out.push({ forme: imp[i], temps: 'imperatif', pers }));
  return out;
}

/** Conjugue un verbe à partir de son infinitif et de son groupe. */
export function conjuguer(infinitif: string, groupe: number): FormeVerbale[] {
  const inf = infinitif.replace(/^(se |s')/, '');
  let formes: FormeVerbale[];
  switch (groupe) {
    case 1:
      formes = conjuguerGroupe1(inf);
      break;
    case 2: {
      const rad = inf.slice(0, -2); // fin-
      formes = conjuguerSimple(rad, ['is', 'is', 'it', 'issons', 'issez', 'issent'], rad + 'iss', inf, rad + 'i');
      break;
    }
    case 4: {
      // partir → je pars / nous partons
      const radLong = inf.slice(0, -2); // part-
      const radCourt = radLong.slice(0, -1); // par-
      formes = [];
      ['s', 's', 't'].forEach((fin, i) => formes.push({ forme: radCourt + fin, temps: 'pres', pers: i + 1 }));
      ['ons', 'ez', 'ent'].forEach((fin, i) => formes.push({ forme: radLong + fin, temps: 'pres', pers: i + 4 }));
      FIN_IMPARFAIT.forEach((fin, i) => formes.push({ forme: radLong + fin, temps: 'imparfait', pers: i + 1 }));
      FIN_FUTUR.forEach((fin, i) => formes.push({ forme: inf + fin, temps: 'futur', pers: i + 1 }));
      FIN_IMPARFAIT.forEach((fin, i) => formes.push({ forme: inf + fin, temps: 'cond', pers: i + 1 }));
      formes.push({ forme: radLong + 'i', temps: 'pp' }, { forme: radLong + 'ant', temps: 'ppr' });
      formes.push({ forme: radCourt + 's', temps: 'imperatif', pers: 2 }, { forme: radLong + 'ons', temps: 'imperatif', pers: 4 }, { forme: radLong + 'ez', temps: 'imperatif', pers: 5 });
      break;
    }
    case 5: {
      // ouvrir → j'ouvre / nous ouvrons ; participe passé en -ert (sauf cueillir)
      const rad = inf.slice(0, -2);
      // ouvrir → ouvert, offrir → offert, souffrir → souffert
      const pp = /cueillir$/.test(inf) ? rad + 'i' : rad.replace(/r$/, '') + 'ert';
      formes = conjuguerSimple(rad, FIN_PRES_ER, rad, /cueillir$/.test(inf) ? rad + 'er' : inf, pp);
      formes.push({ forme: rad + 'e', temps: 'imperatif', pers: 2 });
      break;
    }
    case 6: {
      // attendre → j'attends / il attend / nous attendons
      const rad = inf.slice(0, -2); // attend-
      formes = [];
      formes.push({ forme: rad + 's', temps: 'pres', pers: 1 }, { forme: rad + 's', temps: 'pres', pers: 2 }, { forme: rad, temps: 'pres', pers: 3 });
      ['ons', 'ez', 'ent'].forEach((fin, i) => formes.push({ forme: rad + fin, temps: 'pres', pers: i + 4 }));
      FIN_IMPARFAIT.forEach((fin, i) => formes.push({ forme: rad + fin, temps: 'imparfait', pers: i + 1 }));
      const radFut = inf.slice(0, -1);
      FIN_FUTUR.forEach((fin, i) => formes.push({ forme: radFut + fin, temps: 'futur', pers: i + 1 }));
      FIN_IMPARFAIT.forEach((fin, i) => formes.push({ forme: radFut + fin, temps: 'cond', pers: i + 1 }));
      formes.push({ forme: rad + 'u', temps: 'pp' }, { forme: rad + 'ant', temps: 'ppr' });
      formes.push({ forme: rad + 's', temps: 'imperatif', pers: 2 }, { forme: rad + 'ons', temps: 'imperatif', pers: 4 }, { forme: rad + 'ez', temps: 'imperatif', pers: 5 });
      break;
    }
    default: {
      const derive = DERIVES[inf];
      if (derive && IRREGULIERS[derive[0]]) formes = conjuguerIrregulier(IRREGULIERS[derive[0]], derive[1]);
      else if (IRREGULIERS[inf]) formes = conjuguerIrregulier(IRREGULIERS[inf]);
      else formes = conjuguerGroupe1(inf.replace(/(ir|re|oir)$/, 'er'));
      break;
    }
  }
  formes.push({ forme: infinitif, temps: 'inf' });
  if (inf !== infinitif) formes.push({ forme: inf, temps: 'inf' });
  return formes;
}
