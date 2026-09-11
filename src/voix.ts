/**
 * Synthèse vocale : entendre un mot avant de le choisir aide l’enfant
 * à vérifier que c’est bien celui qu’il cherche.
 */
let voixFr: SpeechSynthesisVoice | null = null;
let initialise = false;

function choisirVoix(): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === 'undefined') return null;
  const voix = speechSynthesis.getVoices();
  if (voix.length === 0) return null;
  return (
    voix.find((v) => v.lang.startsWith('fr') && /female|femme|amelie|audrey|marie/i.test(v.name)) ??
    voix.find((v) => v.lang.startsWith('fr')) ??
    null
  );
}

export function preparerVoix() {
  if (initialise || typeof speechSynthesis === 'undefined') return;
  initialise = true;
  voixFr = choisirVoix();
  speechSynthesis.addEventListener('voiceschanged', () => { voixFr = choisirVoix(); });
}

export function voixDisponible(): boolean {
  return typeof speechSynthesis !== 'undefined';
}

export function dire(texte: string, vitesse = 0.9) {
  if (!voixDisponible() || !texte.trim()) return;
  preparerVoix();
  speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(texte);
  message.lang = 'fr-FR';
  message.rate = vitesse;
  message.pitch = 1;
  if (voixFr) message.voice = voixFr;
  speechSynthesis.speak(message);
}

export function taire() {
  if (voixDisponible()) speechSynthesis.cancel();
}
