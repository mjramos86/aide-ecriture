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


PICTOGRAMMES
------------

Les pictogrammes affichés à côté des mots proposés sont l'œuvre de Sergio Palao
pour ARASAAC (https://arasaac.org), propriété du Gouvernement d'Aragon (Espagne),
diffusés sous licence Creative Commons BY-NC-SA.

Licence complète : https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr
La clause NC interdit tout usage commercial de ces pictogrammes.


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
