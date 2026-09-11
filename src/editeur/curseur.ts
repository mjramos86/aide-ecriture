/**
 * Position du curseur de saisie dans une zone de texte, en pixels.
 * On recopie la zone dans un calque invisible et on mesure où tombe
 * le caractère courant : c’est la méthode fiable pour un <textarea>.
 */
const PROPRIETES = [
  'boxSizing', 'width', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
  'wordSpacing', 'lineHeight', 'textTransform', 'textIndent', 'textAlign', 'tabSize',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
] as const;

let calque: HTMLDivElement | null = null;

function obtenirCalque(): HTMLDivElement {
  if (calque) return calque;
  calque = document.createElement('div');
  calque.setAttribute('aria-hidden', 'true');
  Object.assign(calque.style, {
    position: 'absolute',
    top: '0',
    left: '-9999px',
    visibility: 'hidden',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  } as CSSStyleDeclaration);
  document.body.appendChild(calque);
  return calque;
}

export interface PositionCurseur {
  /** Coordonnées dans la page (px), au niveau de la ligne du curseur. */
  x: number;
  y: number;
  hauteurLigne: number;
  /** Position verticale du haut de la ligne courante, relative à la zone. */
  hautLigne: number;
}

export function positionCurseur(zone: HTMLTextAreaElement, index: number): PositionCurseur {
  const div = obtenirCalque();
  const styles = window.getComputedStyle(zone);
  for (const p of PROPRIETES) div.style[p] = styles[p];
  div.style.width = styles.width;

  div.textContent = zone.value.slice(0, index);
  const marque = document.createElement('span');
  marque.textContent = zone.value.slice(index) || '.';
  div.appendChild(marque);

  const hauteurLigne = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.6;
  const rect = zone.getBoundingClientRect();
  const hautLigne = marque.offsetTop - zone.scrollTop;
  return {
    x: rect.left + marque.offsetLeft - zone.scrollLeft,
    y: rect.top + hautLigne + hauteurLigne,
    hauteurLigne,
    hautLigne,
  };
}
