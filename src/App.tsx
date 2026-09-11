import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Editeur } from './editeur/Editeur';
import { Documents } from './documents/Documents';
import { PanneauParametres } from './PanneauParametres';
import { creerDocument, ecrireDocuments, lireDocuments, titreAutomatique, compterMots, type Document } from './documents/store';
import { lireParametres, ecrireParametres, type Parametres } from './parametres';
import { exporter, imprimer, FORMATS, type Format } from './export/exporter';
import { dire, taire, voixDisponible, preparerVoix } from './voix';
import { lexique } from './lexique';

export function App() {
  const [pret, setPret] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [idCourant, setIdCourant] = useState<string | null>(null);
  const [parametres, setParametres] = useState<Parametres>(lireParametres);
  const [panneau, setPanneau] = useState<'aucun' | 'parametres' | 'export'>('aucun');
  const [message, setMessage] = useState<string | null>(null);
  const minuterie = useRef<number | undefined>(undefined);

  // Le dictionnaire (près de 14 000 formes) est construit une seule fois.
  useEffect(() => {
    preparerVoix();
    const t = setTimeout(() => {
      lexique();
      setPret(true);
    }, 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const existants = lireDocuments();
    if (existants.length === 0) {
      const premier = creerDocument('Mon premier texte');
      setDocuments([premier]);
      setIdCourant(premier.id);
      ecrireDocuments([premier]);
    } else {
      setDocuments(existants);
      setIdCourant(existants[0].id);
    }
  }, []);

  useEffect(() => { ecrireParametres(parametres); }, [parametres]);
  useEffect(() => { document.documentElement.dataset.theme = parametres.theme; }, [parametres.theme]);

  const courant = useMemo(() => documents.find((d) => d.id === idCourant) ?? null, [documents, idCourant]);

  /** Enregistrement différé : on écrit dans le navigateur une fois la frappe calmée. */
  const enregistrer = useCallback((liste: Document[]) => {
    window.clearTimeout(minuterie.current);
    minuterie.current = window.setTimeout(() => ecrireDocuments(liste), 400);
  }, []);

  const modifier = useCallback((modifs: Partial<Document>) => {
    setDocuments((liste) => {
      const suivante = liste.map((d) => (d.id === idCourant ? { ...d, ...modifs, modifieLe: Date.now() } : d));
      enregistrer(suivante);
      return suivante;
    });
  }, [idCourant, enregistrer]);

  const changerTexte = useCallback((texte: string) => {
    setDocuments((liste) => {
      const suivante = liste.map((d) => {
        if (d.id !== idCourant) return d;
        const titre = d.titreAuto !== false ? titreAutomatique(texte, d.titre) : d.titre;
        return { ...d, contenu: texte, titre, modifieLe: Date.now() };
      });
      enregistrer(suivante);
      return suivante;
    });
  }, [idCourant, enregistrer]);

  const nouveau = () => {
    const doc = creerDocument();
    const suivante = [doc, ...documents];
    setDocuments(suivante);
    setIdCourant(doc.id);
    ecrireDocuments(suivante);
  };

  const supprimer = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    if (!confirm(`Supprimer « ${doc.titre} » ? Cette action est définitive.`)) return;
    const suivante = documents.filter((d) => d.id !== id);
    setDocuments(suivante);
    ecrireDocuments(suivante);
    if (idCourant === id) setIdCourant(suivante[0]?.id ?? null);
  };

  const dupliquer = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    const copie = { ...creerDocument(`${doc.titre} (copie)`), contenu: doc.contenu, titreAuto: false };
    const suivante = [copie, ...documents];
    setDocuments(suivante);
    setIdCourant(copie.id);
    ecrireDocuments(suivante);
  };

  const telecharger = async (format: Format) => {
    if (!courant) return;
    setPanneau('aucun');
    try {
      await exporter(courant, format);
      annoncer(`Texte téléchargé au format ${format.toUpperCase()}.`);
    } catch {
      annoncer("Le téléchargement n’a pas fonctionné.");
    }
  };

  const annoncer = (texte: string) => {
    setMessage(texte);
    window.setTimeout(() => setMessage(null), 3200);
  };

  const lireTexte = () => {
    if (!courant) return;
    if (speechSynthesis.speaking) { taire(); return; }
    dire(courant.contenu, parametres.vitesseVoix);
  };

  if (!pret || !courant) {
    return (
      <div className="chargement">
        <span className="renard" aria-hidden="true">🦊</span>
        <p>Je prépare ton dictionnaire…</p>
      </div>
    );
  }

  return (
    <div className="application">
      <header className="entete">
        <div className="marque">
          <span aria-hidden="true">🦊</span>
          <span className="marque-nom">Mots Malins</span>
        </div>
        <input
          className="titre-document"
          value={courant.titre}
          aria-label="Titre du texte"
          onChange={(e) => modifier({ titre: e.target.value, titreAuto: false })}
        />
        <div className="actions">
          <span className="compteur">{compterMots(courant.contenu)} mots</span>
          {voixDisponible() && (
            <button type="button" className="bouton" onClick={lireTexte} title="Écouter tout le texte">🔊 Lire</button>
          )}
          <div className="menu">
            <button
              type="button"
              className="bouton"
              aria-expanded={panneau === 'export'}
              onClick={() => setPanneau(panneau === 'export' ? 'aucun' : 'export')}
            >
              ⬇️ Télécharger
            </button>
            {panneau === 'export' && (
              <ul className="menu-liste">
                {FORMATS.map((f) => (
                  <li key={f.id}>
                    <button type="button" onClick={() => telecharger(f.id)}>
                      <b>{f.nom}</b> <code>{f.extension}</code>
                      <em>{f.description}</em>
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => { setPanneau('aucun'); imprimer(courant); }}>
                    <b>Imprimer</b> <code>🖨</code>
                    <em>directement sur papier</em>
                  </button>
                </li>
              </ul>
            )}
          </div>
          <button
            type="button"
            className="bouton"
            onClick={() => setPanneau(panneau === 'parametres' ? 'aucun' : 'parametres')}
            aria-expanded={panneau === 'parametres'}
          >
            ⚙️ Réglages
          </button>
        </div>
      </header>

      <main className="corps">
        <Documents
          documents={documents}
          idCourant={idCourant}
          onOuvrir={setIdCourant}
          onNouveau={nouveau}
          onSupprimer={supprimer}
          onDupliquer={dupliquer}
        />
        <section className="zone-principale">
          <Editeur valeur={courant.contenu} onChangement={changerTexte} parametres={parametres} />
          <p className="astuce">
            Tape une lettre : les mots apparaissent. <kbd>↑</kbd> <kbd>↓</kbd> pour choisir, <kbd>Tab</kbd> pour écrire le mot,
            <kbd>Échap</kbd> pour continuer tout seul, <kbd>Ctrl</kbd>+<kbd>Espace</kbd> pour demander de l’aide.
          </p>
        </section>
        {panneau === 'parametres' && (
          <PanneauParametres parametres={parametres} onChangement={setParametres} onFermer={() => setPanneau('aucun')} />
        )}
      </main>

      {message && <div className="message" role="status">{message}</div>}
    </div>
  );
}
