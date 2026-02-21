# Guide d'Optimisation Vercel (Hobby Tier)

Ce guide détaille les modifications à apporter à votre projet Next.js (App Router) pour réduire drastiquement la consommation sur votre compte Vercel (Hobby), en particulier le **Fast Origin Transfer** et les **Serverless Function Execution (Compute)**.

## 📊 Analyse de votre Consommation Actuelle

Vos métriques Vercel (Hobby Tier) montrent des points très intéressants :

- 🔴 **Fast Origin Transfer (7,95 GB / 10 GB) :** C'est le point critique. Vous êtes à ~80% de votre limite mensuelle gratuite. Cela confirme exactement notre diagnostic : vos fonctions Serverless renvoient d'énormes fichiers JSON (les données du Coran, des Hadiths, etc.) depuis le serveur vers le CDN Vercel pour chaque requête non mise en cache.
- 🟡 **Fluid Active CPU (1h 19m / 4h) :** Vous avez consommé près d'un tiers du temps de calcul CPU alloué. C'est directement lié à l'exécution répétée de Node.js pour lire ces fichiers JSON à chaque requête client.
- 🟢 **Fast Data Transfer (5,9 GB / 100 GB) :** Très bonne nouvelle, la bande passante globale servie aux utilisateurs finaux est faible par rapport à la limite. Le problème n'est donc pas le trafic global, mais l'absence de mise en cache interne (Origin -> Edge).
- 🟢 **Edge Requests & Function Invocations (~113K - 122K) :** Volumes sains, mais qui déclenchent actuellement trop d'exécutions complètes faute de cache.

**Conclusion :** Les optimisations proposées ci-dessous cibleront spécifiquement la chute drastique du **Fast Origin Transfer** et du **Fluid Active CPU**.

---

## 🔍 Comprendre le problème d'architecture actuel

---

## 🛠️ Modifications Recommandées (Par Ordre de Priorité)

### 1. Remplacer les appels API Clients par des Server Components (RSC)
C'est la modification la plus impactante. Au lieu d'avoir une API qui lit un fichier JSON pour qu'un composant Client le récupère, lisez le fichier *directement* dans le composant Serveur et passez les données au composant Client.

**Exemple : Analysons `app/hisn/page.tsx`**

❌ **Actuellement (Coûteux) :**
```tsx
'use client';
// ...
useEffect(() => {
    async function fetchCategories() {
        const response = await fetch('/api/hisn'); // Vercel Compute + Transfer
        const data = await response.json();
        setCategories(data);
    }
    fetchCategories();
}, []);
```

✅ **Solution (Gratuit après le build) :**
Séparez la page en deux. La page (`page.tsx`) est un composant serveur qui lit le fichier, et elle passe les données à un composant client (ex: `HisnClient.tsx`) pour la recherche.

**Dans `app/hisn/page.tsx` :**
```tsx
import fs from 'fs/promises';
import path from 'path';
import HisnClient from './HisnClient'; // Votre ancien code client déplacé ici

export default async function HisnPage() {
    // Lecture directe sur le serveur (gratuit pendant le build ou en cache)
    const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const categories = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        hadithCount: item.hadiths.length,
    }));

    // Les données sont intégrées dans le HTML, 0 appel API !
    return <HisnClient categories={categories} />;
}
```

*Note : Faites la même chose pour `/hisn/[id]`, `/hadith/themes`, et toutes les pages qui font des `fetch` vers vos propres routes `/api` pour lire des JSON locaux.*

---

### 2. Ajouter l'en-tête `Cache-Control` sur vos Routes API Publiques (Déjà partiellement appliqué)
Si vous *devez* utiliser une route API (par exemple, pour la recherche asynchrone ou la gestion des mots `api/wbw`), vous devez forcer Vercel à la mettre en cache au niveau de son Edge CDN (Réseau de distribution).

Sans cela, Next.js considère les requêtes utilisant `searchParams` (ex: `/api/wbw?surah=1`) comme dynamiques.

**Correction :** Ajoutez toujours cet en-tête pour les données immuables.
```typescript
return NextResponse.json(data, {
    headers: { 
        // Cache public pendant 1 an sur le Edge CDN Vercel
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400' 
    }
});
```
*(J'ai déjà appliqué ce correctif pour `api/wbw`, `api/surah-details`, et `api/quran/page/[pageNumber]` dans le dernier commit).*

---

### 3. Utiliser `generateStaticParams` au maximum
Pour toutes vos routes dynamiques (`app/coran/[id]/page.tsx`, `app/hisn/[id]/page.tsx`), utilisez `generateStaticParams`.

Cela indique à Next.js de générer toutes les pages (ex: les 114 sourates) au moment du build (le déploiement sur Vercel). Ensuite, quand un utilisateur visite une sourate, Vercel lui sert un simple fichier statique sans exécuter de Compute.

Vous l'avez bien fait pour `app/coran/[id]/page.tsx` :
```typescript
export async function generateStaticParams() {
    return Array.from({ length: 114 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}
```
Assurez-vous de le faire aussi pour :
- `app/juz/[id]/page.tsx` (1 à 30)
- `app/jour/[id]/page.tsx` (1 à 40)
- `app/hisn/[id]/page.tsx` (ID de toutes les invocations)

---

### 4. Attention aux Routes API Utilisateurs (Progress, Groups)
Les routes comme `/api/progress` ou `/api/groups` nécessitent une base de données et de vérifier l'utilisateur (authentification). Elles ne peuvent pas être mises en cache public.

**Optimisation pour BDD Mongoose/MongoDB :**
Assurez-vous que les requêtes MongoDB ne renvoient que les champs nécessaires (utilisez les projections `.select()`). Un gros payload vers MongoDB augmente la RAM utilisée par la fonction Serverless Vercel.

---

## 🎯 Résumé des Actions Immédiates à faire

1. **Supprimer les appels `fetch('/api/hisn...')`** dans les composants Clients, et lire les données via `fs.readFile` dans les pages Serveurs.
2. **Vérifier vos pages `/hadith` et `/apprentissage`** pour s'assurer qu'elles ne font pas d'appels API clients vers vos propres fichiers JSON.
3. **S'assurer que `generateStaticParams`** est présent sur toutes les pages de détails (hisn/[id], hadith/[book]).
4. Garder l'excellente configuration PWA actuelle qui met en cache côté navigateur pour soulager encore plus Vercel.
