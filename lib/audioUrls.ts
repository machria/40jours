/**
 * Audio URL utilities — supporte le CDN externe via NEXT_PUBLIC_AUDIO_CDN_URL.
 * Si la variable n'est pas définie, les fichiers sont servis depuis /audio/ (local).
 */
const CDN = process.env.NEXT_PUBLIC_AUDIO_CDN_URL ?? '';

/** URL d'un verset coranique (ex: sourate 2, verset 10 → 002010.mp3) */
export function getAyahAudioUrl(surah: number, ayah: number): string {
  const file = `${surah.toString().padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;
  return CDN ? `${CDN}/${file}` : `/audio/${file}`;
}

/** URL d'un fichier audio de lettre arabe (ex: alif.mp3) */
export function getLetterAudioUrl(letter: string): string {
  return CDN ? `${CDN}/letters/${letter}.mp3` : `/audio/letters/${letter}.mp3`;
}

/** URL d'un fichier audio d'exemple tajwid (ex: man_amana.mp3) */
export function getExampleAudioUrl(example: string): string {
  return CDN ? `${CDN}/examples/${example}.mp3` : `/audio/examples/${example}.mp3`;
}
