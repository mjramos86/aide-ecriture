/**
 * Synthèse vocale : entendre un mot avant de le choisir aide l’enfant
 * à vérifier que c’est bien celui qu’il cherche.
 *
 * Les voix ne sont pas fournies par l’application : ce sont celles installées
 * sur l’appareil, exposées par le navigateur. Certaines, comme « Google
 * français » dans Chrome ou les voix « Online » d’Edge, sont en réalité
 * synthétisées sur les serveurs de leur éditeur : le texte lu y transite.
 * On leur préfère donc systématiquement une voix locale, et l’enfant ou
 * l’adulte peut de toute façon choisir laquelle utiliser.
 */

/** Une voix proposée à l’utilisateur. */
export interface VoixDisponible {
  /** Identifiant stable, tel que le navigateur le fournit. */
  id: string;
  nom: string;
  langue: string;
  /** La synthèse se fait sur l’appareil, sans rien envoyer sur internet. */
  locale: boolean;
}

let initialise = false;
const abonnes = new Set<() => void>();

export function voixDisponible(): boolean {
  return typeof speechSynthesis !== 'undefined';
}

export function preparerVoix() {
  if (initialise || !voixDisponible()) return;
  initialise = true;
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener('voiceschanged', () => {
    for (const rappel of abonnes) rappel();
  });
}

/** Les voix arrivent parfois après le premier appel : on prévient quand la liste change. */
export function surChangementDeVoix(rappel: () => void): () => void {
  preparerVoix();
  abonnes.add(rappel);
  return () => abonnes.delete(rappel);
}

function voixBrutes(): SpeechSynthesisVoice[] {
  if (!voixDisponible()) return [];
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('fr'));
}

/** Les voix françaises de l’appareil, les locales d’abord. */
export function voixFrancaises(): VoixDisponible[] {
  return voixBrutes()
    .map((v) => ({ id: v.voiceURI, nom: v.name, langue: v.lang, locale: v.localService }))
    .sort((a, b) => Number(b.locale) - Number(a.locale) || a.nom.localeCompare(b.nom, 'fr'));
}

/** Noms évoquant une voix féminine : plus proche de celle d’une enseignante. */
const NOMS_PREFERES = /female|femme|amelie|amélie|audrey|marie|julie|hortense|virginie|chantal/i;

/**
 * Choisit la voix à employer : celle demandée si elle existe, sinon la
 * meilleure voix locale, et seulement en dernier recours une voix distante.
 */
function choisirVoix(idSouhaite?: string): SpeechSynthesisVoice | null {
  const voix = voixBrutes();
  if (voix.length === 0) return null;
  if (idSouhaite) {
    const demandee = voix.find((v) => v.voiceURI === idSouhaite);
    if (demandee) return demandee;
  }
  const locales = voix.filter((v) => v.localService);
  return (
    locales.find((v) => NOMS_PREFERES.test(v.name)) ??
    locales[0] ??
    voix.find((v) => NOMS_PREFERES.test(v.name)) ??
    voix[0] ??
    null
  );
}

/** La voix retenue est-elle synthétisée à distance ? (pour prévenir l’utilisateur) */
export function voixDistante(idSouhaite?: string): boolean {
  const v = choisirVoix(idSouhaite);
  return v !== null && !v.localService;
}

export function dire(texte: string, vitesse = 0.9, idVoix?: string) {
  if (!voixDisponible() || !texte.trim()) return;
  preparerVoix();
  speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(texte);
  message.lang = 'fr-FR';
  message.rate = vitesse;
  message.pitch = 1;
  const voix = choisirVoix(idVoix);
  if (voix) {
    message.voice = voix;
    message.lang = voix.lang;
  }
  speechSynthesis.speak(message);
}

export function taire() {
  if (voixDisponible()) speechSynthesis.cancel();
}
