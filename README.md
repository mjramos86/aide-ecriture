# Les mots rusés 🦊

Traitement de texte en ligne pour aider les enfants dyslexiques à écrire en français.

Dès la première lettre tapée, une liste de mots illustrés apparaît sous le curseur.
Les propositions tiennent compte **du contexte de la phrase et du texte** : après
« J'aime beaucoup les fruits, particulièrement les **f**… », l'enfant se voit
proposer 🍓 fraises, 🫐 framboises, 🟤 figues — au pluriel, parce que la phrase
commence par « les ».

L'application fonctionne entièrement dans le navigateur : aucun compte, aucun
serveur, aucune donnée qui sort de l'ordinateur.

---

## Ce que l'application sait faire

### Aider à écrire le bon mot
- **Propositions dès la 1ʳᵉ lettre**, avec une illustration à côté de chaque mot :
  un emoji pour les mots concrets (🍓 fraise), un **pictogramme ARASAAC** pour
  ceux qu'un emoji illustre mal (« avant », « peur », « parce que »).
- **Contexte de la phrase** : accord en genre et en nombre après un déterminant
  (« la f… » → fraise, « les f… » → fraises), personne du verbe après un pronom
  (« nous a… » → allons, avons), participe passé après un auxiliaire, infinitif
  après « je vais », « pour », « il faut »…
