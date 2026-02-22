import { getLetterAudioUrl, getExampleAudioUrl } from '@/lib/audioUrls';

export const playPronunciation = (input: string) => {
    // List of known letter IDs that have local audio files
    const knownLetters = [
        'alif', 'ba', 'ta', 'tha', 'jim', 'ha', 'kha', 'dal', 'dhal', 'ra', 'zay',
        'sin', 'shin', 'sad', 'dad', 'ta_emph', 'dha_emph', 'ayn', 'ghayn', 'fa',
        'qaf', 'kaf', 'lam', 'mim', 'nun', 'ha_mem', 'waw', 'ya'
    ];

    // Mapping of Arabic text to local filenames for lesson examples
    const lessonExamples: { [key: string]: string } = {
        // Original lessons
        'بَ': 'ba', 'تَ': 'ta', 'دَ': 'da',
        'بِ': 'bi', 'تِ': 'ti', 'دِ': 'di',
        'بُ': 'bou', 'تُ': 'tou', 'دُ': 'dou',
        'أَبْ': 'ab', 'أَتْ': 'at', 'أَدْ': 'ad', // SUKUN CORRECTED
        'بَا': 'baa', 'بُو': 'bouu', 'بِي': 'bii',
        'بً': 'ban', 'بٍ': 'bin', 'بٌ': 'boun',
        'رَبّ': 'rabb', 'إِنّ': 'inna',

        // Expanded Tajweed - Makharij
        'ء': 'hamza_halq',
        'ع': 'ayn_halq',
        'غ': 'ghayn_halq',
        'ق': 'qaf_lissan',
        'ج': 'jim_lissan',
        'م': 'mim_shafatayn',

        // Expanded Tajweed - Sifat
        'ف': 'fa_hams',
        'ب': 'ba_jahr',
        'ص': 'sad_istila',
        'س': 'sin_istifal',
        'قْ': 'qaf_qalqala',
        'ز': 'zay_safir',

        // Expanded Tajweed - Nun Sakina
        'مَنْ آمَنَ': 'man_amana',
        'عَلِيمٌ حَكِيمٌ': 'alimoun_hakim',
        'مَنْ يَقُولُ': 'may_yaqoulu',
        'مِنْ رَبِّهِمْ': 'mir_rabbihim',
        'مِنْ بَعْدِ': 'mim_badi',
        'أَنْفُسَهُمْ': 'anfusahum',
        'مِنْ شَرِّ': 'min_sharri',

        // New Al-Madd Examples
        'بَاب': 'bab',
        'حُوت': 'hout',
        'تِين': 'tin'
    };

    if (knownLetters.includes(input)) {
        // Play local file for letters
        const audio = new Audio(getLetterAudioUrl(input));
        audio.play().catch(e => console.error("Audio playback failed", e));
    } else if (lessonExamples[input]) {
        // Play local file for lesson examples
        const audio = new Audio(getExampleAudioUrl(lessonExamples[input]));
        audio.play().catch(e => console.error("Audio playback failed", e));
    } else {
        console.warn(`No audio file found for: ${input}`);
    }
};
