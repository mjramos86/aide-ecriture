import { useState } from 'react';
import { POLICES, type Parametres } from './parametres';
import { ajouterMot, motsPersonnels, supprimerMot, oublierApprentissage } from './prediction/perso';

interface Props {
  parametres: Parametres;
  onChangement: (p: Parametres) => void;
  onFermer: () => void;
}

const THEMES: { id: Parametres['theme']; nom: string }[] = [
  { id: 'creme', nom: 'Crème' },
  { id: 'clair', nom: 'Blanc' },
  { id: 'bleu', nom: 'Bleu doux' },
  { id: 'sombre', nom: 'Sombre' },
];

function Curseur({ label, valeur, min, max, pas, suffixe, onChange }: {
  label: string; valeur: number; min: number; max: number; pas: number; suffixe?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="reglage">
      <span className="reglage-nom">{label}<b>{valeur}{suffixe}</b></span>
      <input type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Bascule({ label, aide, actif, onChange }: { label: string; aide?: string; actif: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="bascule">
      <input type="checkbox" checked={actif} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {aide && <em>{aide}</em>}
      </span>
    </label>
  );
}

export function PanneauParametres({ parametres, onChangement, onFermer }: Props) {
  const [mots, setMots] = useState(motsPersonnels());
  const [nouveau, setNouveau] = useState('');
  const [emoji, setEmoji] = useState('');
  const maj = (partiel: Partial<Parametres>) => onChangement({ ...parametres, ...partiel });

  const ajouter = () => {
    if (ajouterMot(nouveau.trim(), emoji.trim() || undefined)) {
      setMots(motsPersonnels());
      setNouveau('');
      setEmoji('');
    }
  };

  return (
    <div className="panneau" role="dialog" aria-label="Réglages">
      <header>
        <h2>Réglages</h2>
        <button type="button" className="bouton fermer" onClick={onFermer} aria-label="Fermer les réglages">✕</button>
      </header>

      <section>
        <h3>📖 Lecture et écriture</h3>
        <label className="reglage">
          <span className="reglage-nom">Police</span>
          <select value={parametres.police} onChange={(e) => maj({ police: e.target.value })}>
            {POLICES.map((p) => (
              <option key={p.nom} value={p.nom}>{p.nom} — {p.note}</option>
            ))}
          </select>
        </label>
        <Curseur label="Taille du texte " valeur={parametres.taille} min={14} max={40} pas={1} suffixe=" px" onChange={(taille) => maj({ taille })} />
        <Curseur label="Espace entre les lignes " valeur={parametres.interligne} min={1.2} max={3} pas={0.1} onChange={(interligne) => maj({ interligne })} />
        <Curseur label="Espace entre les lettres " valeur={parametres.espacementLettres} min={0} max={0.3} pas={0.01} onChange={(espacementLettres) => maj({ espacementLettres })} />
        <Curseur label="Espace entre les mots " valeur={parametres.espacementMots} min={0} max={1} pas={0.05} onChange={(espacementMots) => maj({ espacementMots })} />
        <div className="reglage">
          <span className="reglage-nom">Couleur du fond</span>
          <div className="choix-themes">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={'puce-theme ' + t.id + (parametres.theme === t.id ? ' active' : '')}
                onClick={() => maj({ theme: t.id })}
              >
                {t.nom}
              </button>
            ))}
          </div>
        </div>
        <Bascule label="Règle de lecture" aide="surligne la ligne où j’écris" actif={parametres.reglette} onChange={(reglette) => maj({ reglette })} />
        <Bascule label="Syllabes en couleurs" aide="dans la liste des mots proposés" actif={parametres.colorationSyllabes} onChange={(colorationSyllabes) => maj({ colorationSyllabes })} />
      </section>

      <section>
        <h3>💡 Aide aux mots</h3>
        <Curseur label="Nombre de mots proposés " valeur={parametres.nombrePropositions} min={3} max={10} pas={1} onChange={(nombrePropositions) => maj({ nombrePropositions })} />
        <Curseur label="Proposer à partir de " valeur={parametres.minCaracteres} min={1} max={4} pas={1} suffixe=" lettre(s)" onChange={(minCaracteres) => maj({ minCaracteres })} />
        <Bascule label="Deviner le mot suivant" aide="propose un mot avant même la première lettre" actif={parametres.motSuivant} onChange={(motSuivant) => maj({ motSuivant })} />
        <Bascule label="Comprendre l’orthographe approchée" aide="« fotto » trouve « photo », « mézon » trouve « maison »" actif={parametres.tolerance} onChange={(tolerance) => maj({ tolerance })} />
        <Bascule label="Valider aussi avec Entrée" aide="par défaut : la touche Tab" actif={parametres.validationEntree} onChange={(validationEntree) => maj({ validationEntree })} />
      </section>

      <section>
        <h3>🔊 Voix</h3>
        <Bascule label="Dire le mot quand je le choisis" actif={parametres.lireProposition} onChange={(lireProposition) => maj({ lireProposition })} />
        <Curseur label="Vitesse de la voix " valeur={parametres.vitesseVoix} min={0.5} max={1.4} pas={0.05} onChange={(vitesseVoix) => maj({ vitesseVoix })} />
      </section>

      <section>
        <h3>⭐ Mes mots à moi</h3>
        <p className="aide">Ajoute les mots qui te sont utiles et qui ne sont pas dans la liste : prénoms, ton animal, les mots du projet de la classe…</p>
        <div className="ajout-mot">
          <input type="text" value={nouveau} placeholder="un mot" onChange={(e) => setNouveau(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ajouter()} />
          <input type="text" value={emoji} placeholder="🙂" maxLength={4} className="champ-emoji" onChange={(e) => setEmoji(e.target.value)} />
          <button type="button" className="bouton principal" onClick={ajouter}>Ajouter</button>
        </div>
        <ul className="liste-mots">
          {mots.map((m) => (
            <li key={m.forme}>
              <span>{m.emoji ?? '⭐'} {m.forme}</span>
              <button type="button" onClick={() => { supprimerMot(m.forme); setMots(motsPersonnels()); }} aria-label={`Supprimer ${m.forme}`}>🗑</button>
            </li>
          ))}
          {mots.length === 0 && <li className="vide">Aucun mot ajouté.</li>}
        </ul>
        <button
          type="button"
          className="bouton discret"
          onClick={() => { if (confirm('Oublier les habitudes apprises (mots souvent choisis) ? Tes textes et tes mots ajoutés sont conservés.')) oublierApprentissage(); }}
        >
          Réinitialiser l’apprentissage
        </button>
      </section>
    </div>
  );
}
