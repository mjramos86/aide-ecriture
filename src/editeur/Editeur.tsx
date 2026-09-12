import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { predire, type Proposition } from '../prediction/moteur';
import type { ContexteEcriture } from '../prediction/analyse';
import { enregistrerChoix } from '../prediction/perso';
import { positionCurseur } from './curseur';
import { Propositions } from './Propositions';
import { dire } from '../voix';
import { pilePolice, type Parametres } from '../parametres';

interface Props {
  valeur: string;
  onChangement: (texte: string) => void;
  parametres: Parametres;
}

interface EtatPrediction {
  propositions: Proposition[];
  contexte: ContexteEcriture | null;
  position: { x: number; y: number; hauteurLigne: number } | null;
  hautLigne: number;
  hauteurLigne: number;
}

const VIDE: EtatPrediction = { propositions: [], contexte: null, position: null, hautLigne: 0, hauteurLigne: 0 };

export function Editeur({ valeur, onChangement, parametres }: Props) {
  const zone = useRef<HTMLTextAreaElement>(null);
  const [etat, setEtat] = useState<EtatPrediction>(VIDE);
  const [selection, setSelection] = useState(0);
  const [masque, setMasque] = useState(false);
  const imageDemandee = useRef(0);

  const calculer = useCallback((forcer = false) => {
    const z = zone.current;
    if (!z) return;
    if (z.selectionStart !== z.selectionEnd) { setEtat(VIDE); return; }
    const { propositions, contexte } = predire(z.value, z.selectionStart, {
      nombre: parametres.nombrePropositions,
      minCaracteres: forcer ? 0 : parametres.minCaracteres,
      motSuivant: forcer || parametres.motSuivant,
      tolerance: parametres.tolerance,
    });
    const p = positionCurseur(z, contexte.debutMot);
    setEtat({ propositions, contexte, position: { x: p.x, y: p.y, hauteurLigne: p.hauteurLigne }, hautLigne: p.hautLigne, hauteurLigne: p.hauteurLigne });
    setSelection(0);
  }, [parametres.nombrePropositions, parametres.minCaracteres, parametres.motSuivant, parametres.tolerance]);

  /** Un seul calcul par image affichée : la frappe reste fluide. */
  const planifier = useCallback((forcer = false) => {
    setMasque(false);
    cancelAnimationFrame(imageDemandee.current);
    imageDemandee.current = requestAnimationFrame(() => calculer(forcer));
  }, [calculer]);

  useLayoutEffect(() => { planifier(); }, [valeur, planifier]);
  useEffect(() => () => cancelAnimationFrame(imageDemandee.current), []);

  const inserer = useCallback((index: number) => {
    const z = zone.current;
    const ctx = etat.contexte;
    const choix = etat.propositions[index];
    if (!z || !ctx || !choix) return;
    const avant = z.value.slice(0, choix.debut);
    let apres = z.value.slice(z.selectionStart);
    let insertion = choix.insertion;
    // Pas d’espace en double si la phrase continue déjà par une espace
    if (insertion.endsWith(' ') && apres.startsWith(' ')) insertion = insertion.slice(0, -1);
    // Ni devant une ponctuation
    if (insertion.endsWith(' ') && /^[,.;:!?…)]/.test(apres)) insertion = insertion.slice(0, -1);
    const nouveau = avant + insertion + apres;
    const curseur = (avant + insertion).length;
    enregistrerChoix(choix.forme, ctx.precedent);
    onChangement(nouveau);
    if (parametres.lireProposition) dire(choix.forme, parametres.vitesseVoix);
    requestAnimationFrame(() => {
      const zz = zone.current;
      if (!zz) return;
      zz.focus();
      zz.setSelectionRange(curseur, curseur);
      planifier();
    });
  }, [etat, onChangement, parametres.lireProposition, parametres.vitesseVoix, planifier]);

  const surTouche = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const nb = etat.propositions.length;
    if (e.key === ' ' && e.ctrlKey) { e.preventDefault(); planifier(true); return; }
    if (masque || nb === 0) {
      if (e.key === 'Escape') setMasque(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelection((s) => (s + 1) % nb);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelection((s) => (s - 1 + nb) % nb);
        break;
      case 'Tab':
        e.preventDefault();
        inserer(selection);
        break;
      case 'Enter':
        if (parametres.validationEntree) { e.preventDefault(); inserer(selection); }
        break;
      case 'Escape':
        e.preventDefault();
        setMasque(true);
        break;
      default:
        break;
    }
  };

  const style = {
    fontFamily: pilePolice(parametres.police),
    fontSize: `${parametres.taille}px`,
    lineHeight: parametres.interligne,
    letterSpacing: `${parametres.espacementLettres}em`,
    wordSpacing: `${parametres.espacementMots}em`,
  };

  return (
    <div className="editeur">
      {parametres.reglette && etat.hauteurLigne > 0 && (
        <div className="reglette" style={{ top: etat.hautLigne, height: etat.hauteurLigne }} aria-hidden="true" />
      )}
      <textarea
        ref={zone}
        className="zone-texte"
        style={style}
        value={valeur}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="sentences"
        placeholder="Écris ton texte ici… Dès la première lettre, des mots te sont proposés."
        aria-label="Zone d’écriture"
        aria-autocomplete="list"
        aria-controls="liste-propositions"
        aria-expanded={!masque && etat.propositions.length > 0}
        aria-activedescendant={!masque && etat.propositions.length > 0 ? `proposition-${selection}` : undefined}
        onChange={(e) => onChangement(e.target.value)}
        onKeyDown={surTouche}
        onKeyUp={(e) => { if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') planifier(); }}
        onClick={() => planifier()}
        onBlur={() => setMasque(true)}
        onFocus={() => planifier()}
      />
      {!masque && (
        <Propositions
          propositions={etat.propositions}
          selection={selection}
          colorationSyllabes={parametres.colorationSyllabes}
          position={etat.position}
          onChoisir={inserer}
          onSurvoler={setSelection}
          onEcouter={(mot) => dire(mot, parametres.vitesseVoix)}
        />
      )}
    </div>
  );
}
