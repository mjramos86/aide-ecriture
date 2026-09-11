/**
 * Export des textes dans les formats habituels : TXT, DOCX (Word),
 * PDF, HTML — plus l’impression directe.
 */
import type { Document } from '../documents/store';

// Les bibliothèques Word et PDF ne sont chargées qu'au moment de l'export :
// l'application démarre ainsi sans attendre près d'un mégaoctet de code.

export type Format = 'txt' | 'docx' | 'pdf' | 'html';

export const FORMATS: { id: Format; nom: string; extension: string; description: string }[] = [
  { id: 'docx', nom: 'Word', extension: '.docx', description: 'pour Word, LibreOffice, Google Docs' },
  { id: 'pdf', nom: 'PDF', extension: '.pdf', description: 'pour imprimer ou envoyer' },
  { id: 'txt', nom: 'Texte simple', extension: '.txt', description: 'texte brut, ouvrable partout' },
  { id: 'html', nom: 'Page web', extension: '.html', description: 'à ouvrir dans un navigateur' },
];

function nomFichier(titre: string, extension: string): string {
  const propre = titre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return (propre || 'mon-texte') + extension;
}

function telecharger(contenu: Blob, nom: string) {
  const url = URL.createObjectURL(contenu);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nom;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function paragraphes(texte: string): string[] {
  return texte.split(/\n/);
}

function echapper(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function versDocx(doc: Document): Promise<Blob> {
  const { Document: DocxDocument, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');
  const fichier = new DocxDocument({
    styles: {
      default: {
        document: { run: { font: 'Verdana', size: 26 }, paragraph: { spacing: { line: 400 } } },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            children: [new TextRun({ text: doc.titre, bold: true, size: 36 })],
          }),
          ...paragraphes(doc.contenu).map(
            (ligne) => new Paragraph({ children: [new TextRun({ text: ligne })], spacing: { after: 160 } }),
          ),
        ],
      },
    ],
  });
  return Packer.toBlob(fichier);
}

async function versPdf(doc: Document): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const margeX = 56;
  const margeHaut = 64;
  const largeur = pdf.internal.pageSize.getWidth() - margeX * 2;
  const hauteurPage = pdf.internal.pageSize.getHeight() - margeHaut;
  let y = margeHaut;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  for (const ligne of pdf.splitTextToSize(doc.titre, largeur) as string[]) {
    pdf.text(ligne, margeX, y);
    y += 26;
  }
  y += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(13);
  const interligne = 22;
  for (const paragraphe of paragraphes(doc.contenu)) {
    const lignes = paragraphe.trim() === '' ? [''] : (pdf.splitTextToSize(paragraphe, largeur) as string[]);
    for (const ligne of lignes) {
      if (y > hauteurPage) { pdf.addPage(); y = margeHaut; }
      pdf.text(ligne, margeX, y);
      y += interligne;
    }
  }
  return pdf.output('blob');
}

function versHtml(doc: Document): Blob {
  const corps = paragraphes(doc.contenu)
    .map((l) => (l.trim() === '' ? '<p>&nbsp;</p>' : `<p>${echapper(l)}</p>`))
    .join('\n    ');
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${echapper(doc.titre)}</title>
    <style>
      body { font-family: Verdana, Geneva, sans-serif; font-size: 18px; line-height: 2;
             letter-spacing: 0.05em; word-spacing: 0.2em; max-width: 46rem; margin: 3rem auto;
             padding: 0 1.5rem; color: #2c2620; background: #fdf8ef; }
      h1 { font-size: 1.6em; }
      p { margin: 0 0 1.1em; }
    </style>
  </head>
  <body>
    <h1>${echapper(doc.titre)}</h1>
    ${corps}
  </body>
</html>`;
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

export async function exporter(doc: Document, format: Format): Promise<void> {
  switch (format) {
    case 'txt':
      telecharger(new Blob([doc.contenu], { type: 'text/plain;charset=utf-8' }), nomFichier(doc.titre, '.txt'));
      break;
    case 'html':
      telecharger(versHtml(doc), nomFichier(doc.titre, '.html'));
      break;
    case 'pdf':
      telecharger(await versPdf(doc), nomFichier(doc.titre, '.pdf'));
      break;
    case 'docx':
      telecharger(await versDocx(doc), nomFichier(doc.titre, '.docx'));
      break;
  }
}

/** Ouvre la fenêtre d’impression du navigateur avec le texte mis en page. */
export function imprimer(doc: Document) {
  const fenetre = window.open('', '_blank', 'width=800,height=900');
  if (!fenetre) return;
  const corps = paragraphes(doc.contenu)
    .map((l) => (l.trim() === '' ? '<p>&nbsp;</p>' : `<p>${echapper(l)}</p>`))
    .join('\n');
  fenetre.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${echapper(doc.titre)}</title>
  <style>body{font-family:Verdana,sans-serif;font-size:14pt;line-height:1.9;letter-spacing:.04em;margin:2cm;}
  h1{font-size:1.5em;}p{margin:0 0 .9em;}</style></head>
  <body><h1>${echapper(doc.titre)}</h1>${corps}</body></html>`);
  fenetre.document.close();
  fenetre.focus();
  setTimeout(() => fenetre.print(), 300);
}
