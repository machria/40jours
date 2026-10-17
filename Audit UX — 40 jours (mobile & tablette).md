# Audit UX — 40 jours (mobile & tablette)

Oct 17, 2026 · @Maj

## Synthèse

Le contenu est riche et la lecture audio synchronisée est un vrai point fort, mais sur mobile le parcours cœur (lire puis valider son jour) casse à trois endroits. 21 constats : 3 bloquants, 10 majeurs, 8 mineurs. Les 3 bloquants se corrigent en moins d'une journée.

**Top 5 des problèmes**

1. Sur mobile, la barre de navigation recouvre les boutons de l'onboarding : « Suivant » ouvre le menu.
2. Sur la page de lecture, la barre audio masque entièrement la navigation du bas.
3. Téléphone en mode sombre = thème mixte avec du texte illisible (réglage Tailwind 4 manquant).
4. Un jour validé réapparaît comme non validé, et la validation sans compte fait perdre le contexte.
5. Création de compte implicite au login : une faute dans l'email crée un compte vide.

**Top 5 des quick wins**

1. Une ligne CSS `@custom-variant dark` pour réparer le mode sombre.
2. Une échelle de z-index et le lecteur audio posé au-dessus de la nav.
3. Retirer la navigation en double sur Sira.
4. Ajouter Communauté et « Partager l'application » au menu.
5. Safe-area iPhone et champs à 16 px.

**Bouton Partager** : pas dans la barre du bas. En tête du menu et en icône sur l'accueil mobile, et surtout aux moments forts : après la validation d'un jour et via un lien d'invitation de groupe (détail plus bas).

## Périmètre & méthode

Audit mené sur l'app locale (localhost:3000) et sur le code du dépôt 40jours. Note : la branche active est `master`, pas `main` (il n'existe pas de branche `main`).

- **Viewports testés** : mobile 375×812 (émulation Android, tactile), tablette 768×1024, desktop.
- **Écrans parcourus** : accueil, onboarding, Jour 1 (lecture), sourates, recherche, social, Hisn, hadith, 99 Noms, sira, prophètes, arabe, login, paramètres, conseils, juz.
- **Mesures** : cibles tactiles (< 40 px de haut), éléments fixes qui se chevauchent, débordement horizontal, contraste en mode sombre, lecture du code des composants clés (`Navigation`, `ReadingClient`, `WelcomeModal`, `PWAInstallPrompt`, `auth.ts`).
- **Non couvert** : test sur vrais appareils iOS (Safari a des comportements propres sur `position: fixed` et le partage), parcours connecté de bout en bout (pas de compte de test utilisé).

## Personas

Quatre profils couvrent les usages que l'app sert réellement : le défi 40 jours (cœur), l'apprentissage (arabe, tajwid), la découverte (feeds, 99 Noms, conseils) et la lecture en groupe. Ce sont des personas d'hypothèse, construits à partir des fonctionnalités, pas d'entretiens utilisateurs.

| Persona | Profil & contexte | Objectif principal | Appareil / moment | Frustrations probables |
| --- | --- | --- | --- | --- |
| **Yasmine, 29 ans — « la régulière »** | Cadre, lit l'arabe correctement, veut finir le Coran avant Ramadan | Lire sa portion du jour en 35-45 min et cocher le jour | iPhone, mode sombre, le soir au lit et dans les transports | Perdre sa place, ne pas savoir si le jour est validé, texte trop petit |
| **Karim, 42 ans — « l'apprenant »** | Lit l'arabe avec difficulté, s'appuie sur la phonétique et l'audio | Comprendre et réciter, avancer même lentement | Android milieu de gamme, écouteurs, pauses midi | Boutons trop petits, barre audio qui masque la navigation, en-tête surchargé |
| **Ines, 19 ans — « la curieuse »** | Étudiante, arrive via un lien partagé sur WhatsApp/Instagram | Découvrir (99 Noms, Sira, conseils), sans s'engager tout de suite | Smartphone, sessions courtes de 3-5 min | Onboarding bloquant, menu à 14 entrées sans hiérarchie, rien ne l'invite à partager |
| **Fatima, 55 ans — « l'animatrice de groupe »** | Organise un cercle de lecture familial ou de mosquée | Faire rejoindre ses proches et suivre leur progression | Tablette Android en portrait + smartphone | Inviter quelqu'un est difficile, création de compte opaque, petit texte |

