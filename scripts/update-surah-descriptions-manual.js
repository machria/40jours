const fs = require('fs');
const path = require('path');

const surahsPath = path.join(__dirname, '../data/surahs.json');

const corrections = {
    "44": "Avertir de l'imminence du châtiment (fumée) tout en rappelant la miséricorde de la révélation nocturne.",
    "45": "Confirmer les signes d'Allah dans l'univers et dénoncer l'orgueil de ceux qui refusent la vérité.",
    "46": "Confirmer que le Coran est un miracle entendu par les djinns, avertir contre l'orgueil (comme 'Âd) et exhorter à la piété filiale.",
    "47": "Encourager le jihâd avec sincérité, démasquer les hypocrites et promettre la victoire aux endurants.",
    "48": "Confirmer que le traité de Hudaybiyya est une victoire divine éclatante et encourager la foi et la patience.",
    "49": "Établir l'étiquette islamique pour préserver l'unité, le respect du Prophète ﷺ et éviter les maux sociaux comme la médisance.",
    "50": "Rappeler la proximité d'Allah (veine jugulaire), l'enregistrement des actes par les anges et la réalité inéluctable de la résurrection.",
    "51": "Lier les signes de la nature (les vents) à la vérité de la résurrection et rappeler que la subsistance dépend d'Allah seul.",
    "52": "Avertir du châtiment inévitable par des serments puissants et confirmer que le Prophète ﷺ est un véritable avertisseur.",
    "53": "Confirmer la prophétie de Muḥammad ﷺ par la vision du Mi‘râj, réfuter les accusations de poésie et appeler au monothéisme pur.",
    "54": "Prouver la prophétie par le miracle de la lune fendue et avertir que l'Heure est proche à travers le rappel des châtiments passés.",
    "55": "Célébrer la miséricorde du Tout-Miséricordieux et ses bienfaits infinis, en incitant les hommes et les djinns à la gratitude.",
    "56": "Dépeindre l'Heure inévitable et les destinées des trois groupes d'âmes, incitant à la piété pour éviter le châtiment.",
    "57": "Encourager la dépense et l'effort pour Allah avec sincérité, tout en rappelant que le fer est une force au service de la foi.",
    "58": "Protéger les droits des femmes (abolition du ẓihâr), enseigner le respect du Prophète ﷺ et démasquer les complots des hypocrites.",
    "59": "Légitimer l'expulsion des traîtres (Banû Naḍîr), établir les règles du butin et glorifier Allah par Ses plus beaux noms.",
    "60": "Tester la foi des émigrantes, interdire l'alliance avec les ennemis d'Allah, tout en maintenant la justice envers ceux qui ne combattent pas.",
    "61": "Exhorter les croyants à s'unir en rangs serrés pour la cause d'Allah et rappeler la bonne annonce faite par Jésus.",
    "62": "Instituer la prière du Vendredi (Jumu‘a), rappeler l'universalité de la prophétie et l'importance de la discipline collective.",
    "63": "Démasquer l'hypocrisie, mettre en garde contre les serments mensongers et appeler à dépenser ses richesses avant la mort.",
    "64": "Rappeler que le Jour du Jugement est un jour de gain et de perte mutuelle, et encourager la confiance totale en Allah.",
    "65": "Réglementer le divorce avec justice, protéger les droits des femmes pendant la période d'attente ('idda) et encourager la confiance en la providence divine.",
    "66": "Lever l'interdiction que le Prophète ﷺ s'était imposée, rappeler les exemples des femmes pieuses et impies, et prôner l'unité familiale."
};

try {
    const surahs = JSON.parse(fs.readFileSync(surahsPath, 'utf8'));
    let updatedCount = 0;

    const updatedSurahs = surahs.map(surah => {
        const id = surah.number.toString();
        if (corrections[id]) {
            surah.description = corrections[id];
            updatedCount++;
        }
        return surah;
    });

    fs.writeFileSync(surahsPath, JSON.stringify(updatedSurahs, null, 2), 'utf8');
    console.log(`Successfully manually updated ${updatedCount} surahs.`);

} catch (e) {
    console.error('Error updating surahs:', e);
}
