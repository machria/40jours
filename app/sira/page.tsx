'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, BookOpen, Clock, AlignLeft } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { cn } from '@/lib/utils'; // Updated import path to match project standard

type SeerahEvent = {
    title: string;
    commentary: string[];
    notes: string;
    'hijri-date': string;
    start: string;
    end?: string;
};

// Narrative Content Component
const NarrativeView = () => (
    <div className="bg-card border rounded-xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <h2 className="text-4xl font-bold font-kufi text-primary mb-8 text-center">La Grande Fresque : Le Fil d'Or de la Révélation</h2>

            <p className="text-xl leading-relaxed text-muted-foreground mb-12 text-center italic border-l-4 pl-6 border-primary/20 py-2 bg-muted/10 rounded-r-lg">
                "L'Islam n'est pas né au 7ème siècle. C'est le point culminant d'une histoire millénaire, un fil d'or ininterrompu traversant les âges. Voici le récit de cet héritage, tissé à partir des faits authentiques."
            </p>

            {/* SECTION 1 */}
            <section className="relative pl-8 border-l-2 border-primary/20 pb-8">
                <span className="absolute -left-[17px] top-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background">1</span>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Les Racines Anciennes (L'Avant-Prophétie)</h3>

                <div className="space-y-4 text-foreground/90">
                    <p>
                        Tout commence par une promesse dans le désert. <strong>Vers -2000</strong>, deux hommes, un père et son fils, <strong>Ibrahim et Isma'il</strong> (paix sur eux), élèvent les fondations d'une maison cubique dans une vallée aride : la <strong>Ka'bah</strong>. Ils ne la construisent pas pour le commerce, mais comme la <strong>première maison dédiée exclusivement à l'adoration du Dieu Unique</strong>.
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg text-sm border border-primary/10 my-4">
                        <strong className="text-primary block mb-1">📖 Lien Coranique</strong>
                        Le Coran mentionne cette construction fondatrice dans la <strong>Sourate Al-Baqarah (2:127)</strong>.
                    </div>
                    <p>
                        Des siècles s'écoulent. Le flambeau de la prophétie illumine l'histoire : <strong>Musa (Moïse) vers -1400</strong> reçoit la Torah et libère les Enfants d'Israël. Puis vient <strong>'Isa (Jésus) vers -4 av. J.-C.</strong>, né du miracle de Maryam, qui annonce la venue d'un prophète après lui nommé "Ahmad".
                    </p>
                    <p>
                        Mais le temps passe et l'oubli recouvre le message. Au 6ème siècle, la Ka'bah est entourée d'idoles. Pourtant, la lignée d'Isma'il subsiste. Vers <strong>545 ap. J.-C.</strong>, <strong>'Abdul-Muttalib</strong>, le chef de la Mecque, redécouvre le <strong>puits de Zamzam</strong>, cette source bénie qui avait jailli jadis pour Hajar. De son fils <strong>'Abdullah</strong>, connu pour sa beauté et sa grande piété, va naître celui qui changera le monde. Hélas, 'Abdullah meurt en rentrant de Syrie avant même de voir son fils naître, laissant son épouse <strong>Aminah</strong> seule.
                    </p>
                </div>
            </section>

            {/* SECTION 2 */}
            <section className="relative pl-8 border-l-2 border-primary/20 pb-8">
                <span className="absolute -left-[17px] top-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background">2</span>
                <h3 className="text-2xl font-bold mb-6 text-foreground">L'Aube de la Miséricorde (La Mecque 570-622)</h3>

                <div className="space-y-4 text-foreground/90">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-primary mb-2">L'Année de l'Éléphant (570)</h4>
                        <p>
                            Le Yémenite Abraha marche sur la Mecque avec des éléphants pour détruire la Ka'bah. Les Mecquois fuient dans les montagnes. Mais Allah protège Sa Maison en envoyant des nuées d'oiseaux (Ababil) bombardant l'armée d'argile cuite. C'est dans cette année chargée de signes que naît <strong>Muhammad ﷺ</strong> (le 20 avril 571, ou 12 Rabi' al-Awwal).
                        </p>
                        <div className="bg-primary/5 p-4 rounded-lg text-sm border border-primary/10 mt-2">
                            <strong className="text-primary block mb-1">📖 Lien Coranique : Sourate Al-Fil (105)</strong>
                            Décrit précisément la destruction miraculeuse de l'armée de l'éléphant.
                        </div>
                    </div>

                    <p>
                        <strong>Une enfance bénie mais éprouvante</strong> : Confié à la nourrice bédouine <strong>Halima As-Sa'diyyah</strong>, il grandit dans la pureté du désert où a lieu l'événement miraculeux de <strong>l'ouverture de la poitrine</strong> par les anges.
                    </p>
                    <p>
                        Mais les deuils se succèdent : il perd sa mère Aminah à <strong>6 ans</strong> à Abwa, puis son grand-père 'Abdul-Muttalib à <strong>8 ans</strong> (579). Il est alors recueilli par son oncle <strong>Abu Talib</strong>.
                    </p>
                    <p>
                        À <strong>12 ans</strong> (583), lors d'un voyage en Syrie, le moine <strong>Bahira</strong> reconnaît en lui les signes de la prophétie (le sceau entre les épaules) et avertit son oncle : <em>"Protège-le des Romains"</em>.
                    </p>
                    <p>
                        À <strong>20 ans</strong> (591), il participe au <strong>Hilf al-Fudul</strong> (Alliance des Vertueux), jurant de défendre tout opprimé à la Mecque, qu'il soit noble ou étranger.
                    </p>
                    <p>
                        À <strong>25 ans</strong> (595), marié à <strong>Khadijah</strong> (40 ans), il trouve sérénité et soutien. À <strong>35 ans</strong> (605), il résout sagement le conflit de la Pierre Noire, évitant un bain de sang.
                    </p>

                    <div className="my-8 border-y bg-muted/5 py-6 px-4 -mx-4 md:-mx-8 md:px-8">
                        <h4 className="text-xl font-bold text-primary mb-3">La Révélation (610)</h4>
                        <p className="mb-3">
                            À <strong>40 ans</strong>, dans la grotte de Hira, l'Ange Jibril brise le silence : <em>"Iqra !"</em> (Lis !). C'est le début de 23 années de révélation.
                        </p>
                        <p className="mb-3 italic text-muted-foreground border-l-2 pl-4">
                            Khadijah l'apaise et l'emmène voir son cousin <strong>Waraqah ibn Nawfal</strong>, un sage chrétien, qui confirme : "C'est le Namous (l'Archange) qui est venu à Moïse. Tu es le Prophète de cette nation."
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li><strong>3 ans de Da'wah secrète</strong> (610-613) : Les premiers convertis sont Khadijah (femme), Ali (enfant), Zayd (affranchi) et Abu Bakr (homme).</li>
                            <li><strong>Prédication Publique</strong> (613) : Sur le Mont Safa, l'appel retentit. La persécution commence immédiatement.</li>
                        </ul>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                            <div className="bg-background p-3 rounded border">
                                <strong className="block text-primary">Sourate Al-'Alaq</strong>
                                Les 5 premiers versets révélés à Hira.
                            </div>
                            <div className="bg-background p-3 rounded border">
                                <strong className="block text-primary">Sourate Al-Muddathir</strong>
                                L'ordre de se lever et d'avertir (Prédication).
                            </div>
                        </div>
                    </div>

                    <p>
                        La persécution est féroce. Bilal est torturé sous le soleil brûlant. <strong>Sumayyah</strong> devient la première martyre de l'Islam, transpercée par la lance d'Abu Jahl. En <strong>615</strong>, pour sauver les plus faibles, le Prophète envoie un groupe vers l'<strong>Abyssinie</strong>, terre du roi chrétien juste, le Négus.
                    </p>
                    <p>
                        En <strong>616</strong>, un tournant : le puissant <strong>'Umar ibn al-Khattab</strong> embrasse l'Islam. Les musulmans peuvent enfin prier publiquement devant la Ka'bah.
                    </p>
                    <p>
                        Les Quraysh, désespérés, imposent un <strong>Boycott total</strong> (616-619). Pendant 3 ans, les musulmans sont affamés dans le ravin d'Abu Talib, mangeant parfois des feuilles d'arbres.
                    </p>
                    <p>
                        En <strong>619 (L'Année du Chagrin)</strong>, Khadijah et Abu Talib meurent. Sans protection, le Prophète ﷺ se rend à <strong>Ta'if</strong>, mais il est lapidé par la foule. L'Ange des Montagnes lui propose d'écraser la ville, mais il répond : <em>"Non, peut-être qu'Allah fera sortir de leurs reins une descendance qui L'adorera seul."</em>
                    </p>
                    <p>
                        Cette patience est récompensée par le <strong>Voyage Nocturne (Al-Isra' wal-Mi'raj)</strong> en 620. Transporté à Jérusalem puis aux Cieux, il rencontre les prophètes antérieurs et reçoit le cadeau des <strong>5 prières quotidiennes</strong>.
                    </p>
                </div>
            </section>

            {/* SECTION 3 */}
            <section className="relative pl-8 border-l-2 border-primary/20 pb-8">
                <span className="absolute -left-[17px] top-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background">3</span>
                <h3 className="text-2xl font-bold mb-6 text-foreground">L'État de la Foi (Médine 622-632)</h3>

                <div className="space-y-4 text-foreground/90">
                    <p>
                        L'espoir vient de Yathrib (Médine). Après deux serments à 'Aqabah, le Prophète envoie <strong>Mus'ab ibn 'Umair</strong> comme premier ambassadeur pour enseigner l'Islam. La migration est décidée.
                    </p>
                    <p>
                        <strong>Septembre 622 : La Hijrah</strong>. Alors que les assassins encerclent sa maison, le Prophète ﷺ laisse Ali dans son lit et s'échappe avec Abu Bakr. Ils se cachent trois jours dans la <strong>Grotte de Thawr</strong> avant d'atteindre <strong>Quba</strong>, où il bâtit la première mosquée de l'Islam, puis Médine (An 1 de l'Hégire).
                    </p>
                    <p>
                        À Médine, il fonde une société nouvelle basée sur :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>La Mosquée (Masjid an-Nabawi)</strong> : Coeur battant de la cité, où Bilal al-Habachi lance le premier Adhan.</li>
                        <li><strong>La Fraternité (Muwakhaat)</strong> : Partage total des biens entre Émigrés (Muhajirun) et Auxiliaires (Ansar).</li>
                        <li><strong>La Constitution</strong> : Pacte de défense commune incluant les tribus juives.</li>
                    </ul>
                    <div className="bg-primary/5 p-4 rounded-lg text-sm border border-primary/10 mt-2">
                        <strong className="text-primary block mb-1">📖 Lien Coranique : Sourate At-Tawbah (9:40)</strong>
                        Évoque le moment critique dans la grotte de Thawr : "Ne t'attriste pas, Allah est avec nous".
                    </div>

                    <h4 className="text-lg font-bold text-primary mt-6 mb-2">Les Grandes Batailles & Événements</h4>
                    <div className="space-y-4">
                        <div className="border border-l-4 border-l-primary p-4 rounded bg-card/50">
                            <strong>Bataille de Badr (17 Ramadan 2 AH / 624)</strong>
                            <p className="text-sm mt-1">
                                Quelques mois après le <strong>changement de Qibla</strong> (de Jérusalem vers la Ka'bah), 313 croyants mal équipés font face à 1000 guerriers d'élite Quraysh. Les anges descendent en renfort. C'est la première victoire décisive ("Le Jour du Discernement").
                            </p>
                        </div>
                        <div className="border border-l-4 border-l-destructive p-4 rounded bg-card/50">
                            <strong>Bataille d'Uhud (3 AH / 625)</strong>
                            <p className="text-sm mt-1">3000 Mecquois attaquent. Les archers musulmans désobéissent pour le butin, permettant à Khalid ibn al-Walid (alors ennemi) de les prendre à revers. Hamza est martyrisé. Une rumeur annonce la mort du Prophète, mais il a survécu, blessé au visage.</p>
                        </div>
                        <div className="border border-l-4 border-l-primary p-4 rounded bg-card/50">
                            <strong>Bataille du Fossé / Khandaq (5 AH / 627)</strong>
                            <p className="text-sm mt-1">10 000 coalisés assiègent Médine pour l'exterminer. Sur conseil de Salman le Perse, une tranchée est creusée. Après un mois de siège glacial, un vent divin disperse les ennemis.</p>
                        </div>
                        <div className="border border-l-4 border-l-muted p-4 rounded bg-card/50">
                            <strong>Traité de Hudaybiyyah (6 AH / 628)</strong>
                            <p className="text-sm mt-1">Paix de 10 ans signée. Une "Victoire Éclatante" (Fath) qui permet l'envoi de lettres aux empereurs (Héraclius, Khosrô) invitant à l'Islam.</p>
                        </div>
                        <div className="border border-l-4 border-l-primary p-4 rounded bg-card/50">
                            <strong>Conquête de Khaybar (7 AH / 628)</strong>
                            <p className="text-sm mt-1">Prise de la forteresse juive du nord, sécurisant l'économie de Médine. Le Prophète ﷺ épouse Safiyyah bint Huyayy.</p>
                        </div>
                        <div className="border border-l-4 border-l-destructive p-4 rounded bg-card/50">
                            <strong>Bataille de Mu'tah (8 AH / 629)</strong>
                            <p className="text-sm mt-1">3000 musulmans contre 200 000 Byzantins. Trois commandants tombent (Zayd, Ja'far, Ibn Rawaha). Khalid ibn al-Walid, le "Sabre d'Allah", sauve l'armée par une retraite tactique.</p>
                        </div>
                    </div>

                    <p className="mt-6">
                        <strong>Janvier 630 : La Conquête de la Mecque (Fath Makkah)</strong>. Le traité rompu par Quraysh, 10 000 musulmans marchent sur la ville sainte. Elle tombe sans combat. Le Prophète ﷺ pardonne à ses anciens tortionnaires : <em>"Partez, vous êtes libres (Tulaqa)"</em>. Les 360 idoles sont brisées.
                    </p>
                    <p>
                        Plus tard en <strong>630 (9 AH)</strong>, l'expédition de <strong>Tabuk</strong> (30 000 hommes) effraie les Byzantins qui fuient sans combattre. C'est l'<strong>Année des Délégations</strong> : toute l'Arabie envoie ses chefs à Médine pour embrasser l'Islam.
                    </p>
                </div>
            </section>

            {/* SECTION 4 */}
            <section className="relative pl-8 border-l-2 border-primary/20 pb-8">
                <span className="absolute -left-[17px] top-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background">4</span>
                <h3 className="text-2xl font-bold mb-6 text-foreground">L'Adieu et l'Héritage</h3>

                <div className="space-y-4 text-foreground/90">
                    <p>
                        En <strong>632 (10 AH)</strong>, le Prophète ﷺ accomplit son unique Hajj avec plus de 100 000 compagnons. Sur le Mont Arafat, il prononce son <strong>Sermon d'Adieu</strong>, un testament universel :
                    </p>
                    <ul className="list-disc pl-5 mt-2 mb-2 italic text-muted-foreground/90">
                        <li>"Votre sang et vos biens sont sacrés..."</li>
                        <li>"Plus de supériorité de l'Arabe sur le non-Arabe, ni du Blanc sur le Noir, sauf par la piété."</li>
                        <li>"Je vous laisse deux choses : le Livre d'Allah et ma Sunnah."</li>
                        <li>"Craignez Allah concernant les femmes, elles sont un dépôt d'Allah entre vos mains."</li>
                    </ul>
                    <p>
                        Là descend le verset final : <span className="italic text-primary">"Aujourd'hui, J'ai parachevé pour vous votre religion..." (5:3)</span>. Abu Bakr pleure, comprenant que la fin est proche.
                    </p>
                    <p>
                        Quelques mois plus tard, le <strong>8 juin 632</strong> (12 Rabi' al-Awwal 11 AH), affaibli par la fièvre, le Prophète ﷺ rend l'âme dans les bras de son épouse bien-aimée 'Aishah, murmurant : <em>"Le Compagnon Suprême"</em>. Il est enterré à l'endroit même de sa mort.
                    </p>
                </div>
            </section>

            {/* SECTION 5 */}
            <section className="relative pl-8 border-l-2 border-primary/20 pb-8">
                <span className="absolute -left-[17px] top-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background">5</span>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Les Gardiens du Savoir (L'Âge d'Or du Hadith)</h3>

                <div className="space-y-4 text-foreground/90">
                    <p>
                        Le Prophète n'est plus, mais ses paroles demeurent. Une nouvelle génération de géants se lève pour les protéger de l'oubli et du mensonge.
                    </p>
                    <p>
                        <strong>Abu Hurayrah</strong> (m. 679) et <strong>'Aishah</strong> (m. 678) déversent des milliers de hadiths mémorisés. À Médine, l'Imam <strong>Malik</strong> (né en 711) compile <em>Al-Muwatta</em>.
                    </p>
                    <p>
                        Puis vient l'âge d'or de la compilation (9ème siècle). Six hommes voyagent aux confins du monde pour vérifier chaque chaîne de transmission : <strong>Al-Bukhari</strong> (m. 870), <strong>Muslim</strong> (m. 875), <strong>Abu Dawud</strong>, <strong>Al-Tirmidhi</strong>, <strong>Ibn Majah</strong>, et <strong>Al-Nasa'i</strong>. Ils filtrent les pépites d'or du sable de l'histoire.
                    </p>
                    <p className="text-xl font-medium mt-12 text-center text-primary/80">
                        C'est grâce à cette chaîne ininterrompue d'efforts, de sang et d'encre que vous pouvez aujourd'hui, en 2026, ouvrir un livre et lire : <em>"Le Messager d'Allah ﷺ a dit..."</em>, comme si vous étiez assis à ses pieds à Médine.
                    </p>
                </div>
            </section>
        </div>
    </div>
);

export default function SeerahPage() {
    const [events, setEvents] = useState<SeerahEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'narrative'>('narrative');

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await fetch('/data/seerah-fr.json');
                const data = await res.json();
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading seerah:', error);
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const isBC = dateStr.startsWith('-');
        const normalizedDate = isBC ? dateStr.substring(1) : dateStr;
        const date = new Date(normalizedDate);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            if (isBC) {
                const parts = normalizedDate.split('-');
                if (parts.length >= 1) {
                    const dateObj = new Date(normalizedDate);
                    if (isNaN(dateObj.getTime())) return dateStr;
                    return `env. ${Math.abs(dateObj.getFullYear())} av. J.-C.`;
                }
            }
            return date.toLocaleDateString('fr-FR', options);
        } catch (e) {
            return dateStr;
        }
    };

    const getYearFromDate = (dateStr: string) => {
        if (!dateStr) return '';
        const isBC = dateStr.startsWith('-');
        if (isBC) {
            const year = dateStr.split('-')[1];
            return `${year} BC`;
        }
        return dateStr.split('-')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20 md:pl-64">
                <Navigation />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Chargement de la Sira...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pl-64">
            <Navigation />

            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b p-4">
                <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-kufi text-primary">Sira du Prophète ﷺ</h1>
                        <p className="text-sm text-muted-foreground">Biographie du Prophète Muhammad ﷺ</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-muted/50 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('narrative')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    viewMode === 'narrative'
                                        ? "bg-background shadow text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden md:inline">Récit</span>
                            </button>
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    viewMode === 'timeline'
                                        ? "bg-background shadow text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Clock className="w-4 h-4" />
                                <span className="hidden md:inline">Timeline</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    viewMode === 'list'
                                        ? "bg-background shadow text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <AlignLeft className="w-4 h-4" />
                                <span className="hidden md:inline">Liste</span>
                            </button>
                        </div>
                        <Link
                            href="/sira/quiz"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap ml-2"
                        >
                            📝 Quiz
                        </Link>
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-5xl mx-auto">
                {viewMode === 'narrative' && <NarrativeView />}

                {viewMode === 'list' && (
                    /* Content List View */
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {events.map((event, index) => (
                            <div key={index} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    {event.start && (
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground shrink-0">
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                                <Calendar className="w-3 h-3" />
                                                <span className="font-medium">{formatDate(event.start)}</span>
                                                {event.end && (
                                                    <>
                                                        <span>→</span>
                                                        <span className="font-medium">{formatDate(event.end)}</span>
                                                    </>
                                                )}
                                            </div>
                                            <span className="px-2 py-1 bg-primary/10 text-primary rounded font-bold">
                                                {getYearFromDate(event.start)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Commentary */}
                                {event.commentary && event.commentary.length > 0 && (
                                    <div className="text-foreground/90 leading-relaxed mb-4 font-serif text-lg">
                                        <p>{event.commentary.join(' ')}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {event.notes && (
                                    <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-muted/50 flex items-start gap-3">
                                        <BookOpen className="w-4 h-4 mt-1 text-primary/70 shrink-0" />
                                        <span className="text-sm italic text-muted-foreground">{event.notes}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === 'timeline' && (
                    /* Timeline Visual View */
                    <div className="relative space-y-8 pl-8 md:pl-0 before:absolute before:inset-0 before:ml-8 md:before:ml-[50%] before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent animate-in fade-in duration-300">
                        {events.map((event, index) => (
                            <div key={index} className={cn(
                                "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group",
                                "is-active", // Placeholder for actual active state if needed
                            )}>
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary shadow-sm -translate-x-[calc(50%-0.5px)] shrink-0 z-10 group-hover:scale-125 transition-transform" />

                                {/* Date Badge (Desktop Center) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-6 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-full border shadow-sm z-10">
                                    {getYearFromDate(event.start)}
                                </div>

                                {/* Spacer for alternate side */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <div className={cn(
                                    "w-full md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-6 rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all relative",
                                    "md:group-odd:mr-8 md:group-even:ml-8"
                                )}>
                                    {/* Arrow */}
                                    <div className={cn(
                                        "absolute top-6 w-3 h-3 bg-card border-t border-r rotate-45",
                                        "hidden md:block",
                                        "md:group-odd:-right-[7px] md:group-odd:border-t-muted md:group-odd:border-r-muted md:group-odd:border-l-0 md:group-odd:border-b-0",
                                        "md:group-even:-left-[7px] md:group-even:border-l-muted md:group-even:border-b-muted md:group-even:border-t-0 md:group-even:border-r-0 md:group-even:rotate-[225deg]"
                                    )} />

                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-primary">{event.title}</h3>
                                        <div className="md:hidden text-xs font-bold bg-muted px-2 py-1 rounded">{formatDate(event.start)}</div>
                                    </div>

                                    <div className="text-sm text-foreground/80 leading-relaxed mb-3">
                                        {event.commentary && event.commentary.length > 0 && (
                                            <p className="line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                                {event.commentary.join(' ')}
                                            </p>
                                        )}
                                    </div>

                                    {event.notes && (
                                        <div className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                                            {event.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer info (Always visible unless in narrative mode perhaps, but good to keep) */}
                {viewMode !== 'narrative' && (
                    <div className="mt-20 p-6 bg-muted/30 rounded-xl border relative z-10">
                        <h4 className="font-bold text-foreground mb-2">À propos de cette Sira</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            Cette timeline chronologique retrace <strong className="text-foreground">4000 ans d'histoire islamique</strong>,
                            de la construction de la Ka'bah par Ibrahim عليه السلام (2000 avant J.-C.) jusqu'aux grands imams compilateurs
                            de hadiths (915 après J.-C.).
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            La biographie du Prophète Muhammad ﷺ est basée sur le livre
                            <strong className="text-foreground"> "Le Nectar Cacheté" (الرحيق المختوم / Ar-Raheeq Al-Makhtum)</strong>,
                            une référence reconnue pour sa simplicité et son authenticité.
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                            Sources : <a href="https://github.com/OpenIslam/seerah-timeline" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenIslam/seerah-timeline</a> +
                            recherches complémentaires • Traduction française complète
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

