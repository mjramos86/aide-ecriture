# Mots Malins 🦊

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
- **Propositions dès la 1ʳᵉ lettre**, avec une illustration à côté de chaque mot.
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

**Adresse du site : <https://mjramos86.github.io/aide-ecriture/>**

À chaque `git push`, le workflow `.github/workflows/deploiement.yml` :

1. installe les dépendances, vérifie les types, lance `npm test` et construit le site ;
2. **publie le résultat sur GitHub Pages** — uniquement si la branche envoyée est la
   branche par défaut du dépôt. Les autres branches et les pull requests sont
   vérifiées, mais rien n'est mis en ligne.

La première exécution active GitHub Pages toute seule. Si l'organisation ou le
compte l'interdit, il suffit de l'activer à la main une fois :
**Settings → Pages → Build and deployment → Source : GitHub Actions**, puis de
relancer le workflow (onglet **Actions** → *Vérification et déploiement* →
*Re-run jobs*).

### Publier ailleurs

`npm run build` produit un dossier `dist/` entièrement statique, déposable tel
quel sur n'importe quel hébergement (Netlify, Vercel, un serveur de l'école, une
clé USB). Les chemins sont relatifs : le site fonctionne aussi bien à la racine
d'un domaine que dans un sous-dossier.

### Nom de domaine personnalisé

Ajouter un fichier `public/CNAME` contenant le domaine (par exemple
`motsmalins.fr`), puis configurer le DNS chez le registrar comme indiqué dans
Settings → Pages.

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
- Les illustrations sont des emojis : concrètes pour les objets et les animaux,
  plus symboliques pour les mots abstraits.

## Raccourcis clavier

| Touche | Effet |
| --- | --- |
| ↑ / ↓ | choisir un mot dans la liste |
| Tab | écrire le mot sélectionné |
| Entrée | écrire le mot (si l'option est activée) |
| Échap | masquer la liste et continuer seul |
| Ctrl + Espace | demander de l'aide sans avoir tapé de lettre |
