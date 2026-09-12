/**
 * Vérifications automatiques du moteur (npm test).
 * Aucune dépendance de test : le script s’exécute dans Node et sort en
 * erreur si une vérification échoue.
 */
import { lexique, estAbstrait, motsAIllustrer } from '../src/lexique';
import { pictogrammeDe } from '../src/lexique/pictogrammes';
import { predire } from '../src/prediction/moteur';
import { conjuguer, pluriel, feminin, plurielAdj } from '../src/lexique/flexion';
import { phonetiser, syllabes, similaritePrefixe } from '../src/prediction/phonetique';

let reussis = 0;
const echecs: string[] = [];

function verifier(intitule: string, condition: boolean, detail = '') {
  if (condition) { reussis++; return; }
  echecs.push(`${intitule}${detail ? ' — ' + detail : ''}`);
}

function egal(intitule: string, obtenu: unknown, attendu: unknown) {
  verifier(intitule, obtenu === attendu, `obtenu « ${String(obtenu)} », attendu « ${String(attendu)} »`);
}

/** Mots proposés pour un texte, le curseur étant à la fin. */
function propositions(texte: string, nombre = 6): string[] {
  return predire(texte, texte.length, { nombre }).propositions.map((p) => p.forme.toLowerCase());
}

function contient(intitule: string, texte: string, attendu: string, rang = 6) {
  const liste = propositions(texte, rang);
  verifier(intitule, liste.includes(attendu), `« ${attendu} » absent de : ${liste.join(', ') || '(vide)'}`);
}

function premier(intitule: string, texte: string, attendu: string) {
  const liste = propositions(texte, 3);
  verifier(intitule, liste[0] === attendu, `premier mot proposé : « ${liste[0] ?? '(aucun)'} », attendu « ${attendu} »`);
}

// ── Lexique ──────────────────────────────────────────────────────────────
const lex = lexique();
verifier('le lexique contient plus de 12 000 formes', lex.formes.length > 12000, `${lex.formes.length} formes`);
verifier('les mots courants sont illustrés', (lex.parNorm.get('chien') ?? []).some((m) => m.emoji === '🐶'));
verifier('les expressions figées sont présentes', lex.parNorm.has('ilya'), 'expression « il y a » absente');
verifier('les groupes nominaux restent entiers', lex.parNorm.has('pommedeterre'), '« pomme de terre » a été découpée');

// ── Illustrations ────────────────────────────────────────────────────────
function formeDe(mot: string) {
  return lex.formes.find((m) => m.forme === mot)!;
}
verifier('un mot concret garde son emoji', !estAbstrait(formeDe('pomme')));
verifier('un mot d’émotion demande un pictogramme', estAbstrait(formeDe('peur')));
verifier('un mot-outil demande un pictogramme', estAbstrait(formeDe('parce que')));
const aIllustrer = motsAIllustrer();
verifier('la liste à illustrer est fournie', aIllustrer.length > 300, `${aIllustrer.length} mots`);
verifier('elle contient les mots abstraits', ['peur', 'avant', 'parce que'].every((m) => aIllustrer.includes(m)));
verifier('elle écarte les mots concrets', !['pomme', 'chien', 'vélo'].some((m) => aIllustrer.includes(m)));
verifier('un mot sans pictogramme n’en réclame pas', pictogrammeDe('motquinexistepas') === undefined);

// ── Morphologie ──────────────────────────────────────────────────────────
egal('pluriel régulier', pluriel('fraise'), 'fraises');
egal('pluriel en -aux', pluriel('cheval'), 'chevaux');
egal('pluriel en -eaux', pluriel('bateau'), 'bateaux');
egal('pluriel des noms en -ou', pluriel('hibou'), 'hiboux');
egal('pluriel invariable', pluriel('souris'), 'souris');
egal('féminin régulier', feminin('grand'), 'grande');
egal('féminin en -euse', feminin('heureux'), 'heureuse');
egal('féminin en -ère', feminin('premier'), 'première');
egal('féminin irrégulier', feminin('beau'), 'belle');
egal('pluriel d’adjectif en -al', plurielAdj('normal'), 'normaux');

