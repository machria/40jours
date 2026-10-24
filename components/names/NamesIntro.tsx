import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Layers, RefreshCw, Trophy } from 'lucide-react';

interface NamesIntroProps {
    onStartCards: () => void;
    onStartQuiz: () => void;
}

function Question({ title, children }: { title: string; children: ReactNode }) {
    return (
        <details className="group border-t first:border-t-0">
            <summary className="flex items-center justify-between gap-2 cursor-pointer list-none py-3 font-medium text-sm [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="pb-4 space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
        </details>
    );
}

/** Texte explicatif affiché sur l'accueil de /99-noms. */
export default function NamesIntro({ onStartCards, onStartQuiz }: NamesIntroProps) {
    return (
        <section className="w-full rounded-2xl border bg-card p-5 space-y-4 text-left">
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">Les plus beaux noms d&apos;Allah</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Allah S&apos;est fait connaître à nous par Ses noms : chacun révèle un aspect de Sa perfection.
                    Les apprendre, c&apos;est apprendre à connaître Celui que l&apos;on adore.
                </p>
                <p className="text-sm font-medium text-foreground">
                    « C&apos;est à Allah qu&apos;appartiennent les noms les plus beaux. Invoquez-Le par ces noms. »
                    <span className="text-xs text-muted-foreground font-normal"> (Al-Aʿrāf, 7:180)</span>
                </p>
            </div>

            <div>
                <Question title="D'où proviennent ces noms ?">
                    <p>
                        Les noms d&apos;Allah ne s&apos;établissent que par le Coran et la Sunna authentique : on ne Lui attribue pas un nom
                        qu&apos;Il ne S&apos;est pas donné. Le Prophète ﷺ a indiqué leur nombre, 99, dans le hadith cité plus haut,
                        mais les recueils d&apos;Al-Bukhārī et de Muslim n&apos;en donnent pas la liste.
                    </p>
                    <p>
                        La liste la plus répandue, utilisée ici, vient d&apos;un hadith rapporté par at-Tirmidhī (n°3507).
                        Pour de nombreux savants, dont at-Tirmidhī lui-même, Ibn Taymiyya et Ibn Ḥajar, cette énumération a été ajoutée par
                        un rapporteur et ne remonte pas au Prophète ﷺ. C&apos;est pourquoi d&apos;autres listes existent, et pourquoi certains
                        noms de cette liste ne figurent pas tels quels dans le Coran : ils sont signalés par le badge « nom tiré du hadith ».
                    </p>
                </Question>

                <Question title="Y en a-t-il plus de 99 ?">
                    <p>
                        Oui. Le Prophète ﷺ invoquait ainsi : « Je Te demande par chaque nom qui T&apos;appartient, par lequel Tu T&apos;es nommé,
                        que Tu as révélé dans Ton Livre, que Tu as enseigné à l&apos;une de Tes créatures, ou que Tu as gardé dans la science
                        de l&apos;invisible auprès de Toi… »
                        <span className="text-xs"> (Aḥmad n°3712, authentifié par al-Albānī)</span>
                    </p>
                    <p>
                        Certains de Ses noms restent donc inconnus des créatures. Le hadith des 99 signifie que, parmi Ses noms, il y en a 99
                        dont le dénombrement mène au Paradis, et non qu&apos;Il n&apos;en a que 99 (an-Nawawī, <em>Sharḥ Ṣaḥīḥ Muslim</em>).
                        Par exemple, Ar-Rabb (le Seigneur), Al-Akram (le Très-Généreux, 96:3) ou Al-Qarīb (le Proche, 11:61) sont des noms
                        authentiques absents de cette liste.
                    </p>
                </Question>

                <Question title="Pourquoi les apprendre ?">
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong className="text-foreground">Une promesse de Paradis</strong> pour celui qui les dénombre, d&apos;après le hadith cité plus haut.</li>
                        <li><strong className="text-foreground">Connaître Allah</strong> : on ne peut aimer, craindre et espérer comme il se doit que Celui que l&apos;on connaît.</li>
                        <li><strong className="text-foreground">Mieux invoquer</strong> : Allah demande qu&apos;on L&apos;invoque par Ses noms (7:180).</li>
                        <li>
                            <strong className="text-foreground">Les vivre au quotidien</strong> : savoir qu&apos;Il est As-Samīʿ incite à surveiller ses paroles,
                            savoir qu&apos;Il est Ar-Razzāq apaise l&apos;inquiétude pour sa subsistance, savoir qu&apos;Il est At-Tawwāb redonne espoir après la faute.
                        </li>
                    </ul>
                    <p>
                        « Les dénombrer » ne se limite pas à les réciter. Ibn al-Qayyim (<em>Badāʾiʿ al-Fawāʾid</em>) en décrit trois degrés :
                        mémoriser leurs mots, comprendre leur sens, puis invoquer Allah par eux.
                    </p>
                </Question>

                <Question title="Comment les apprendre ?">
                    <ol className="list-decimal pl-5 space-y-1.5">
                        <li><strong className="text-foreground">Peu à la fois</strong> : 2 à 3 noms par jour suffisent pour connaître les 99 en 40 jours, au rythme de ta lecture du Coran.</li>
                        <li><strong className="text-foreground">Le sens avant la forme</strong> : sur chaque carte, lis la signification, le verset et la nuance avec les noms proches.</li>
                        <li><strong className="text-foreground">Par familles</strong> : apprendre ensemble les noms proches (miséricorde, pardon, puissance…) aide à bien les distinguer.</li>
                        <li>
                            <strong className="text-foreground">Les employer dans tes invocations</strong> : appelle Allah par le nom qui correspond à ta demande,
                            Ar-Razzāq pour la subsistance, Al-Ghafūr pour le pardon, comme dans la prière « Seigneur… c&apos;est Toi le Dispensateur de dons (Al-Wahhāb) » (3:8).
                        </li>
                        <li><strong className="text-foreground">Réviser</strong> : les cartes pour mémoriser, le quiz pour vérifier, le mode immersif pour méditer.</li>
                    </ol>
                </Question>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
                <button
                    onClick={onStartCards}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90"
                >
                    <RefreshCw className="w-4 h-4" /> Apprendre avec les cartes
                </button>
                <button
                    onClick={onStartQuiz}
                    className="inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-semibold hover:bg-muted/50"
                >
                    <Trophy className="w-4 h-4" /> Quiz
                </button>
                <Link
                    href="/99-noms/feed"
                    className="inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-semibold hover:bg-muted/50"
                >
                    <Layers className="w-4 h-4" /> Mode immersif
                </Link>
            </div>
        </section>
    );
}
