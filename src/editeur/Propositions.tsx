import { useEffect, useRef } from 'react';
import type { Proposition } from '../prediction/moteur';
import { syllabes } from '../prediction/phonetique';

interface Props {
  propositions: Proposition[];
  selection: number;
  colorationSyllabes: boolean;
  /** Ligne où se trouve le curseur : y = bas de la ligne, hauteur de la ligne. */
  position: { x: number; y: number; hauteurLigne: number } | null;
  onChoisir: (index: number) => void;
  onSurvoler: (index: number) => void;
  onEcouter: (mot: string) => void;
}

/** Le mot découpé en syllabes de couleurs alternées, plus facile à déchiffrer. */
function MotColore({ mot }: { mot: string }) {
  const parties = syllabes(mot);
  return (
    <>
      {parties.map((s, i) => (
        <span key={i} className={i % 2 === 0 ? 'syllabe-a' : 'syllabe-b'}>
          {s}
        </span>
      ))}
    </>
  );
}

export function Propositions({ propositions, selection, colorationSyllabes, position, onChoisir, onSurvoler, onEcouter }: Props) {
  const liste = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const actif = liste.current?.querySelector('[data-actif="oui"]');
    actif?.scrollIntoView({ block: 'nearest' });
  }, [selection]);

  if (!propositions.length || !position) return null;

  // La liste doit rester entièrement visible : ni sous le bord de l’écran,
  // ni par-dessus la barre d’outils. On choisit le côté le plus dégagé et on
  // limite la hauteur de la liste au lieu de la déplacer n’importe où.
  const largeur = 290;
  const marge = 10;
  const hauteurCadre = 86; // entête + ligne d’explication
  const x = Math.min(Math.max(marge, position.x - 12), window.innerWidth - largeur - marge);
  const hautLigne = position.y - position.hauteurLigne;
  const espaceBas = window.innerHeight - position.y - marge;
  const espaceHaut = hautLigne - marge;
  const versLeHaut = espaceBas < 200 && espaceHaut > espaceBas;
  const hauteurListe = Math.max(96, (versLeHaut ? espaceHaut : espaceBas) - hauteurCadre - 6);
  const placement = versLeHaut
    ? { bottom: window.innerHeight - hautLigne + 6 }
    : { top: position.y + 6 };

  return (
    <div className="propositions" id="liste-propositions" style={{ left: x, width: largeur, ...placement }} role="listbox" aria-label="Propositions de mots">
      <div className="propositions-entete">
        <span>Choisis ton mot</span>
        <kbd>Tab</kbd>
      </div>
      <ul ref={liste} style={{ maxHeight: hauteurListe }}>
        {propositions.map((p, i) => (
          <li key={p.forme}>
            <button
              type="button"
              id={`proposition-${i}`}
              data-actif={i === selection ? 'oui' : 'non'}
              className={'proposition' + (i === selection ? ' active' : '') + (p.approche ? ' approche' : '')}
              onMouseDown={(e) => { e.preventDefault(); onChoisir(i); }}
              onMouseEnter={() => onSurvoler(i)}
              title={p.raison}
              role="option"
              aria-selected={i === selection}
            >
              <span className="illustration" aria-hidden="true">{p.emoji}</span>
              <span className="mot">{colorationSyllabes ? <MotColore mot={p.forme} /> : p.forme}</span>
              <span className="rang">{i + 1}</span>
            </button>
            <button
              type="button"
              className="ecouter"
              title={`Écouter « ${p.forme} »`}
              aria-label={`Écouter le mot ${p.forme}`}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onEcouter(p.forme); }}
            >
              🔊
            </button>
          </li>
        ))}
      </ul>
      <p className="propositions-aide">{propositions[selection]?.raison ?? 'Continue à écrire ou clique sur un mot'}</p>
    </div>
  );
}