- **Contexte du texte** : les mots qui appartiennent à l'univers déjà évoqué
  remontent dans la liste (un texte qui parle de la plage propose « sable »,
  « seau », « coquillage » ; un texte qui parle d'anniversaire propose « gâteau »).
- **Orthographe approchée** : « fotto » trouve *photo*, « mézon » trouve *maison*,
  « ékol » trouve *école*, « bapa » trouve *papa*. Les confusions classiques
  (b/d, p/q, m/n, f/v, s/z…) et l'écriture phonétique sont tolérées.
- **Expressions entières** : après « il y », l'application propose « il y a ».
- **Mot suivant** proposé avant même la première lettre.
- **Apprentissage** : les mots que l'enfant choisit souvent, et ses enchaînements
  de mots, remontent peu à peu dans la liste.
- **Dictionnaire personnel** : prénoms, animal de compagnie, mots du projet de
  classe, avec leur emoji.

### Illustrer les mots, y compris les mots abstraits

Un emoji dit très bien « pomme » ou « chien ». Il dit mal « parce que », « avant »
ou « toujours ». Pour ces mots-là, l'application affiche un **pictogramme
ARASAAC**, dessiné pour la communication et bien plus lisible qu'un symbole
détourné. Trois réglages : *Emojis*, *Les deux* (par défaut : pictogramme
seulement quand il apporte quelque chose) et *Pictogrammes*.

Les images ne sont pas versionnées dans le dépôt : `npm run pictogrammes` les
récupère auprès d'ARASAAC, et la publication du site le fait automatiquement.
Tant qu'elles sont absentes — dépôt fraîchement cloné, ARASAAC injoignable —
l'application affiche les emojis : rien ne casse jamais.

```bash
npm run pictogrammes                 # récupère les mots manquants
npm run pictogrammes -- --limite=50  # s'arrête après 50 mots
npm run pictogrammes -- --force      # refait aussi les mots déjà connus
```

Le script ne retient un pictogramme que si **l'un de ses mots-clés français est
exactement le mot cherché** : mieux vaut un emoji qu'une image approximative
devant un enfant qui apprend à lire. Les mots sans équivalent exact sont notés
dans `src/lexique/pictogrammes-absents.json` pour ne pas être redemandés, et
toute correction manuelle se fait dans `src/lexique/pictogrammes-corrections.json`
(`"mot": numéro` pour imposer un pictogramme, `"mot": null` pour revenir à l'emoji).

> **Licence des pictogrammes.** Les pictogrammes sont l'œuvre de Sergio Palao
> pour ARASAAC (<https://arasaac.org>), propriété du Gouvernement d'Aragon,
> diffusés sous licence **CC BY-NC-SA**. L'attribution est affichée dans les
> réglages de l'application. La clause **NC** interdit un usage commercial :
> un usage scolaire, familial ou associatif est couvert, la revente ne l'est pas.

### Aider à lire ce qu'on écrit
- Police, taille, interligne, espacement des lettres et des mots réglables
  (repères issus des recommandations sur la lisibilité pour les dyslexiques).
- Quatre fonds : crème, blanc, bleu doux, sombre.
- **Règle de lecture** qui surligne la ligne en cours d'écriture.
- **Syllabes en couleurs alternées** dans la liste des propositions.
- **Synthèse vocale** : écouter un mot proposé avant de le choisir, ou tout le texte.

### Gérer ses textes
- Plusieurs documents, enregistrés automatiquement dans le navigateur.
- Copie, suppression, titre automatique d'après la première ligne.
- **Export en Word (.docx), PDF, texte simple (.txt), page web (.html)** et impression.

---

## Démarrer

```bash
npm install
npm run dev      # développement, sur http://localhost:5173
npm run build    # version de production dans dist/
npm run preview  # prévisualiser la version de production
npm test         # vérifications du moteur (lexique, conjugaison, prédiction)
```

`dist/` ne contient que des fichiers statiques : l'application peut être déposée
sur n'importe quel hébergement (GitHub Pages, Netlify, un dossier partagé de
l'école…), sans base de données.

---

## Mettre le site en ligne

Le site est publié automatiquement par GitHub Actions, à partir du dépôt.

**Adresse du site : <https://lesmotsruses.ca>**
(l'adresse d'origine <https://mjramos86.github.io/aide-ecriture/> y redirige.)

À chaque `git push`, le workflow `.github/workflows/deploiement.yml` :

1. installe les dépendances, vérifie les types, lance `npm test` et construit le site ;
2. **publie le résultat sur GitHub Pages** — uniquement si la branche envoyée est la
   branche par défaut du dépôt. Les autres branches et les pull requests sont
   vérifiées, mais rien n'est mis en ligne.

### À faire une seule fois : activer Pages

GitHub n'autorise pas un workflow à créer lui-même le site Pages d'un dépôt.
La toute première publication demande donc une manipulation, une seule fois :

1. ouvrir [**Settings → Pages**](https://github.com/mjramos86/aide-ecriture/settings/pages) ;
2. dans **Build and deployment**, choisir la source **GitHub Actions** ;
3. dans l'onglet **Actions**, relancer le workflow *Vérification et déploiement*
   (**Re-run all jobs**).

Tant que ce réglage n'est pas fait, le workflow construit bien le site mais
s'arrête sur un message qui rappelle ces trois étapes. Ensuite, chaque `git push`
met le site à jour tout seul.

### Publier ailleurs

`npm run build` produit un dossier `dist/` entièrement statique, déposable tel
quel sur n'importe quel hébergement (Netlify, Vercel, un serveur de l'école, une
clé USB). Les chemins sont relatifs : le site fonctionne aussi bien à la racine
d'un domaine que dans un sous-dossier.

### Le nom de domaine

Le site répond sur **lesmotsruses.ca**, domaine enregistré chez WHC.

Deux morceaux tiennent cette configuration, et il faut les deux :

- **`public/CNAME`** contient le domaine. Vite le recopie dans `dist/`, il fait
  donc partie de chaque publication. Sans lui, un déploiement peut faire perdre
  le domaine à GitHub, puisque chaque publication remplace tout le contenu.
- **Settings → Pages → Custom domain** enregistre le domaine côté GitHub et
  déclenche l'émission du certificat. Cochez **Enforce HTTPS** une fois le
  certificat obtenu (quelques minutes à quelques heures après la propagation DNS).

Zone DNS chez le registrar :

| Type | Nom | Valeur |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `mjramos86.github.io.` |

Les adresses IP de GitHub Pages sont à revérifier dans leur documentation en cas
de reconfiguration. Pour revenir à l'adresse `github.io`, il suffit de supprimer
`public/CNAME` et de vider le champ *Custom domain*.

---

## Comment fonctionne la prédiction

Tout est calculé dans le navigateur, en une milliseconde environ par frappe.

### 1. Le lexique (`src/lexique/`)
Environ 2 000 entrées écrites à la main (noms, verbes, adjectifs, adverbes,
mots-outils, expressions) sont **fléchies automatiquement** au démarrage :
pluriels, féminins, et conjugaison de chaque verbe au présent, imparfait, futur,
conditionnel, impératif, participes — soit **plus de 14 000 formes**.

| Fichier | Contenu |
| --- | --- |
| `noms.ts`, `verbes.ts`, `mots.ts` | le vocabulaire, en format compact `mot:genre:emoji` |
| `pictogrammes.json` | table mot → pictogramme ARASAAC, produite par `npm run pictogrammes` |
| `frequents.ts` | deux niveaux de fréquence (« cuisine » est plus courant que « caserne ») |
| `contexte.ts` | thèmes, enchaînements de mots fréquents, groupes d'associations |
| `flexion.ts` | pluriels, féminins, conjugueur (groupes 1, 2, -partir, -ouvrir, -attendre, irréguliers) |
| `index.ts` | construction et indexation des formes |

### 2. L'analyse du contexte (`src/prediction/analyse.ts`)
À chaque frappe, l'application repère le mot en cours, le mot précédent, le début
de phrase, puis en déduit **ce que la grammaire attend** (classe de mot, genre,
nombre, personne) et **de quoi parle le texte** (poids par thème, avec un effet
de récence et une saturation douce pour qu'un mot isolé n'impose pas son univers).

### 3. Le classement (`src/prediction/moteur.ts`)
Chaque mot candidat reçoit une note qui combine :

- la qualité de la correspondance (début exact, lettre confondue, ressemblance
  phonétique) ;
- la fréquence du mot dans le langage enfantin ;
- l'enchaînement avec le mot précédent (table de bigrammes + habitudes apprises) ;
- la proximité thématique, pondérée par la **précision du thème** (« fruit »
  compte plus que « objet », qui rassemble des centaines de mots) ;
- l'accord grammatical (bonus si l'accord est juste, malus s'il est faux) ;
- l'habitude personnelle de l'enfant, et une pénalité contre la répétition
  immédiate du mot qui vient d'être écrit.

### 4. La tolérance orthographique (`src/prediction/phonetique.ts`)
Trois recherches en parallèle : le début exact, le début à une erreur près
(lettres visuellement ou phonétiquement confondues, inversion, lettre oubliée ou
en trop), et la **transcription phonétique** du français (« photo » et « foto »
donnent tous deux `FOTO`). Le même module découpe les mots en syllabes pour
l'affichage en couleurs.

---

## Enrichir le vocabulaire

Deux possibilités :

1. **Dans l'application** : Réglages → « Mes mots à moi ». Idéal pour les prénoms
   de la classe ou le vocabulaire d'un projet ; ces mots restent sur l'ordinateur.
2. **Dans le code** : ajouter une ligne dans `src/lexique/noms.ts` (ou
   `verbes.ts`, `mots.ts`). Le format est volontairement compact :

```ts
['fruit', 4, 'pomme:f:🍎 poire:f:🍐 pomme de terre:f:🥔'],
//  thème   fréquence (1 à 5)   mot:genre:emoji[:pluriel irrégulier]
```

Le pluriel, le féminin et la conjugaison sont calculés automatiquement ; il n'y a
donc pas à écrire les formes fléchies. Pour qu'un mot « aille avec » d'autres
(comme *sable* avec *plage*), il suffit de l'ajouter à un groupe de
`ASSOCIATIONS` dans `src/lexique/contexte.ts`.

`npm test` vérifie ensuite que le lexique se construit et que les prédictions
attendues sortent bien en tête.

---

## Droits et licences

Tout ce que le site distribue a été inventorié. Le détail complet, avec les
textes de licence et les avis de copyright, est publié avec le site dans
[`licences.txt`](https://lesmotsruses.ca/licences.txt) — fichier régénéré à
chaque construction par `npm run licences`, à partir des dépendances réelles.

| Élément | Situation |
| --- | --- |
| **Pictogrammes** | ARASAAC — Sergio Palao, Gouvernement d'Aragon, **CC BY-NC-SA**. Attribution affichée au bas de l'application et dans les réglages. |
| **Polices** | Aucune police distribuée : l'application nomme des polices, le système du visiteur fournit les lettres. Aucun appel à un service de polices externe. |
| **Emojis** | Aucune image distribuée : ce sont des caractères Unicode, dessinés par la police du système. |
| **Vocabulaire** | Écrit pour ce projet. Aucune base lexicale tierce incorporée. |
| **Bibliothèques** | 49 composants livrés, tous sous licence permissive (MIT, Apache-2.0, ISC, BlueOak). Aucun copyleft fort : `jszip` est pris sous MIT, `dompurify` sous Apache-2.0. |

⚠️ **La clause NC d'ARASAAC engage le projet** : usage scolaire, familial ou
associatif couvert ; vendre l'outil, l'intégrer à une offre payante ou le
monétiser par la publicité ne l'est pas. Remplacer les pictogrammes serait un
préalable à tout usage commercial.

Le dépôt n'a pas encore de fichier `LICENSE` : le code est donc, par défaut,
« tous droits réservés ». C'est un choix à poser si vous souhaitez ouvrir le
projet aux contributions.

## Vie privée

Textes, réglages, mots ajoutés et habitudes d'écriture sont stockés dans le
`localStorage` du navigateur. Rien n'est envoyé sur un serveur, et l'application
fonctionne sans connexion une fois chargée. Vider les données du navigateur
efface les textes : pensez à exporter les documents importants.

## Limites connues

- La synthèse vocale dépend des voix installées sur l'appareil ; sans voix
  française, la lecture peut être absente ou avoir un accent étranger.
- La police *OpenDyslexic* n'est proposée que si elle est installée sur
  l'ordinateur (aucune police n'est téléchargée depuis un serveur tiers).
- Le lexique couvre le vocabulaire d'un élève de cycle 2 et 3 ; un texte très
  spécialisé demandera des ajouts dans « Mes mots à moi ».
- Les pictogrammes sont associés automatiquement par correspondance exacte de
  mot-clé : c'est fiable, mais cela reste un appariement automatique. Un coup
  d'œil avant une diffusion large ne fait pas de mal, et le fichier de
  corrections est là pour les cas discutables.

## Raccourcis clavier

| Touche | Effet |
| --- | --- |
| ↑ / ↓ | choisir un mot dans la liste |
| Tab | écrire le mot sélectionné |
| Entrée | écrire le mot (si l'option est activée) |
| Échap | masquer la liste et continuer seul |
| Ctrl + Espace | demander de l'aide sans avoir tapé de lettre |
