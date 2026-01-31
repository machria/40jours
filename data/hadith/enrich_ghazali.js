const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'nawawi.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Wisdoms from Imam Al-Ghazali (simplified and adapted for context)
const ghazaliWisdoms = {
    1: "« La volonté est le début de l'action. Si l'intention est sincère pour Allah, l'action devient une lumière. La sincérité (Ikhlas) consiste à oublier le regard des créatures pour ne chercher que le regard du Créateur. » (Hujjat al-Islam Al-Ghazali)",
    2: "« La foi (Iman) n'est pas seulement une parole, mais une lumière projetée dans le cœur qui se manifeste par la soumission (Islam) et culmine dans l'excellence (Ihsan), qui est d'adorer Allah par la présence du cœur. »",
    3: "« Les piliers sont les fondations de la maison, mais la maison a besoin de murs et d'un toit. Les actes surérogatoires et le bon comportement sont ce qui embellit la pratique et protège les fondations. »",
    4: "« Le cœur de l'homme change entre les doigts du Miséricordieux. Ne sois pas arrogant pour ton obéissance, car la fin dépend de la prédestinée, et crains toujours que ton état ne change. L'espoir et la crainte sont les deux ailes du croyant. »",
    5: "« Suivre la Sunnah est la clé du bonheur. Toute 'nouveauté' qui contredit l'esprit de la Loi est un voile entre le serviteur et son Seigneur. La vraie science est celle qui mène à la pratique conforme. »",
    6: "« Le cœur est le roi des membres. S'il est purifié des nourritures illicites et des doutes, les membres obéissent dans le bien. La bouchée illicite assombrit le cœur et empêche la lumière de la sagesse d'y pénétrer. »",
    7: "« La Nasiha (sincérité/bon conseil) est la volonté de bien pour autrui. Celui qui ne souhaite pas pour les musulmans ce qu'il souhaite pour lui-même a une foi incomplète. La religion tout entière est une bienveillance active. »",
    8: "« Le sang et les biens sont sacrés. L'islam est venu préserver la vie. Combattez l'ego (nafs) avant de combattre les ennemis extérieurs, car c'est le plus grand jihad. »",
    9: "« Occupe-toi de ce qui t'est demandé (les obligations) et ne te surcharge pas de questions inutiles qui durcissent le cœur. La facilité est dans la soumission, la difficulté est dans la polémique. »",
    10: "« Une invocation faite avec un corps nourri d'illicite est comme une flèche sans arc. La pureté de la nourriture est la condition de la lumière intérieure et de l'exaucement des prières. »",
    11: "« Le scrupule (Wara') est de délaisser ce qui est douteux pour ce qui est sûr. C'est la station des gens de vérité. Si ton cœur s'agite, c'est un signe ; le péché est ce qui ne te laisse pas en paix. »",
    12: "« La perfection de l'homme réside dans sa concentration sur ce qui lui est utile pour son Au-delà. Se mêler de ce qui ne nous regarde pas disperse le cœur et gaspille le temps, qui est le capital du croyant. »",
    13: "« L'envie (Hasad) mange les bonnes actions comme le feu mange le bois. Aimer pour son frère ce qu'on aime pour soi-même est la guérison de l'égoïsme et la porte de la véritable fraternité. »",
    14: "« La vie humaine est une construction divine. Celui qui la détruit sans droit s'attaque à l'œuvre d'Allah. »",
    15: "« La langue est un petit organe mais ses crimes sont grands. Celui qui croit en Allah doit emprisonner sa langue pour ne dire que du bien, car la plupart des péchés de l'homme proviennent de sa langue. »",
    16: "« La colère est une braise de Satan. Le fort n'est pas celui qui terrasse ses adversaires, mais celui qui se maîtrise lors de la colère. La douceur est la parure du croyant. »",
    17: "« Allah a prescrit l'Excellence (Ihsan) en toute chose. Même dans les actes les plus difficiles, le croyant doit faire preuve de compassion et de perfection. L'Ihsan est de voir Allah en tout acte. »",
    18: "« La crainte d'Allah (Taqwa) est le meilleur vêtement. Si tu commets une faute, efface-la vite par une bonne action, car la lumière dissipe les ténèbres. Et sois bienveillant avec les gens, car le bon caractère pèse lourd dans la balance. »",
    19: "« Sache que si tu es avec Allah, personne ne peut te nuire. La certitude (Yaqin) est de savoir que tout vient d'Allah. Les créatures ne sont que des causes ; le Causateur est Unique. Place ta confiance (Tawakkul) en Lui seul. »",
    20: "« La pudeur (Haya) est une branche de la foi. Si l'homme perd sa pudeur, il perd son humanité et devient capable de tout mal. La pudeur envers Allah en privé est plus grande que la pudeur envers les hommes. »",
    21: "« L'Istiqama (droiture) est plus difficile que la dignité (karama). C'est de rester constant sur l'ordre d'Allah sans dévier, comme une montagne inébranlable. C'est le but ultime du voyageur vers Allah. »",
    22: "« L'assiduité aux obligations est le capital, et les surérogatoires sont les bénéfices. Nul ne peut atteindre Allah sans d'abord remplir Ses obligations. Le chemin du Paradis est pavé d'obéissance simple et constante. »",
    23: "« La pureté n'est pas seulement celle du corps, mais celle du cœur. Le Coran sera un témoin : soit il témoignera que tu l'as mis en pratique, soit il témoignera de ton abandon. Chaque jour est une nouvelle opportunité de libérer ton âme des passions. »",
    24: "« Oserais-tu opprimer les serviteurs d'Allah alors qu'Allah Lui-même s'est interdit l'injustice ? Sache que l'injustice dans ce monde sera ténèbres au Jour du Jugement. Sois miséricordieux envers les créatures, tu recevras la miséricorde du Créateur. »",
    25: "« La générosité ne dépend pas de la richesse, mais de la grandeur de l'âme. Tout bienfait envers une créature est une aumône (Sadaqa). Le sourire, la bonne parole, et l'aide sont des trésors accessibles à tous. »",
    26: "« Remercier Allah pour chaque articulation de ton corps se fait en utilisant ce corps pour le bien. Chaque mouvement pour aider autrui est une gratitude en action. »",
    27: "« Consulte ton cœur. Le péché laisse une tache et un malaise, tandis que le bien apporte lumière et apaisement. La conscience morale est le messager d'Allah en toi. »",
    28: "« Accroche-toi à la Sunnah quand les temps deviennent sombres. La vérité ne se mesure pas au nombre de ses suiveurs mais à sa conformité avec la révélation. L'innovation est une errance loin de la lumière prophétique. »",
    29: "« La moisson de la langue ! Prends garde à ta langue, elle est la cause de la ruine de beaucoup. Le silence à propos du mal est une sagesse, et le rappel d'Allah est un butin. »",
    30: "« Ne cherche pas à compliquer la religion. Allah a tracé des limites pour te protéger, pas pour te contraindre. Le respect des limites divines est la preuve de l'amour du serviteur pour son Seigneur. »",
    31: "« Le renoncement (Zuhd) n'est pas de ne rien posséder, mais que rien ne te possède. Sors l'amour du monde de ton cœur, et Allah y placera Son amour. Si tu te détaches de ce que les gens convoitent, tu seras libre et respecté. »",
    32: "« Ne cause pas de tort. L'islam est une religion de paix et de sécurité. Celui dont le voisin n'est pas à l'abri de son mal n'a pas une foi complète. »",
    33: "« La justice exige des preuves. Ne juge pas sur des soupçons, car le soupçon est le plus mensonger des discours. Protège l'honneur de ton frère comme tu protèges le tien. »",
    34: "« Changer le mal est un devoir, selon ta capacité. Mais le plus grand changement commence par soi-même. Ne sois pas une chandelle qui éclaire les autres tout en se brûlant elle-même. »",
    35: "« La fraternité est un lien divin. Ne la brise pas par la jalousie ou la haine. Regarde ton frère avec l'œil de la miséricorde, non avec l'œil du jugement. La piété est dans le cœur, et seul Allah connaît les cœurs. »",
    36: "« Celui qui est au service des créatures, Allah est à son service. La voie vers Allah passe par le service de Ses serviteurs. Soulager la peine d'un croyant est plus aimé d'Allah que des années d'adoration isolée. »",
    37: "« La générosité d'Allah est immense. Il récompense la bonne intention même sans l'acte, mais ne punit pas la mauvaise intention tant qu'elle n'est pas commise. Désespère de tes actes, mais ne désespère jamais de Sa grâce. »",
    38: "« La guerre contre les alliés d'Allah (Awliya) est une guerre contre Allah. Rapproche-toi de Lui par ce qu'Il aime (les obligations), puis par ce qui L'attire (les surérogatoires), jusqu'à ce que tu agisses par Lui et pour Lui. »",
    39: "« Allah ne charge pas une âme au-dessus de sa capacité. L'erreur et l'oubli sont pardonnés, c'est là une immense miséricorde. Mais ne fais pas de la négligence une habitude sous prétexte de l'oubli. »",
    40: "« Ce monde est un pont, traverse-le et ne t'y installe pas. Le voyageur sage ne s'encombre pas de bagages inutiles. Prépare-toi pour le voyage éternel comme si tu partais demain. »",
    41: "« La foi complète est de soumettre ses passions à la Révélation. Tant que tu suis tes envies, tu es esclave de toi-même. La liberté véritable est dans la servitude à Allah. »",
    42: "« L'immensité du pardon divin dépasse tes péchés. Ne laisse jamais tes péchés te faire croire que tu es indigne d'Allah. Reviens à Lui, encore et encore. Il est Celui qui accueille le repentir et qui est Miséricordieux. »"
};

const updatedData = data.map(hadith => {
    const wisdom = ghazaliWisdoms[hadith.id];
    if (wisdom) {
        // Add as a structured object
        hadith.commentaries = [
            {
                author: "Imam Al-Ghazali",
                text: wisdom
            }
        ];
    }
    return hadith;
});

fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log("Enrichment Complete: Ghazali commentaries added to " + Object.keys(ghazaliWisdoms).length + " hadiths.");
