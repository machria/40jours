/**
 * Convention de translittération de l'arabe utilisée sur le site.
 * - ʿ (ʿayn) et ʾ (hamza) sont toujours distingués ; la hamza n'est pas notée en début de mot.
 * - Voyelles longues : ā ī ū. Lettres emphatiques / gutturales : ḥ ṣ ḍ ṭ ẓ.
 * - Consonne doublée = shadda. Article assimilé devant les lettres solaires (Ar-Raḥmān).
 */
export interface PhoneticSymbol {
    signe: string;
    arabe: string;
    prononciation: string;
    exemples: string;
}

export const PHONETIC_SYMBOLS: PhoneticSymbol[] = [
    { signe: 'ʿ', arabe: 'ع', prononciation: "ʿAyn : son guttural profond, en resserrant le fond de la gorge. Ne pas confondre avec ʾ.", exemples: 'Al-ʿAzīz, As-Samīʿ' },
    { signe: 'ʾ', arabe: 'ء', prononciation: "Hamza : coup de glotte, brève coupure de la voix comme dans « oh ! oh ! ». Non notée en début de mot.", exemples: 'Al-Muʾmin, Al-Bāriʾ' },
    { signe: 'ā ī ū', arabe: 'ـَا ـِي ـُو', prononciation: 'Voyelle longue : on la tient deux temps.', exemples: 'Al-Mājid ≠ Al-Majīd' },
    { signe: 'ḥ', arabe: 'ح', prononciation: 'H soufflé, venant du milieu de la gorge (le h simple ه est léger, comme dans « hello »).', exemples: 'Al-Ḥakīm ≠ Al-Hādī' },
    { signe: 'kh', arabe: 'خ', prononciation: 'Comme la « jota » espagnole.', exemples: 'Al-Khāliq' },
    { signe: 'gh', arabe: 'غ', prononciation: 'Comme un R grasseyé (« Paris »).', exemples: 'Al-Ghafūr' },
    { signe: 'q', arabe: 'ق', prononciation: "K profond : l'arrière de la langue touche la luette.", exemples: 'Al-Qahhār' },
    { signe: 'th', arabe: 'ث', prononciation: 'Comme le « th » anglais de « think ».', exemples: 'Al-Wārith' },
    { signe: 'dh', arabe: 'ذ', prononciation: 'Comme le « th » anglais de « this ».', exemples: 'Al-Mudhill' },
    { signe: 'sh', arabe: 'ش', prononciation: 'Comme le « ch » de « chat ».', exemples: 'Ash-Shakūr' },
    { signe: 'ṣ', arabe: 'ص', prononciation: 'S emphatique, prononcé « lourd ».', exemples: 'Aṣ-Ṣamad' },
    { signe: 'ḍ', arabe: 'ض', prononciation: 'D emphatique, son propre à l\'arabe.', exemples: 'Al-Qābiḍ' },
    { signe: 'ṭ', arabe: 'ط', prononciation: 'T emphatique.', exemples: 'Al-Bāsiṭ' },
    { signe: 'ẓ', arabe: 'ظ', prononciation: 'DH emphatique.', exemples: 'Aẓ-Ẓāhir' },
    { signe: 'ff, yy…', arabe: 'ّ', prononciation: 'Consonne doublée (shadda) : on appuie sur la consonne.', exemples: 'Al-Ghaffār, Al-Qawiyy' },
    { signe: 'Ar-, As-, Aṣ-…', arabe: 'الـ', prononciation: "Devant certaines lettres (dites solaires), le « l » de l'article se fond dans la lettre suivante : on écrit comme on prononce.", exemples: 'Ar-Raḥmān, Aṣ-Ṣabūr' },
];