function formes(verbe: string, groupe: number) {
  return conjuguer(verbe, groupe);
}
function forme(verbe: string, groupe: number, temps: string, pers?: number): string {
  return formes(verbe, groupe).find((f) => f.temps === temps && f.pers === pers)?.forme ?? '';
}
egal('manger, nous au présent', forme('manger', 1, 'pres', 4), 'mangeons');
egal('commencer, je au présent', forme('commencer', 1, 'pres', 1), 'commence');
egal('commencer, nous au présent', forme('commencer', 1, 'pres', 4), 'commençons');
egal('appeler, j’appelle', forme('appeler', 1, 'pres', 1), 'appelle');
egal('acheter, j’achète', forme('acheter', 1, 'pres', 1), 'achète');
egal('acheter au futur', forme('acheter', 1, 'futur', 1), 'achèterai');
egal('préférer, je préfère', forme('préférer', 1, 'pres', 1), 'préfère');
egal('nettoyer, je nettoie', forme('nettoyer', 1, 'pres', 1), 'nettoie');
egal('finir, nous finissons', forme('finir', 2, 'pres', 4), 'finissons');
egal('partir, je pars', forme('partir', 4, 'pres', 1), 'pars');
egal('ouvrir, participe passé', formes('ouvrir', 5).find((f) => f.temps === 'pp')?.forme, 'ouvert');
egal('attendre, il attend', forme('attendre', 6, 'pres', 3), 'attend');
egal('être, vous êtes', forme('être', 9, 'pres', 5), 'êtes');
egal('aller au futur', forme('aller', 9, 'futur', 1), 'irai');
egal('comprendre, ils comprennent', forme('comprendre', 9, 'pres', 6), 'comprennent');
egal('devenir, je deviens', forme('devenir', 9, 'pres', 1), 'deviens');
egal('faire à l’imparfait', forme('faire', 9, 'imparfait', 1), 'faisais');

// ── Phonétique et syllabes ───────────────────────────────────────────────
egal('photo et foto sonnent pareil', phonetiser('photo'), phonetiser('foto'));
egal('école et ékol sonnent pareil', phonetiser('école'), phonetiser('ékol'));
egal('syllabes de « maison »', syllabes('maison').join('-'), 'mai-son');
egal('syllabes de « chevalier »', syllabes('chevalier').join('-'), 'che-va-lier');
verifier('b et d sont confondus avec tolérance', similaritePrefixe('bapa', 'papa') > 0);
verifier('un mot sans rapport n’est pas accepté', similaritePrefixe('zzz', 'papa') === 0);

// ── Prédiction en contexte ───────────────────────────────────────────────
contient('le contexte « fruits » fait apparaître « fraises »', 'J’aime beaucoup les fruits, particulièrement les f', 'fraises', 4);
premier('après « la », le mot proposé est au féminin singulier', 'J’aime beaucoup les fruits, particulièrement la f', 'fraise');
contient('le contexte « plage » fait apparaître « sable »', 'Hier je suis allé à la plage avec mon frère. On a joué dans le s', 'sable', 4);
contient('le contexte « anniversaire » fait apparaître « gâteau »', 'Pour mon anniversaire, maman a fait un g', 'gâteau', 3);
contient('le contexte « école » fait apparaître « devoirs »', 'Ma maîtresse nous a donné des d', 'devoirs', 3);
premier('après « je », le verbe est à la bonne personne', 'Je v', 'vais');
contient('après « nous », le verbe est accordé', 'Nous a', 'allons', 6);
contient('après « très », un adjectif est proposé', 'Le dinosaure est très g', 'grand', 6);
contient('l’orthographe approchée retrouve le mot', 'Je dessine ma mézon', 'maison', 5);
contient('l’écriture phonétique retrouve le mot', 'Je vais à l’ékol', 'école', 5);
contient('les expressions sont proposées', 'Dans mon jardin il y', 'il y a', 6);

const sansLettre = predire('Je veux ', 8, { motSuivant: true });
verifier('un mot suivant est proposé avant la première lettre', sansLettre.propositions.length > 0);

const vide = predire('', 0);
verifier('un texte vide ne provoque pas d’erreur', vide.propositions.length === 0);

const accords = predire('Les enfants ont mangé les p', 27 + 0);
verifier('le pluriel est respecté après « les »',
  accords.propositions.slice(0, 4).every((p) => {
    const m = (lex.parNorm.get(p.forme.toLowerCase().replace(/[^a-zà-ÿ]/g, '')) ?? []).find((x) => x.pos === 'nom');
    return !m || m.nombre !== 's';
  }),
  accords.propositions.map((p) => p.forme).join(', '));

// ── Performance ──────────────────────────────────────────────────────────
const texteLong = 'Il était une fois un petit garçon qui vivait dans une maison au bord de la mer. '.repeat(12) + 'Un matin il a vu une gr';
const debut = performance.now();
for (let i = 0; i < 20; i++) predire(texteLong, texteLong.length, { nombre: 6 });
const moyenne = (performance.now() - debut) / 20;
verifier('une prédiction prend moins de 60 ms', moyenne < 60, `${moyenne.toFixed(1)} ms en moyenne`);

// ── Résultat ─────────────────────────────────────────────────────────────
console.log(`\n${reussis} vérification(s) réussie(s), ${echecs.length} échec(s).`);
if (echecs.length) {
  for (const e of echecs) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`Lexique : ${lex.formes.length} formes fléchies. Prédiction : ${moyenne.toFixed(1)} ms en moyenne.`);
