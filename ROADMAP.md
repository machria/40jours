# Roadmap du Projet "Coran 40 Jours"

Ce document trace l'avenir du projet, en se concentrant sur la stabilité technique, l'expérience utilisateur et l'ajout de fonctionnalités pédagogiques.

## ✅ Récemment Complété
- **Toggle Phonétique** : Ajout de la translittération sur les pages Juz et Programme (40 Jours).
- **Audio Hisn al-Muslim** : Lecture audio pour les invocations et mode flashcards.
- **Enrichissement des Données** : Backfill de la translittération manquante pour Hisn al-Muslim.
- **Optimisation Tafsir** : Migration vers des fichiers locaux fractionnés pour une meilleure performance et indépendance API.

---

## 🟢 Court Terme : Consolidation & UX (1-2 Semaines)
*Objectif : Rendre l'expérience actuelle irréprochable et totalement fluide.*

### 1. Perfectionnement du PWA (Offline First)
- [ ] **Audit Service Worker** : S'assurer que les nouveaux fichiers de données fractionnés (Tafsir, Hadith) sont correctement mis en cache pour une utilisation hors ligne.
- [ ] **Installation Prompt** : Améliorer l'invitation à installer l'application sur mobile.

### 2. Recherche Globale
- [ ] **Recherche Instantanée** : Implémenter une barre de recherche globale (cmd+k) permettant de trouver :
    - Une sourate (par nom français/arabe).
    - Un verset (par texte ou numéro).
    - Un concept (ex: "patience", "paradis").
- [ ] **Indexation** : Créer un index léger côté client lors du premier chargement.

### 3. Paramètres Utilisateur Centralisés
- [ ] **Page de Paramètres** :
    - Taille du texte (Arabe / Français).
    - Choix du récitateur par défaut.
    - Activation globale de la translittération.
    - Thème (Clair/Sombre/Sépia).

---

## 🟡 Moyen Terme : Fonctionnalités Pédagogiques (1-2 Mois)
*Objectif : Transformer l'application de lecture en outil d'apprentissage.*

### 1. Audio Avancé (Mémorisation)
- [ ] **Répétition de Verset** : Mode "Boucle" sur un verset ou une plage de versets pour aider à la mémorisation (Hifz).
- [ ] **Mode "Écoute Continue"** : Lecture audio en arrière-plan (background playback) pour écouter le Coran écran éteint (défi technique PWA/iOS).

### 2. Vocabulaire Intelligent (SRS)
- [ ] **Spaced Repetition System** : Remplacer le quiz aléatoire par un algorithme de répétition espacée (type Anki).
- [ ] **Banque de Mots Personnelle** : Possibilité de marquer des mots comme "difficiles" pour les réviser plus souvent.

### 3. Tableau de Bord Enrichi
- [ ] **Statistiques Détaillées** : Graphiques de lecture par jour/semaine.
- [ ] **Badges & Gamification** : Débloquer des succès (ex: "7 jours consécutifs", "Juz 30 terminé").

---

## 🔴 Long Terme : Communauté & Expansion (> 3 Mois)
*Objectif : Créer une plateforme communautaire et multi-supports.*

### 1. Fonctionnalités Sociales
- [ ] **Groupes de Lecture** : Créer des groupes "40 Jours" avec des amis pour voir la progression de chacun.
- [ ] **Leaderboard (Optionnel)** : Classement amical pour motiver (nombre de versets lus).

### 2. Contenu Enrichi
- [ ] **Tafsir Comparé** : Ajouter d'autres sources de Tafsir (Ibn Kathir complet, As-Sa'di).
- [ ] **Cours Vidéo** : Intégration de vidéos explicatives liées aux Juz.

### 3. Application Native
- [ ] **Capacitor / React Native** : Porter l'application web vers les stores (App Store / Play Store) pour de meilleures performances audio et notifications natives.

---

## 🛠️ Maintenance Technique Continue
- **Tests E2E** : Mettre en place des tests Cypress/Playwright pour les parcours critiques (Login -> Lecture -> Quiz).
- **Accessibilité** : Audit a11y pour s'assurer que l'application est utilisable par tous.
