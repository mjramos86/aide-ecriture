import { useEffect, useRef } from 'react';
import type { Proposition } from '../prediction/moteur';
import { syllabes } from '../prediction/phonetique';

interface Props {
  propositions: Proposition[];
  selection: number;
  colorationSyllabes: boolean;
  position: { x: number; y: number } | null;
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

  // On garde la liste dans l’écran, même près du bord droit ou du bas
  const largeur = 290;
  const x = Math.min(Math.max(8, position.x - 12), window.innerWidth - largeur - 8);
  const hauteurEstimee = Math.min(propositions.length, 8) * 56 + 46;
  const versLeHaut = position.y + hauteurEstimee > window.innerHeight - 10;
  const y = versLeHaut ? Math.max(8, position.y - hauteurEstimee - 28) : position.y + 6;

  return (
    <div className="propositions" id="liste-propositions" style={{ left: x, top: y, width: largeur }} role="listbox" aria-label="Propositions de mots">
      <div className="propositions-entete">
        <span>Choisis ton mot</span>
        <kbd>Tab</kbd>
      </div>
      <ul ref={liste}>
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
