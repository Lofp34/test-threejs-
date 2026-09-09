# Telegram × Three.js — CRM 3D Demo

Démo mobile-first d'une **Telegram Mini App** utilisant **Three.js** pour afficher un pipeline commercial 3D interactif.

## Ce que montre la démo

- scène 3D manipulable au doigt ;
- sélection d'étapes par tap/raycasting ;
- intégration du SDK officiel Telegram Mini Apps ;
- haptique Telegram quand l'app est ouverte dans Telegram ;
- exemple `sendData()` pour renvoyer l'étape sélectionnée au bot ;
- fallback Safari : l'application fonctionne aussi comme site web classique ;
- design optimisé pour l'iPhone 12 Pro (390 × 844 CSS px), avec safe areas et DPR plafonné à 2 ;
- aucun backend, aucun build : compatible GitHub Pages.

## Stack

- HTML / CSS / JavaScript natifs
- Three.js 0.185.1 via jsDelivr
- Telegram Mini Apps SDK
- GitHub Pages

## Lancer localement

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déploiement GitHub Pages

Le dépôt contient un workflow `.github/workflows/pages.yml` qui déploie le contenu statique de `main` sur GitHub Pages.

URL prévue : `https://lofp34.github.io/test-threejs-/`

## Brancher à Telegram

Dans BotFather, configurer une Mini App avec l'URL GitHub Pages HTTPS. Le SDK est déjà chargé dans `index.html`.

Le bouton **Envoyer au bot** envoie un JSON de démonstration avec `Telegram.WebApp.sendData()` lorsque le mode de lancement Telegram l'autorise.

> Pour une vraie application métier, valider systématiquement `initData` côté serveur avant d'utiliser les données Telegram comme données d'identité ou d'autorisation.
