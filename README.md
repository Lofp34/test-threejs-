# Mes univers — Three.js

Prototype mobile-first en **Three.js** représentant les centres d’intérêt de Laurent sous forme de **constellation 3D interactive**.

## Concept

Un noyau central représente Laurent. Six univers gravitent autour :

- IA générative
- Vente & développement
- Agents & automatisation
- Tech & code
- Créer & transmettre
- Voile & nautisme

L’utilisateur peut faire tourner la scène au doigt, toucher un univers pour le sélectionner et afficher son descriptif et ses mots-clés.

## Expérience mobile

- optimisé pour l’iPhone 12 Pro ;
- interactions tactiles et raycasting Three.js ;
- labels 3D toujours orientés vers la caméra ;
- halos, orbites, particules et profondeur ;
- DPR plafonné à 2 pour conserver de bonnes performances ;
- safe areas iOS ;
- animation suspendue lorsque la page passe en arrière-plan.

## Telegram Mini App

Le SDK Telegram Mini Apps reste intégré. Si la page est ouverte depuis Telegram, le bouton d’exploration peut renvoyer l’univers sélectionné au bot avec `Telegram.WebApp.sendData()`.

## Stack

- HTML / CSS / JavaScript natifs
- Three.js 0.185.1 via jsDelivr
- Telegram Mini Apps SDK
- GitHub Pages

## Déploiement

Le workflow `.github/workflows/pages.yml` déploie automatiquement `main` sur GitHub Pages.

**Démo :** https://lofp34.github.io/test-threejs-/
