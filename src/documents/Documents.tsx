import type { Document } from './store';
import { compterMots } from './store';

interface Props {
  documents: Document[];
  idCourant: string | null;
  onOuvrir: (id: string) => void;
  onNouveau: () => void;
  onSupprimer: (id: string) => void;
  onDupliquer: (id: string) => void;
}

function dateCourte(t: number): string {
  const d = new Date(t);
  const aujourdhui = new Date();
  const memeJour = d.toDateString() === aujourdhui.toDateString();
  return memeJour
    ? `aujourd’hui ${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function Documents({ documents, idCourant, onOuvrir, onNouveau, onSupprimer, onDupliquer }: Props) {
  return (
    <aside className="documents">
      <div className="documents-entete">
        <h2>Mes textes</h2>
        <button type="button" className="bouton principal petit" onClick={onNouveau}>
          ✏️ Nouveau
        </button>
      </div>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id} className={doc.id === idCourant ? 'actif' : ''}>
            <button type="button" className="document" onClick={() => onOuvrir(doc.id)}>
              <span className="document-titre">{doc.titre || 'Sans titre'}</span>
              <span className="document-info">
                {compterMots(doc.contenu)} mot{compterMots(doc.contenu) > 1 ? 's' : ''} · {dateCourte(doc.modifieLe)}
              </span>
            </button>
            <span className="document-actions">
              <button type="button" title="Faire une copie" aria-label="Faire une copie" onClick={() => onDupliquer(doc.id)}>⧉</button>
              <button type="button" title="Supprimer" aria-label="Supprimer" onClick={() => onSupprimer(doc.id)}>🗑</button>
            </span>
          </li>
        ))}
        {documents.length === 0 && <li className="vide">Aucun texte pour le moment.</li>}
      </ul>
    </aside>
  );
}