**Implication pour la suite** : Yasmine et Karim portent le parcours critique (lecture quotidienne) ; Ines et Fatima portent la croissance (acquisition et partage). Le bouton « Partager » doit d'abord servir Fatima et Yasmine, pas uniquement Ines.

## Parcours produits

Le parcours critique — lire et valider son jour — casse sur mobile à trois endroits : l'onboarding, la validation sans compte et le retour le lendemain.

**Parcours 1 — Yasmine, première visite puis lecture quotidienne (mobile)**

| Étape | Ce qu'elle fait | Ce qui se passe | Ressenti |
| --- | --- | --- | --- |
| 1. Arrivée | Ouvre le lien | Modale de bienvenue en 4 étapes, fond flouté | Neutre |
| 2. Onboarding | Tape « Suivant » | Le tap atterrit sur « Menu » (nav par-dessus la modale) ; elle ferme avec la croix | Confusion |
| 3. Accueil | Tape « Commencer le Défi » | Arrive sur Jour 1 | Positif |
| 4. Lecture | Lit, écoute, défile | En-tête de 158 px qui reste collé ; nav du bas masquée par la barre audio ; texte trop petit malgré le réglage | Fatigue |
| 5. Validation | Tape l'icône ✓ ou « Marquer comme Terminé » | Pas de compte : renvoi au login, puis au tableau de bord, pas au jour | Frustration (moment de vérité) |
| 6. Retour J+1 | Rouvre l'app, va sur Jour 1 pour vérifier | Le jour s'affiche « non validé » (état non rechargé) ; le calendrier de l'accueil ne montre rien | Doute |
| 7. Lecture J2 | Bouton « Continuer (Jour 2) » | Fonctionne bien si connectée | Positif |

**Parcours 2 — Karim, lecture accompagnée (Android, écouteurs)**

1. Active Phonétique (bouton de 22 px) puis Mot par Mot : l'en-tête grandit encore.
2. Lance l'audio : le lecteur suit le verset et défile automatiquement — point fort de l'app.
3. Veut passer au menu pour la Citadelle : la nav est cachée, il doit remonter tout en haut et utiliser la flèche.
4. Agrandit le texte dans Paramètres : aucun effet sur la lecture du jour.

**Parcours 3 — Ines, découverte via un lien partagé**

1. Arrive sur un feed (99 Noms) : expérience plein écran soignée, bouton Partager natif — c'est le meilleur écran mobile de l'app.
2. Ouvre le menu : 14 entrées à plat, rien ne dit que le cœur de l'app est le défi 40 jours.
3. Va sur la Sira : double barre de navigation, page qui glisse latéralement.
4. Aucune incitation à partager l'app elle-même ni à commencer le défi.

**Parcours 4 — Fatima, créer un groupe et inviter (tablette)**

1. Cherche « Groupes » dans le menu : absent. Elle le trouve seulement via le tableau de bord, donc après connexion.
2. Crée le groupe, reçoit un code à 6 caractères copiable.
3. Doit coller ce code dans WhatsApp, expliquer où aller et comment rejoindre : 5 étapes pour chaque invité.
4. L'invité doit créer un compte (création implicite au login) puis trouver la page Communauté lui aussi.

**Moments de vérité** : la validation du jour (récompense ou frustration), le retour le lendemain (confiance dans la progression), l'invitation d'un proche (croissance).

## Constats UX détaillés

21 constats, classés par sévérité. **Bloquant** = empêche une tâche ; **Majeur** = la dégrade fortement ; **Mineur** = friction ou finition. Tous ont été vérifiés dans le navigateur ou dans le code (fichier indiqué).

