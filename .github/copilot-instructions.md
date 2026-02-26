# Contexte Projet

## Stack technique
- Next.js 14+ App Router
- MongoDB / Mongoose en backend
- Déployé sur Vercel plan Hobby

## Problème critique actuel
Fast Origin Transfer Vercel : +50 MB/jour, budget dépassé.
Le Fast Origin Transfer se produit quand Vercel doit aller chercher 
le contenu à l'origin (nos serveurs) plutôt que de le servir depuis le CDN.

## Causes probables à toujours garder en tête
- Routes API sans headers Cache-Control
- Pages SSR sans revalidate (génèrent un hit origin à chaque requête)
- Images non optimisées / pas via next/image
- Requêtes MongoDB non cachées qui forcent du SSR
- Réponses trop volumineuses non compressées

## Règles de génération de code (TOUJOURS respecter)
1. Toute route API GET doit avoir un header Cache-Control adapté
2. Préférer ISR avec revalidate au SSR pur (`export const revalidate = 60`)
3. Utiliser `unstable_cache` ou `React.cache()` pour les queries MongoDB répétées
4. Toujours utiliser `next/image` pour les images, jamais de `<img>` brut
5. Avant tout nouveau composant Server : demander "est-ce que ça tape l'origin ?"
6. Compresser les réponses API volumineuses (éviter de renvoyer des documents Mongo entiers)

## Contraintes Vercel Hobby
- Pas de cache CDN étendu sur les routes dynamiques sans headers explicites
- Bandwidth limité : chaque octet transféré depuis l'origin coûte
- Pas de Redis natif : utiliser `unstable_cache` de Next.js ou un free tier Upstash

## Objectif à chaque commit
Réduire ou maintenir stable le Fast Origin Transfer.
Toute PR doit pouvoir répondre à : "est-ce que ça génère plus de trafic origin ?"