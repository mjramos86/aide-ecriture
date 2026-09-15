/**
 * Produit public/licences.txt à partir des dépendances réellement livrées.
 *
 * Les licences MIT, Apache-2.0 et ISC exigent que l'avis de copyright et le
 * texte de la licence accompagnent toute copie du logiciel. Un site publié est
 * une copie : ce fichier est donc distribué avec lui.
 *
 * Lancé automatiquement avant chaque construction (script « prebuild »).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SORTIE = 'public/licences.txt';

const ENTETE = `Licences et attributions — Les mots rusés
=========================================

Ce fichier est produit automatiquement à partir des composants réellement
distribués avec le site. Dernière génération : ${new Date().toISOString().slice(0, 10)}.


PICTOGRAMMES — ATTRIBUTION EXIGÉE
---------------------------------

Auteur des pictogrammes : Sergio Palao. Origine : ARASAAC
(http://www.arasaac.org). Licence : CC (BY-NC-SA). Propriétaire :
Gouvernement d'Aragon (Espagne)

Formulation équivalente, également admise par ARASAAC :

  Les symboles pictographiques utilisés sont la propriété du Gouvernement
  d'Aragon et ont été créés par Sergio Palao pour ARASAAC
  (http://www.arasaac.org), qui les distribuent sous Licence Creative
  Commons BY-NC-SA.

ARASAAC est une marque du Gouvernement d'Aragon enregistrée à l'Office
Espagnol des Brevets et des Marques. La collection de pictogrammes est
enregistrée au Registre Général de la Propriété Intellectuelle (dépôt légal
Z 901-2013) en tant qu'œuvre collective au nom de la Diputación General de
Aragón.

Conditions d'utilisation :

  - Licence Creative Commons BY-NC-SA :
    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr
  - Usage à but non lucratif uniquement. Toute utilisation dans un produit
    ou une publication à des fins commerciales est exclue.
  - Tout travail dérivé doit être distribué sous la même licence, en citant
    l'auteur, le propriétaire, l'origine et la licence.

Ce que fait ce site :

  - Les pictogrammes sont affichés tels quels, à côté des mots proposés.
    Aucun n'est modifié, recoloré ni recomposé : seule leur taille
    d'affichage est ajustée par la feuille de style.
  - Les documents exportés (Word, PDF, texte, page web) ne contiennent que
    le texte écrit par l'enfant. Aucun pictogramme n'y est incorporé, donc
    aucun fichier produit par l'application n'est un travail dérivé.
  - Le logo ARASAAC, quand il est affiché, l'est tel que fourni par ARASAAC.
    Son usage n'est imposé que pour la signalétique de lieux publics, ce que
    ce site n'est pas.


POLICES DE CARACTÈRES
---------------------

Aucune police n'est distribuée avec ce site. L'application se contente de
nommer des polices (Verdana, Arial, Comic Sans MS, Andika, OpenDyslexic…) ;
c'est celle installée sur l'appareil du visiteur qui est utilisée.


EMOJIS
------

Aucune image d'emoji n'est distribuée. Les caractères sont du texte Unicode,
dessinés par la police du système du visiteur.


VOCABULAIRE
-----------

Le lexique français (mots, thèmes, associations, conjugaisons) a été écrit pour
ce projet. Aucune base lexicale tierce n'y est incorporée.


BIBLIOTHÈQUES LOGICIELLES
-------------------------

`;

function paquets() {
  const brut = execFileSync('npm', ['ls', '--omit=dev', '--all', '--parseable'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const chemins = [...new Set(brut.split('\n').filter((l) => l.includes('node_modules')))];
  const vus = new Map();
  for (const chemin of chemins) {
    const manifeste = join(chemin, 'package.json');
    if (!existsSync(manifeste)) continue;
    let p;
    try { p = JSON.parse(readFileSync(manifeste, 'utf8')); } catch { continue; }
    if (!p.name || vus.has(p.name)) continue;
    vus.set(p.name, { nom: p.name, version: p.version ?? '', licence: typeof p.license === 'string' ? p.license : (p.license?.type ?? 'non déclarée'), texte: texteLicence(chemin) });
  }
  return [...vus.values()].sort((a, b) => a.nom.localeCompare(b.nom));
}

function texteLicence(chemin) {
  try {
    const fichier = readdirSync(chemin).find((f) => /^(LICEN[CS]E|COPYING)/i.test(f));
    if (!fichier) return null;
    return readFileSync(join(chemin, fichier), 'utf8').trim();
  } catch {
    return null;
  }
}

const liste = paquets();
const blocs = liste.map((p) => {
  const titre = `${p.nom} ${p.version} — ${p.licence}`;
  const barre = '-'.repeat(titre.length);
  return `${titre}\n${barre}\n\n${p.texte ?? '(Texte de licence non fourni par le paquet ; voir ' + p.licence + '.)'}\n`;
});

const resume = liste.map((p) => `  ${p.nom.padEnd(30)} ${p.licence}`).join('\n');
const contenu = `${ENTETE}${liste.length} composants sont livrés avec le site :\n\n${resume}\n\n\nTextes complets\n===============\n\n${blocs.join('\n\n')}`;

writeFileSync(SORTIE, contenu, 'utf8');
console.log(`${SORTIE} : ${liste.length} composants, ${(contenu.length / 1024).toFixed(0)} ko.`);
