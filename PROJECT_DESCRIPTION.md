# Coran 40 Jours - Description du Projet

## Aperçu
"Coran 40 Jours" est une application web complète et interactive dédiée à l'apprentissage, la compréhension et la pratique de l'Islam. Conçue avec une forte approche pédagogique et gamifiée, l'application accompagne les utilisateurs dans leur routine religieuse, favorisant l'étude du Coran, des Hadiths, et de la spiritualité globale.

## Stack Technique
L'application est construite sur un socle technique moderne garantissant des performances optimales et une expérience utilisateur fluide :
- **Framework Core :** Next.js 16 (App Router) et React 19.
- **Styling & UI :** Tailwind CSS 4, Framer Motion pour des animations fluides.
- **Base de Données :** MongoDB (via Mongoose) pour la gestion avancée des utilisateurs, des scores, et de la progression.
- **Authentification :** Next-Auth (v5) assurant un système de connexion robuste.
- **Internationalisation :** Next-Intl pour supporter plusieurs langues (arabe, français, anglais).
- **Format PWA :** Utilisation de `@ducanh2912/next-pwa` permettant l'installation mobile et la lecture audio en arrière-plan.

## Modules & Fonctionnalités Clés

### 1. Le Saint Coran & Technologie Tajwid
- **Excellence Visuelle :** Affichage optimisé du texte arabe respectant minutieusement les ligatures complexes (optimisation avec Zero-Width Joiners).
- **Code Couleur Tajwid :** Application de règles précises via Regex (Madd, Ghunnah, Ikhfa, Qalqalah) affichées en couleur pour guider la prononciation. Une option (toggle) permet de désactiver les couleurs.
- **Navigation & Récitation :** Recherche globale intelligente, choix entre différents récitateurs, et système de mémorisation.

### 2. Exégèse (Tafsir)
- Système de recherche de Tafsir indépendant de la lecture coranique basique.
- Agrégation de multiples sources telles qu'Ibn Kathir (en plusieurs langues), Maarif-ul-Quran et potentiellement As-Sa'di.

### 3. Bibliothèque de Hadiths
- Intégration soignée et structurée des grands recueils : **Sahih Al-Bukhari**, **Sahih Muslim**, les **40 Hadiths de Nawawi** et **Sunan at-Tirmidhi**.
- Navigation catégorisée pour permettre une recherche thématique rapide.

### 4. La Citadelle du Musulman (Hisn al-Muslim)
- Invocations (Du'as) pour toutes les situations du quotidien avec texte en arabe, translittération, traduction française et support audio lié pour l'apprentissage.

### 5. Apprentissage Actif & Suivi (Gamification)
- **Programme de 40 Jours :** Système de suivi et défis quotidiens pour encadrer la progression.
- **Tableau de Bord :** Calcul de séries (Streaks), historique et statistiques visuelles (graphiques de progression et scores de quiz).
- **Quiz Interactifs :** Outil de mémorisation du vocabulaire coranique réactif aux erreurs pour un apprentissage optimisé.

### 6. Ressources Spirituelles & Éducatives
- **Articles & Conseils :** Section de blog approfondie traitant de l'Histoire du Coran, des 4 Madhabs, de la gestion de la colère, des bienfaits spirituels du Sujud, etc.
- **Ouvrages Classiques :** Intégration et vulgarisation de livres majeurs tels que *Ihya' Ulum al-Din* (Revivification des sciences de la religion) de l'Imam Al-Ghazali ou *La Risâla*.

## Personnalisation & Accessibilité
- **Paramètres Avancés :** Les utilisateurs ont la liberté de personnaliser les polices (IndoPak, Uthmani), la taille des caractères (indépendante entre arabe et traduction) et les thèmes sombres/sépias pour accroître leur confort de lecture.
- **SEO & Performances :** Sitemaps dynamiques générés automatiquement et métadonnées adaptées à chaque sourate et hadith pour maximiser la visibilité.

## Vision Future du Projet
À l'avenir, le projet s'étendra vers de grandes ambitions communautaires (groupes "Halaqa" pour se motiver ensemble), de mémorisation augmentée (mode répétition, masquage du texte) et vers le développement d'une **Application Mobile Native** utilisant Capacitor.
