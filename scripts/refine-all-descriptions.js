const fs = require('fs');
const path = require('path');

const surahsPath = path.join(__dirname, '../data/surahs.json');

const manualCorrections = {
    "32": "Affirmer le tawḥîd créateur, la prophétie de Muḥammad ﷺ et la résurrection, en appelant à la prosternation reconnaissante.",
    "34": "Avertir contre l’ingratitude face à la prospérité par orgueil, en montrant que les bienfaits divins exigent tawḥîd et humilité.",
    "39": "Inviter au repentir et au libre choix, avertissant des groupes au Jour du Jugement tout en affirmant la miséricorde d'Allah.",
    "40": "Inviter au repentir par la miséricorde infinie d'Allah, avant le jugement inéluctable, illustré par le récit de Mûsâ et Pharaon.",
    "41": "Affirmer que le Coran est un guide explicite, avertissant des châtiments passés et invitant à la prosternation.",
    "42": "Lier le tawḥîd à la consultation (Shura), montrant que la révélation continue et appelant à l'unité et la justice parmi les croyants.",
    "43": "Réfuter le polythéisme et les superstitions, en opposant les ornements de ce monde au Paradis des pieux.",
    "69": "Dépeindre l'Heure comme inévitable en s'appuyant sur les châtiments passés, et affirmer que le Coran est une vérité éternelle.",
    "70": "Affirmer l'imminence de l'Heure, dépeindre les pieux comme modèles et avertir des châtiments réservés aux incrédules.",
    "72": "Prouver que le Coran est un miracle universel adressé aux djinns et aux humains, et affirmer la continuité de la prophétie.",
    "73": "Ordonner la prière nocturne et la récitation du Coran en préparation à la mission prophétique, et encourager à la patience.",
    "74": "Lancer la mission publique du Prophète ﷺ, le purifier spirituellement, et avertir les chefs mécréants.",
    "75": "Réfuter l'impossibilité de la résurrection, dépeindre l'Heure de manière terrifiante et confirmer l'authenticité du Coran.",
    "76": "Récompenser les pieux qui libèrent les captifs, dépeindre le Paradis et rappeler que la vie est une épreuve de choix.",
    "77": "Avertir de l'imminence de l'Heure par des serments sur la création et montrer les destinées opposées des croyants et des non-croyants.",
    "78": "Annoncer la Grande Nouvelle (l'Heure), montrer les signes de la création comme preuves et présenter les destinées éternelles.",
    "79": "Ancrer la certitude de la Résurrection et briser l’illusion de puissance des tyrans, en montrant que l’ordre divin est inéluctable.",
    "81": "Frapper le cœur par la description du bouleversement final de l'univers et asseoir la crédibilité du message révélé.",
    "82": "Dépeindre la rupture du cosmos lors de l'Heure et l'incrédulité de l'homme face à l'évidence du jugement.",
    "83": "Condamner la fraude, annoncer les registres éternels et montrer le contraste entre les consciences pieuses et coupables.",
    "84": "Décrire la fissure du cosmos lors de l'Heure et la pesée des actes, menant à des destinées contrastées.",
    "85": "Consoler les persécutés, affirmer la préservation du Coran et encourager à la patience en attendant la justice divine.",
    "86": "Lier le mystère de la création à la certitude du jugement, et appeler à la réflexion sur la destinée humaine.",
    "87": "Louer le Très-Haut, proposer le Prophète ﷺ comme modèle et montrer les voies contrastées du rappel et de l'oubli.",
    "88": "Dépeindre le contraste saisissant de l'Heure entre les visages heureux et les visages humiliés, et appeler à la réflexion.",
    "90": "Définir la vie comme une lutte et une épreuve, appelant à gravir la pente vertueuse de la générosité et de la foi.",
    "96": "Initier la révélation par l'ordre de lire, liant la science à la générosité divine et mettant en garde contre l'autosuffisance.",
    "103": "Jurer par le temps que l'homme est en perdition, sauf ceux qui unissent la foi, l'action bonne et l'exhortation mutuelle.",
    "107": "Dénoncer le culte vide de sens et l'avarice sociale, en liant la prière négligée au refus d'aider son prochain."
};

try {
    const surahs = JSON.parse(fs.readFileSync(surahsPath, 'utf8'));
    let updatedCount = 0;

    const updatedSurahs = surahs.map(surah => {
        let desc = surah.description || "";

        // 1. Apply manual corrections first
        if (manualCorrections[surah.number.toString()]) {
            surah.description = manualCorrections[surah.number.toString()];
            updatedCount++;
            return surah;
        }

        // 2. Automated cleanups
        // Remove leading "D'" or "De " or "d'" which comes from "Le but est d'..."
        if (desc.startsWith("D'") || desc.startsWith("d'")) {
            desc = desc.substring(2);
            // Capitalize next char
            desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        } else if (desc.startsWith("De ") || desc.startsWith("de ")) {
            desc = desc.substring(3);
            desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        }

        // Fix specific grammatical awkwardness if extracted
        // e.g. "Maqṣad..." still lurking?
        if (desc.startsWith("Maqṣad ")) {
            desc = desc.substring(7);
            desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        }

        surah.description = desc;
        return surah;
    });

    fs.writeFileSync(surahsPath, JSON.stringify(updatedSurahs, null, 2), 'utf8');
    console.log(`Successfully refined surah descriptions.`);

} catch (e) {
    console.error('Error updating surahs:', e);
}
