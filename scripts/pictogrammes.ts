/**
 * Récupère les pictogrammes ARASAAC des mots que l’emoji illustre mal.
 *
 *   npm run pictogrammes              récupère les mots manquants
 *   npm run pictogrammes -- --limite=80   s’arrête après 80 mots
 *   npm run pictogrammes -- --force       refait aussi les mots déjà connus
 *   npm run pictogrammes -- --tolerant    ne renvoie pas d’erreur si le réseau manque
 *
 * Règle de correspondance volontairement stricte : un pictogramme n’est retenu
 * que si l’un de ses mots-clés français est exactement le mot cherché. Mieux
 * vaut un emoji qu’une image approximative devant un enfant qui apprend à lire.
 *
 * Pictogrammes : Sergio Palao pour ARASAAC (arasaac.org), propriété du
 * Gouvernement d’Aragon, licence CC BY-NC-SA.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { motsAIllustrer } from '../src/lexique';
import { normaliser } from '../src/prediction/phonetique';

const DOSSIER_IMAGES = 'public/pictos';
const FICHIER_TABLE = 'src/lexique/pictogrammes.json';
const FICHIER_ABSENTS = 'src/lexique/pictogrammes-absents.json';
const TAILLE = 300;
const PARALLELE = 4;

const arguments_ = process.argv.slice(2);
const option = (nom: string) => arguments_.some((a) => a === `--${nom}` || a.startsWith(`--${nom}=`));
const valeur = (nom: string) => arguments_.find((a) => a.startsWith(`--${nom}=`))?.split('=')[1];

const tolerant = option('tolerant');
const force = option('force');
const limite = Number(valeur('limite') ?? '0') || Infinity;

interface MotCle { keyword?: string; plural?: string }
interface Pictogramme { _id?: number; id?: number; keywords?: MotCle[]; schematic?: boolean; violence?: boolean; sex?: boolean }

async function existe(chemin: string): Promise<boolean> {
  try { await access(chemin); return true; } catch { return false; }
}

/** L’API a connu deux préfixes ; on essaie les deux avant d’abandonner. */
async function chercher(mot: string): Promise<Pictogramme[]> {
  const bases = ['https://api.arasaac.org/v1', 'https://api.arasaac.org/api'];
  let derniereErreur: unknown = null;
  for (const base of bases) {
    const url = `${base}/pictograms/fr/search/${encodeURIComponent(mot)}`;
    try {
      const reponse = await fetch(url, { headers: { accept: 'application/json' } });
      if (reponse.status === 404) return []; // aucun pictogramme pour ce mot
      if (!reponse.ok) { derniereErreur = new Error(`${reponse.status} ${reponse.statusText}`); continue; }
      const donnees = await reponse.json();
      if (Array.isArray(donnees)) return donnees as Pictogramme[];
      derniereErreur = new Error('réponse inattendue de l’API');
    } catch (e) {
      derniereErreur = e;
    }
  }
  if (derniereErreur) throw derniereErreur;
  return [];
}

/** Ne retient qu’un pictogramme dont un mot-clé est exactement le mot cherché. */
function choisir(mot: string, resultats: Pictogramme[]): number | null {
  const cible = normaliser(mot);
  const acceptables = resultats.filter((p) => {
    if (p.violence || p.sex) return false;
    return (p.keywords ?? []).some((k) => k.keyword && normaliser(k.keyword) === cible);
  });
  if (acceptables.length === 0) return null;
  // À correspondance égale, on préfère un dessin concret à un schéma.
  acceptables.sort((a, b) => Number(a.schematic ?? false) - Number(b.schematic ?? false));
  const choisi = acceptables[0];
  const id = choisi._id ?? choisi.id;
  return typeof id === 'number' ? id : null;
}

async function telecharger(id: number): Promise<boolean> {
  const chemin = `${DOSSIER_IMAGES}/${id}.png`;
  if (await existe(chemin)) return true;
  const url = `https://static.arasaac.org/pictograms/${id}/${id}_${TAILLE}.png`;
  const reponse = await fetch(url);
  if (!reponse.ok) return false;
  await writeFile(chemin, Buffer.from(await reponse.arrayBuffer()));
  return true;
}

async function principal() {
  await mkdir(DOSSIER_IMAGES, { recursive: true });
  const table: Record<string, number> = JSON.parse(await readFile(FICHIER_TABLE, 'utf8').catch(() => '{}'));
  // Mots pour lesquels ARASAAC n'a rien d'exact : inutile de les redemander
  // à chaque publication du site.
  const absents = new Set<string>(JSON.parse(await readFile(FICHIER_ABSENTS, 'utf8').catch(() => '[]')));

  const tous = motsAIllustrer();
  const aFaire = (force ? tous : tous.filter((m) => table[m] === undefined && !absents.has(m))).slice(0, limite);
  console.log(`${tous.length} mots gagneraient un pictogramme ; ${Object.keys(table).length} déjà illustrés ; ${absents.size} sans équivalent connu ; ${aFaire.length} à chercher.`);
  if (aFaire.length === 0) { console.log('Rien à faire.'); return; }

  let trouves = 0;
  let sansCorrespondance = 0;
  const erreurs: string[] = [];
  const nouveaux: string[] = [];
  let index = 0;

  async function ouvrier() {
    while (index < aFaire.length) {
      const mot = aFaire[index++];
      try {
        const id = choisir(mot, await chercher(mot));
        if (id === null) { absents.add(mot); sansCorrespondance++; continue; }
        if (!(await telecharger(id))) { erreurs.push(`${mot} : image ${id} indisponible`); continue; }
        table[mot] = id;
        nouveaux.push(`${mot} → ${id}`);
        trouves++;
      } catch (e) {
        erreurs.push(`${mot} : ${(e as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 120)); // on reste courtois avec un service public
    }
  }

  await Promise.all(Array.from({ length: PARALLELE }, ouvrier));

  const triee = Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b, 'fr')));
  await writeFile(FICHIER_TABLE, JSON.stringify(triee, null, 2) + '\n', 'utf8');
  await writeFile(FICHIER_ABSENTS, JSON.stringify([...absents].sort((a, b) => a.localeCompare(b, 'fr')), null, 2) + '\n', 'utf8');

  console.log(`\n${trouves} pictogramme(s) ajouté(s), ${sansCorrespondance} mot(s) sans correspondance exacte, ${erreurs.length} erreur(s).`);
  if (nouveaux.length) console.log('\nNouveaux mots illustrés :\n  ' + nouveaux.slice(0, 40).join('\n  ') + (nouveaux.length > 40 ? `\n  … et ${nouveaux.length - 40} autres` : ''));
  if (erreurs.length) console.log('\nErreurs :\n  ' + erreurs.slice(0, 10).join('\n  '));
  console.log(`\nTable écrite dans ${FICHIER_TABLE} (${Object.keys(triee).length} mots).`);
  console.log('Vérifiez quelques images avant de publier : une correspondance exacte reste une correspondance automatique.');
  console.log('Corrections manuelles possibles dans src/lexique/pictogrammes-corrections.json.');

  // Un échec général du réseau ne doit pas passer inaperçu, sauf en intégration continue.
  if (erreurs.length === aFaire.length && aFaire.length > 0) {
    console.error('\nAucun mot n’a pu être traité : ARASAAC est-il joignable depuis cette machine ?');
    if (!tolerant) process.exit(1);
  }
}

principal().catch((e) => {
  console.error('Échec :', (e as Error).message);
  if (!tolerant) process.exit(1);
});
