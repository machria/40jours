# Coran 40 Jours — Documentation IA

## Vue d'ensemble du projet

Application web islamique permettant de compléter la lecture du Coran en 40 jours, avec Tafsir Ibn Kathir, hadiths, invocations (Hisn), apprentissage de l'arabe, et fonctionnalités sociales (groupes, leaderboard, badges).

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js App Router | 16.1.1 |
| UI | React | 19.2.3 |
| Typage | TypeScript (strict) | 5.9.3 |
| Base de données | MongoDB + Mongoose | 9.0.2 |
| Authentification | NextAuth.js (Credentials/JWT) | 5.0.0-beta |
| Styles | TailwindCSS 4 + PostCSS | 4.x |
| Internationalisation | next-intl (locale `fr` fixe) | 4.6.1 |
| PWA | @ducanh2912/next-pwa (Workbox) | 10.2.9 |
| State client | TanStack React Query | 5.x |
| Animations | Framer Motion | 12.x |
| Tests | Jest + Testing Library | 30.x |
| Déploiement | Vercel Hobby | — |

---

## Problème critique — Fast Origin Transfer

Le Fast Origin Transfer Vercel dépasse 50 MB/jour. Chaque requête qui ne peut pas être servie depuis le CDN Vercel coûte de la bande passante origin.

**Causes principales :**
- Routes API GET sans header `Cache-Control`
- Pages SSR sans `revalidate` (re-génération à chaque requête)
- Images servies via `<img>` brut au lieu de `next/image`
- Requêtes MongoDB non cachées forçant du SSR
- Réponses API trop volumineuses (documents Mongo entiers)

### Règles de génération de code — TOUJOURS respecter

1. **Toute route API GET** doit retourner un header `Cache-Control` adapté
2. **Préférer ISR** à SSR pur : `export const revalidate = 3600` (ou `false` pour immuable)
3. **Utiliser `unstable_cache`** ou `React.cache()` pour les queries MongoDB répétées
4. **Toujours `next/image`** pour les images — jamais `<img>` brut
5. Avant tout nouveau Server Component qui touche MongoDB ou le filesystem : **vérifier si ça tape l'origin**
6. **Compresser les réponses** : ne jamais renvoyer un document Mongoose entier, sélectionner uniquement les champs nécessaires
7. **Données statiques** (Coran, Hisn, Hadith) : `public, max-age=31536000, immutable`
8. **Données privées utilisateur** : `private, max-age=30, stale-while-revalidate=60`

### Politique de cache par type de contenu

| Contenu | Cache-Control | CDN-Cache-Control |
|---------|--------------|-------------------|
| `/audio/**` | `public, max-age=31536000, immutable` | idem |
| `/quran/**`, `/hisn/**`, `/hadith/**` | `public, max-age=31536000, immutable` | idem |
| `/*.json` | `public, max-age=86400, stale-while-revalidate=604800` | `public, max-age=604800` |
| `/api/surah-details` | `public, s-maxage=31536000, stale-while-revalidate=86400` | idem |
| `/api/progress` (GET) | `private, max-age=30, stale-while-revalidate=60` | — |
| `/api/groups/**` | `private, no-store` | — |
| Sitemap | `public, max-age=86400` | — |

### Contraintes Vercel Hobby

- Pas de cache CDN étendu sur les routes dynamiques sans headers explicites
- Pas de Redis natif → utiliser `unstable_cache` de Next.js ou Upstash free tier
- Bandwidth limité : chaque octet depuis l'origin coûte
- **Objectif à chaque commit** : réduire ou maintenir stable le Fast Origin Transfer

---

## Structure du dépôt