| # | Sévérité | Écran | Constat | Preuve / source |
| --- | --- | --- | --- | --- |
| 1 | Bloquant | Onboarding (mobile) | Les boutons « Suivant » / « Précédent » de la modale de bienvenue sont sous la barre de navigation : un tap sur « Suivant » ouvre en réalité le Menu. | Mesuré à 375 px ; la classe `z-[60]` n'est pas appliquée dans le CSS servi (z-index = auto), la nav est en z-50. `WelcomeModal.tsx` |
| 2 | Bloquant | Lecture du jour (mobile) | La barre audio fixe (h 73 px, z-50) recouvre entièrement la nav du bas : impossible de revenir à l'accueil ou au menu autrement que par la flèche en haut. | `ReadingClient.tsx` footer `fixed bottom-0` + `Navigation.tsx` |
| 3 | Bloquant | Toute l'app (OS en mode sombre) | Thème mixte : les variantes `dark:` suivent le réglage du téléphone alors que les couleurs de fond suivent le réglage de l'app. Résultat : texte clair sur fond crème (ex. bloc thème du jour quasi illisible). | `globals.css` : classe `.dark` mais aucun `@custom-variant dark` (Tailwind 4) |
| 4 | Majeur | Lecture du jour | L'état « Jour validé » n'est pas rechargé : un jour déjà terminé réaffiche « Marquer comme Terminé ». L'utilisateur ne sait pas où il en est. | `ReadingClient.tsx` : `isCompleted` initialisé à `false`, jamais lu depuis `/api/progress` |
| 5 | Majeur | Lecture du jour | Validation sans compte : `signIn()` envoie vers le login sans revenir au jour ; après connexion l'utilisateur atterrit sur `/dashboard`. La lecture faite est perdue. | `ReadingClient.tsx` l.157, `login/page.tsx` (`router.push('/dashboard')`) |
| 6 | Majeur | Login | Création de compte implicite : une faute de frappe dans l'email crée un nouveau compte vide sans prévenir. Pas de mot de passe oublié. | `auth.ts` (`User.create` si email inconnu) |
| 7 | Majeur | Lecture du jour | La taille de texte choisie dans Paramètres n'est pas appliquée à la lecture quotidienne (seulement aux vues sourate et mot à mot). | `ReadingClient.tsx` n'utilise pas `fontSize` |
| 8 | Majeur | Lecture du jour (mobile) | En-tête collant de 158 px (20 % de l'écran) avec 7 contrôles ; le nom des sourates passe sur 3 lignes. Le bouton de validation est une icône sans libellé. | Mesuré à 375 px |
| 9 | Majeur | Lecture du jour | 221 cibles tactiles sous 40 px (Écouter 30 px, Phonétique 22 px, Mot par Mot 26 px). Recommandation : 44 px minimum. | Mesuré à 375 px |
| 10 | Majeur | Sira, Sira quiz | Navigation rendue deux fois (layout + page) : double barre du bas, double sidebar. | `sira/page.tsx` l.297/308, `sira/quiz/page.tsx` |
| 11 | Majeur | Navigation | La page Communauté (`/social`) n'apparaît dans aucun menu ; on n'y accède que via l'onboarding ou le tableau de bord. | `Navigation.tsx` |
| 12 | Majeur | Menu mobile | 14 entrées à plat, icône livre répétée 6 fois, « Mon profil » en dernier : aucune hiérarchie entre le défi et les contenus annexes. | `Navigation.tsx` |
| 13 | Majeur | Tablette (768 px) | La barre audio couvre le bas de la sidebar (lien « Recherche », et « Déconnexion » si connecté). | Mesuré à 768×1024 |
| 14 | Mineur | Sourate (Al-Baqara), Sira | Débordement horizontal sur mobile (417 px et 450 px pour 375 px) : la page « glisse » latéralement. | Mesuré ; boutons de l'en-tête |
| 15 | Mineur | Hisn, Conseils | Champs de recherche en 14-15 px : iOS zoome automatiquement au focus. | Mesuré |
| 16 | Mineur | Toute l'app (iPhone) | `pb-safe` est utilisé mais jamais défini ; pas de `viewport-fit=cover`. La nav colle à la barre d'accueil iOS. | `globals.css`, `layout.tsx` |
| 17 | Mineur | Bannière PWA (mobile) | La bannière « Installer » se pose sur la nav du bas et sa fermeture n'est pas mémorisée : elle revient à chaque visite. | `PWAInstallPrompt.tsx` |
| 18 | Mineur | Lecture du jour | Erreurs en `alert()` natif (7 occurrences dans l'app), son de succès chargé depuis un domaine tiers. | `ReadingClient.tsx` |
| 19 | Mineur | Accueil (mobile) | Page de 11 200 px : les 40 cartes du calendrier ne montrent pas les jours faits ; texte pédagogique long avant le calendrier. | Mesuré |
| 20 | Mineur | Login (desktop) | Placeholder « Illustration Islamique » visible en production sur grand écran. | `login/page.tsx` |
| 21 | Mineur | Icônes seules | Boutons sans libellé accessible (retour, validation, lecture audio) : illisibles pour un lecteur d'écran. | `ReadingClient.tsx`, 99 Noms, Sira |

À vérifier : les classes `z-[60]` et `w-14` ne sont pas présentes dans le CSS servi par le serveur local (l'icône de la modale s'étire sur toute la largeur). Relancer `npm run dev` et contrôler sur un build de prod ; si le défaut persiste, le constat 1 est aussi en production.

## Focus mobile & tablette

Le problème de fond sur mobile est la **zone du bas** : trois éléments fixes (nav, barre audio, bannière PWA) s'y disputent la place sans règle commune, tous en z-50.

**Zone du bas — règle proposée**

1. Une seule couche de référence : la nav du bas reste toujours visible (sauf en lecture immersive volontaire).
2. La barre audio se pose **au-dessus** de la nav (`bottom: calc(4rem + env(safe-area-inset-bottom))`) et devient un mini-lecteur de 56 px.
3. La bannière PWA et les toasts se posent au-dessus des deux, jamais dessus.
4. Une échelle de z-index nommée (nav 40, lecteur 45, modales 60, toasts 70) au lieu de valeurs éparses.

**Lecture du jour sur mobile**

- En-tête réduit à une ligne de 56 px : retour · « Jour 1 · Al-Fātiha → Al-Baqara » · bouton « Options » (ouvre une feuille avec Phonétique, Mot à mot, Taille du texte, Tafsir complet).
- En-tête masqué au défilement vers le bas, réaffiché au défilement vers le haut.
- Validation du jour : un vrai bouton libellé en fin de lecture, plus une barre de progression fine sous l'en-tête (verset 45 / 108).
- Actions par verset (Écouter, Tafsir) en 44 px, ou un tap sur le verset qui ouvre une petite feuille d'actions.

**Tablette (768-1024 px)**

- Au breakpoint `md` (768 px), la sidebar fixe de 256 px prend un tiers de l'écran en portrait : la colonne de lecture tombe à 463 px. Passer la sidebar à `lg` (1024 px) et garder la nav du bas en portrait, ou utiliser une sidebar rétractable en icônes (72 px).
- Lecteur audio : `md:left-64` pour ne plus recouvrir la sidebar.
- Lecture paysage : limiter la largeur du texte arabe (\~70 caractères de traduction) pour garder un confort de lecture.

**Bases manquantes**

- `viewport-fit=cover` + définition de `pb-safe` (`padding-bottom: env(safe-area-inset-bottom)`).
- Inputs à 16 px minimum.
- `overflow-x: clip` sur les en-têtes qui débordent (sourate, sira) et passage des boutons en icônes sous 400 px.
- `theme-color` adapté au mode sombre dans les métadonnées.

## Bouton « Partager l'application »

**Recommandation : ne pas le mettre dans la barre du bas.** Le placer à deux endroits permanents discrets, et surtout aux deux moments où l'envie de partager est la plus forte : après la validation d'un jour et dans un groupe.

| Emplacement | Persona servi | Découvrabilité | Risque | Verdict |
| --- | --- | --- | --- | --- |
| Après « Jour validé » (à côté des confettis) : « Invitez un proche à faire le défi avec vous » | Yasmine, Karim | Forte, au pic de satisfaction | Lassitude si affiché tous les jours | **Oui** — jours 1, 7, 20, 40 seulement |
| Page groupe : bouton « Inviter » qui partage un lien avec le code déjà rempli | Fatima | Forte, besoin explicite | Demande une route `/social/rejoindre?code=` | **Oui** — le plus utile pour la croissance |
| En tête du menu mobile (feuille « Menu »), avant les rubriques | Tous | Moyenne | Aucun | **Oui** — emplacement permanent attendu |
| Icône partage en haut à droite de l'accueil (mobile) | Ines, Fatima | Moyenne | Faible | **Oui** — discret, cohérent avec les apps natives |
| 5e onglet de la barre du bas | Tous | Forte | Prend la place d'une destination ; partager n'est pas naviguer | Non |
| Bouton flottant permanent | Tous | Forte | Masque le contenu, s'ajoute à une zone du bas déjà saturée | Non |

**Comportement**

- Sur mobile : `navigator.share()` ouvre la feuille de partage native (WhatsApp, SMS, Instagram…). C'est déjà utilisé dans 99 Noms et Conseils, donc pattern cohérent.
- Sinon (Firefox desktop, certains navigateurs intégrés) : copie du lien + toast « Lien copié ».
- Lien suivi : `?ref=share-app`, `?ref=share-day` ou `?ref=group-invite` pour mesurer dans Vercel Analytics.
- Prévoir une image Open Graph (1200×630) et un titre/description dédiés : sans eux, l'aperçu WhatsApp est pauvre.

**Composant proposé** (`components/ShareAppButton.tsx`) :

```tsx
'use client';
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

type Props = { source: 'menu' | 'home' | 'day' | 'group'; path?: string; label?: string };

export default function ShareAppButton({ source, path = '/', label = "Partager l'application" }: Props) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    // construit au clic : pas d'accès à window pendant le rendu serveur
    const url = new URL(path, window.location.origin);
    url.searchParams.set('ref', `share-${source}`);
    const data = {
      title: 'Coran 40 Jours',
      text: 'Je lis le Coran en 40 jours avec cette app (tafsir, audio, phonétique). Rejoins-moi !',
      url: url.toString(),
    };

    if (navigator.share && navigator.canShare?.(data) !== false) {
      try { await navigator.share(data); } catch { /* partage annulé */ }
      return;
    }
    await navigator.clipboard?.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={onShare} aria-label={label}
      className="flex items-center gap-3 min-h-11 px-4 rounded-lg hover:bg-muted">
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      <span className="text-sm">{copied ? 'Lien copié' : label}</span>
    </button>
  );
}
```

Usage : `<ShareAppButton source="menu" />` en tête de la feuille Menu, et sur la page groupe `<ShareAppButton source="group" label="Inviter" path={'/social/rejoindre?code=' + group.code} />`.

## Plan d'action priorisé

Les quick wins corrigent les 3 bloquants en moins d'une journée de dev ; le reste se planifie sur deux itérations. Numéros = constats du tableau.

**Quick wins (≤ 1 jour)**

- [ ] Ajouter `@custom-variant dark (&:where(.dark, .dark *));` dans `globals.css` (#3)
- [ ] Échelle de z-index ; modale au-dessus de la nav ; vérifier que `z-[60]` est bien généré (#1)
- [ ] Lecteur audio au-dessus de la nav sur mobile, `md:left-64` sur tablette/desktop (#2, #13)
- [ ] Supprimer le `<Navigation />` en double dans Sira et Sira quiz (#10)
- [ ] Ajouter Communauté au menu (#11)
- [ ] Définir `pb-safe` + `viewport-fit=cover` ; inputs à 16 px (#15, #16)
- [ ] Mémoriser la fermeture de la bannière PWA (#17)
- [ ] `aria-label` sur les boutons icônes (#21)

**Itération 1 (parcours critique)**

- [ ] Recharger l'état « validé » sur la page du jour + coches dans le calendrier de l'accueil (#4, #19)
- [ ] `signIn({ callbackUrl })` et redirection vers la page d'origine après login ; valider automatiquement le jour au retour (#5)
- [ ] Appliquer la taille de texte des Paramètres à la lecture du jour (#7)
- [ ] En-tête de lecture compact + feuille « Options » + cibles 44 px (#8, #9)
- [ ] `ShareAppButton` dans le menu et sur l'accueil mobile

**Itération 2 (compte & croissance)**

- [ ] Séparer connexion et inscription (confirmation du mot de passe, « mot de passe oublié ») (#6)
- [ ] Lien d'invitation de groupe `/social/rejoindre?code=` + bouton « Inviter » (partage natif)
- [ ] Invitation au partage après validation des jours 1, 7, 20 et 40
- [ ] Menu restructuré en 3 groupes : Mon défi · Apprendre · Découvrir (#12)
- [ ] Remplacer les `alert()` par des toasts (#18) ; corriger les débordements horizontaux (#14)
- [ ] Image Open Graph et métadonnées de partage par page

**Mesurer** : taux de complétion de l'onboarding, % de jours validés par utilisateur actif, rétention J+1 / J+7, visites `?ref=share-*` (Vercel Analytics est déjà en place).
