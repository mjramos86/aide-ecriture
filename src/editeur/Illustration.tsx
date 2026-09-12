import { useEffect, useState } from 'react';
import { pictogrammeDe, urlPictogramme } from '../lexique/pictogrammes';
import type { Parametres } from '../parametres';

interface Props {
  emoji: string;
  lemme: string;
  /** Le mot se prête mal à un emoji (« avant », « peur », « parce que »). */
  abstrait: boolean;
  mode: Parametres['illustrations'];
}

/**
 * Illustration d’un mot proposé : pictogramme ARASAAC quand il en existe un
 * et qu’il apporte quelque chose, emoji sinon. Si l’image manque — dépôt sans
 * pictogrammes, ou hors connexion — on retombe sur l’emoji sans rien casser.
 */
export function Illustration({ emoji, lemme, abstrait, mode }: Props) {
  const [echec, setEchec] = useState(false);
  useEffect(() => setEchec(false), [lemme]);

  const souhaite = mode === 'pictogramme' || (mode === 'mixte' && abstrait);
  const id = souhaite ? pictogrammeDe(lemme) : undefined;

  if (id !== undefined && !echec) {
    return (
      <img
        className="illustration picto"
        src={urlPictogramme(id)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={() => setEchec(true)}
      />
    );
  }
  return (
    <span className="illustration" aria-hidden="true">
      {emoji}
    </span>
  );
}