```
/
├── app/                    # App Router Next.js (routes + API)
│   ├── layout.tsx          # Layout racine (i18n + Providers + Navigation)
│   ├── page.tsx            # Home (force-static, progress côté client)
│   ├── login/              # Page de connexion
│   ├── dashboard/          # Tableau de bord utilisateur (protégé)
│   ├── jour/[id]/          # Pages de lecture quotidienne (statique/SSG)
│   ├── coran/[id]/         # Pages par sourate (generateStaticParams)
│   ├── juz/[id]/           # Pages par Juz (30 sections)
│   ├── hisn/               # Citadelle du Musulman (revalidate: false)
│   ├── hadith/             # Hadiths (Bukhari, Muslim, etc.)
│   ├── sira/               # Biographie prophétique
│   ├── 99-noms/            # 99 Noms d'Allah
│   ├── tajwid/             # Règles de Tajwid
│   ├── apprendre-arabe/    # Module apprentissage arabe
│   ├── vocabulaire/        # Vocabulaire coranique
│   ├── search/             # Recherche
│   ├── social/             # Groupes et leaderboard
│   ├── settings/           # Paramètres utilisateur
│   ├── conseils/           # Conseils islamiques
│   ├── actions/            # Server Actions (tafsir.ts, quiz.ts)
│   ├── sitemap.ts          # Sitemap dynamique
│   ├── robots.ts           # Robots.txt
│   └── api/
│       ├── auth/[...nextauth]/  # Handler NextAuth
│       ├── progress/            # GET/POST progression utilisateur
│       ├── surah-details/       # GET métadonnées sourates
│       ├── translate/           # POST proxy Google Translate
│       └── groups/              # CRUD groupes + rejoindre/quitter
├── components/
│   ├── layout/             # Navigation.tsx (sidebar responsive)
│   ├── ui/                 # Composants réutilisables (button, card, tabs)
│   ├── dashboard/          # ActivityChart, BadgesList
│   ├── providers/          # Providers.tsx (React Query + Session)
│   ├── reading/            # SurahViewer, lecteur Coran
│   ├── surah/              # Composants affichage sourate
│   ├── hadith/             # Composants hadiths
│   ├── hisn/               # HisnClient et composants connexes
│   ├── learn-arabe/        # Apprentissage arabe
│   ├── HomeProgress.tsx    # Cercle de progression (Suspense côté client)
│   ├── RamadanBanner.tsx   # Bannière Ramadan saisonnière
│   ├── SearchInterface.tsx # Interface de recherche
│   ├── TajwidText.tsx      # Colorisation Tajwid
│   └── PWAInstallPrompt.tsx
├── models/
│   ├── User.ts             # Schéma utilisateur (voir section DB)
│   └── Group.ts            # Schéma groupe
├── lib/
│   ├── db.ts               # Connexion MongoDB avec cache global
│   ├── gamification.ts     # Système de badges (7 badges)
│   ├── streak-utils.ts     # Calcul streak consécutifs
│   ├── quranApi.ts         # Accès données Coran
│   ├── hadith-api.ts       # API hadiths (lecture fichiers JSON)
│   ├── tafsir-data.ts      # Accès tafsir par sourate/ayah
│   ├── audioUrls.ts        # Mapping URLs audio
│   ├── translator.ts       # Proxy Google Translate (gtx endpoint)
│   ├── juzData.ts          # Données Juz
│   ├── juzList.ts          # Liste des Juz
│   └── utils.ts            # cn() — merger Tailwind classes
├── hooks/
│   ├── useQuranAudio.ts    # Lecture audio Coran
│   ├── useWordByWordAudio.ts # Audio mot-à-mot
│   ├── useScrollPersistence.ts # Persistance scroll
│   └── useDebounce.ts
├── context/
│   └── SettingsContext.tsx # Thème, taille police, tajwid, phonétique (localStorage)
├── data/                   # Données statiques TypeScript
│   ├── plan40jours.ts      # Plan 40 jours (40 entrées)
│   ├── vocabulary.ts       # Vocabulaire
│   ├── names.ts            # 99 Noms d'Allah
│   └── advice.ts           # Conseils
├── messages/
│   ├── fr.json             # Traductions français (locale par défaut)
│   └── en.json             # Traductions anglais
├── types/                  # Types TypeScript partagés
├── scripts/                # Scripts utilitaires (Node/Python/TypeScript)
│   └── copy_to_public.ts   # Copie data/ → public/ avant build
├── public/
│   ├── audio/              # MP3 sourates (~176MB+, servi via CDN)
│   ├── quran/              # Données Coran statiques JSON
│   ├── hadith/             # Données hadiths JSON
│   ├── hisn/               # Données Hisn JSON
│   ├── tafsir/             # Données Tafsir JSON
│   └── manifest.json       # PWA manifest
├── __tests__/              # Tests Jest + Testing Library
│   ├── components/         # Tests composants
│   ├── lib/                # Tests utilitaires
│   └── data/               # Tests données
├── auth.ts                 # Config NextAuth (Credentials provider)
├── auth.config.ts          # Callbacks auth + pages
├── i18n.ts                 # Config next-intl (locale 'fr')
├── next.config.ts          # Config Next.js + cache headers + PWA
├── vercel.json             # Headers Vercel (CDN)
├── jest.config.ts          # Config Jest
├── tsconfig.json           # TypeScript strict, alias @/*
└── eslint.config.mjs       # ESLint (core-web-vitals + TS)
```

