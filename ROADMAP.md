# Roadmap du Projet "Coran 40 Jours"

Ce document trace l'avenir du projet, en se concentrant sur la stabilité technique, l'expérience utilisateur et l'ajout de fonctionnalités pédagogiques.

## ✅ Récemment Complété
- **Architecture & Performance** : Migration Next.js 15, React 19, Tailwind 4.
- **Données Hadiths** : Intégration Bukhari, Muslim, Nawawi, et récemment **Tirmidhi**. Correction des titres et structure.
- **Tafsir Découplé** : Moteur de recherche dédié pour le Tafsir séparé du texte coranique.
- **Tableau de Bord** : Suivi dynamique de la progression (40 jours, Juz, Scores Quiz) et calcul des "Streaks".
- **Outils d'Apprentissage** : Audio pour Hisn al-Muslim, Quiz Vocabulaire interactif.

---

## 🟢 Phase 1 : Expérience Utilisateur & Personnalisation (Immédiat - 2 Semaines)
*Objectif : Donner le contrôle à l'utilisateur et fluidifier la navigation.*

### 1. Page de Paramètres (Settings) `Priorité Haute`
- [ ] **Création de l'interface** : Page `/settings` accessible depuis le menu utilisateur.
- [ ] **Options de Lecture** :
    - Taille de police ajustable (indépendamment pour Arabe et Français).
    - Choix de la police arabe (IndoPak, Uthmani, etc.).
- [ ] **Audio** : Sélection du Récitateur par défaut (Mishary, Sudais, etc.) pour tout le site.
- [ ] **Apparence** : Sélecteur de Thème explicite (Clair / Sombre / Sépia / OLED).
- [ ] **Persistance** : Sauvegarde des préférences en local (invité) et en base de données (connecté).

### 2. Navigation & Recherche Globale
- [ ] **Command Palette (Cmd+K)** :
    - Menu modal accessible partout pour navigation rapide.
    - Commandes directes : "Aller à Sourate Yasin", "Ouvrir Juz 5", "Rechercher 'Patience'".
- [x] **Search UX** : Améliorer l'autocomplétion et la prévisualisation des résultats dans la barre de recherche.

### 3. SEO & Visibilité
- [x] **Métadonnées Dynamiques** : Titres et descriptions uniques pour chaque Sourate, Hadith, et Leçon pour indexation Google.
- [x] **Sitemap Complet** : Génération automatique incluant toutes les routes dynamiques (Hadiths individuels).

---

## 🟡 Phase 2 : Engagement & Mémorisation (Moyen Terme - 1 Mois)
*Objectif : Transformer l'application de lecture en outil d'apprentissage actif.*

### 1. Outils de Mémorisation (Hifz)
- [ ] **Mode Répétition Audio** : Bouton pour boucler sur un verset X fois ou à l'infini.
- [ ] **Masquer/Révéler** : Toggle pour flouter le texte (Arabe ou Français) et le révéler au clic/survol pour tester sa mémoire.
- [ ] **Mode "Écoute Continue"** : Amélioration du player pour la lecture en arrière-plan ininterrompue (PWA).

### 2. Gamification & Feedback
- [ ] **Système de Notifications** : Feedback visuel (Toast/Confettis) lors du déblocage d'un badge ou d'un nouveau record de série.
- [ ] **Vue Calendrier** : Visualisation "GitHub-style" de l'activité de lecture sur l'année dans le dashboard.

### 3. Notes & Signets Avancés
- [ ] **Prise de Notes** : Ajouter des notes personnelles privées sur un verset ou un hadith.
- [ ] **Collections de Favoris** : Organiser les favoris par dossiers (ex: "Versets sur la patience", "Duas pour le matin").

### 4. Contenu Enrichi
- [x] **Contexte des Sourates** : Ajout de fiches détaillées (contexte, thèmes, objectifs) pour chaque sourate.
- [ ] **Tafsir Comparé** : Ajouter d'autres sources de Tafsir (Ibn Kathir complet, As-Sa'di).

---

## 🔴 Phase 3 : Communauté & Expansion (Long Terme - 3 Mois+)
*Objectif : Créer une plateforme communautaire et multi-supports.*

### 1. Fonctionnalités Sociales
- [ ] **Groupes "Halaqa"** : Créer des groupes privés pour suivre la progression collective (ex: défi 40 jours en famille).
- [ ] **Partage Enrichi** : Génération d'images esthétiques de versets/hadiths pour partage réseaux sociaux (Instagram/WhatsApp).

### 2. Application Mobile Native
- [ ] **Capacitor / Mobile** : Portage de la PWA en application native Android/iOS pour meilleures performances et notifications push.

---

## 🛠️ Maintenance Technique Continue
- **Tests Automatisés** : Ajouter des tests E2E (Playwright) pour les parcours critiques (Login -> Lecture -> Quiz).
- **Audit Accessibilité (a11y)** : Garantir que l'app est navigable au clavier et lecteur d'écran.