---

## Base de données MongoDB

### Modèle User (`models/User.ts`)

```typescript
{
  email: string           // unique, requis
  password?: string       // bcrypt hash, select: false (non inclus par défaut)
  name?: string
  image?: string
  dailyProgress: Map<string, boolean>  // clé = dayId (ex: "1"), valeur = complété
  streak: number          // jours consécutifs (calculé via activityHistory)
  lastReadDate?: Date
  lastReadJuzId?: number
  groups: ObjectId[]      // ref: 'Group'
  completedJuzs: number[] // Juz complétés (1-30)
  quizScores: Map<string, number>
  vocabularyQuizBestScore?: number
  hisnQuizBestScore?: number
  arabicQuizBestScore?: number
  names99QuizBestScore?: number
  siraQuizBestScore?: number
  badges: { id: string; unlockedAt: Date }[]
  activityHistory: Map<string, number>  // clé = "YYYY-MM-DD", valeur = count
  // timestamps: createdAt, updatedAt
}
```

### Modèle Group (`models/Group.ts`)

```typescript
{
  name: string            // requis
  code: string            // unique, 6 chars hex (ex: "A1B2C3")
  description?: string
  admin: ObjectId         // ref: 'User'
  members: ObjectId[]     // ref: 'User'
  // timestamps: createdAt, updatedAt
}
```

### Connexion MongoDB (`lib/db.ts`)

Pattern de cache global pour éviter les connexions multiples en développement et en production serverless :

```typescript
// Toujours utiliser dbConnect() avant toute opération Mongoose
await dbConnect();
```

---

## API Routes

### `/api/progress`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `GET` | ✓ (JWT) | Progression, streak, badges, completedJuzs |
| `POST` | ✓ (JWT) | Marquer jour ou Juz complété/incomplet |

**Cache GET :** `private, max-age=30, stale-while-revalidate=60`

### `/api/surah-details`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `GET` | ✗ | Métadonnées sourate par `?id=` ou toutes |

**Cache :** `public, s-maxage=31536000, stale-while-revalidate=86400`

### `/api/translate`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `POST` | ✗ | Proxy vers gtx.google.com (traduction texte arabe) |

### `/api/groups`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `GET` | ✓ | Lister les groupes de l'utilisateur |
| `POST` | ✓ | Créer un groupe (code 6 chars généré automatiquement) |

**Cache GET :** `private, no-store`

### `/api/groups/[id]`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `GET` | ✓ | Détails groupe + leaderboard membres |

### `/api/groups/join` & `/api/groups/[id]/leave`

| Méthode | Auth | Résumé |
|---------|------|--------|
| `POST` | ✓ | Rejoindre/quitter un groupe |

---

## Authentification

**Système :** NextAuth.js v5 beta — Credentials provider uniquement (email + password)
**Session :** JWT, durée 30 jours
**Création auto :** Si l'email n'existe pas, un compte est créé automatiquement lors de la première connexion
**Protection des routes :** `/dashboard` nécessite une session valide (voir `auth.config.ts`)

```typescript
// Protéger une route API
const session = await auth();
if (!session?.user?.email) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## Conventions de code

### Nommage

- **Composants React :** `PascalCase.tsx`
- **Hooks :** `camelCase` préfixé `use` (ex: `useQuranAudio.ts`)
- **Utilitaires/lib :** `camelCase.ts`
- **Constantes :** `SCREAMING_SNAKE_CASE` (ex: badge ids)
- **Alias d'import :** `@/*` → racine du projet

### Server vs Client Components

- **Par défaut :** Server Component (pas de `'use client'`)
- **Client Component :** ajouter `'use client'` en haut si nécessaire (hooks, événements, localStorage)
- **Pattern Suspense :** utiliser `<Suspense fallback={...}>` pour les composants client qui chargent des données async

### Pages statiques

Utiliser `generateStaticParams()` pour les routes dynamiques prévisibles :

```typescript
// Génère toutes les pages au build — aucun hit origin en production
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: (i + 1).toString() }));
}

// Pour les pages entièrement statiques
export const dynamic = 'force-static';

// Pour les pages jamais re-validées
export const revalidate = false;
```

### Gamification

7 badges définis dans `lib/gamification.ts` :

| ID | Condition |
|----|-----------|
| `FIRST_STEP` | 1 jour complété |
| `STREAK_3` | 3 jours consécutifs |
| `STREAK_7` | 7 jours consécutifs |
| `STREAK_40` | 40 jours consécutifs |
| `JUZ_1` | 1 Juz complété |
| `JUZ_30` | 30 Juz complétés |
| `SOCIAL_BUTTERFLY` | Membre d'au moins 1 groupe |

### Styles (TailwindCSS 4)

- Utilitaire de merge : `cn()` depuis `@/lib/utils` (clsx + tailwind-merge)
- Thème : géré par `SettingsContext` (light/dark + fontSize + tajwid + phonétique)
- Polices : Inter (variable `--font-sans`) + Reem Kufi (arabe, variable `--font-kufi`)

---

## Internationalisation

Locale **française fixe** (`fr`) chargée via `i18n.ts`. Les fichiers de messages sont dans `messages/fr.json` et `messages/en.json`. Utiliser `next-intl` côté serveur (`getTranslations`) et côté client (`useTranslations`).

---

## PWA

Configuration Workbox dans `next.config.ts` :

- **Exclu du précache :** `audio/`, `tafsir/`, `hadith/`, sourcemaps
- **Audio (CacheFirst) :** cache 30 jours, max 50 entrées
- **JSON data (StaleWhileRevalidate) :** cache 7 jours, max 200 entrées
- **Désactivé en développement** (`NODE_ENV === 'development'`)

---

## Variables d'environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| `MONGODB_URI` | ✓ | URI de connexion MongoDB (lance une erreur si absent) |
| `NEXT_PUBLIC_AUDIO_CDN_URL` | — | URL CDN externe pour les MP3 (ex: Cloudflare R2). Si vide, utilise `/audio/` local |
| `AUTH_SECRET` | ✓ | Secret NextAuth.js pour signer les JWT |

---

## Workflows de développement

### Installation et démarrage

```bash
npm install                    # installe + copie les fichiers data/ → public/
npm run dev                    # copy_to_public.ts + next dev
npm run build                  # copy_to_public.ts + next build
npm run start                  # serveur de production
```

### Tests

```bash
npm test                       # Jest (jsdom, @testing-library/react)
npm run lint                   # ESLint
```

Tests dans `__tests__/` (composants, lib, data). Alias `@/*` disponible dans les tests.

### Scripts utilitaires

Le dossier `scripts/` contient des scripts de migration, téléchargement et traitement des données (Python + TypeScript). Ces scripts ne font pas partie de l'application et servent à préparer les fichiers JSON statiques.

**Script critique :** `scripts/copy_to_public.ts` copie les grands fichiers JSON de `data/` vers `public/` afin qu'ils soient servis directement par Vercel CDN. Ce script s'exécute automatiquement via `postinstall`, `dev`, et `build`.

---

## Checklist avant chaque PR / commit

- [ ] Les nouvelles routes API GET ont un header `Cache-Control`
- [ ] Les nouvelles pages dynamiques ont `generateStaticParams()` ou `revalidate`
- [ ] Aucun `<img>` brut n'a été ajouté (utiliser `next/image`)
- [ ] Les nouvelles queries MongoDB utilisent `.select()` pour limiter les champs renvoyés
- [ ] La réponse ne génère pas plus de trafic origin que la version précédente
- [ ] Les tests passent (`npm test`)
- [ ] Le lint passe (`npm run lint`)
