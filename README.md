# ColeDash

Plateforme de livraison multi-commerces (démo front-end) : restaurants, courses, fleurs et boutiques à Paris, Lyon, Marseille et Nice, avec espaces commerçant, livreur et administration.

> Projet de démonstration : aucune donnée n'est envoyée à un serveur. Le panier, le compte, les commandes et l'état des espaces pro sont stockés dans le navigateur (localStorage).

## Stack

React 19 · TypeScript strict · Vite 7 · Tailwind CSS 3 · shadcn/ui · Zustand · React Router 7 · Framer Motion · Recharts

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vérification TypeScript + build de production dans dist/
npm run lint
```

## Parcours

| Espace | URL |
| --- | --- |
| Site client | `/`, `/restaurants`, `/courses`, `/fleurs`, `/fleurs/atelier`, `/boutiques`, `/recherche` |
| Commande | `/panier` → `/commande` → `/suivi/:id`, `/commandes`, `/compte` |
| Commerçant | `/marchand` |
| Livreur | `/livreur` |
| Administration | `/admin` |

- Connexion : n'importe quel e-mail + mot de passe de 6 caractères, ou le bouton « Connexion démo ».
- Codes promo : `BIENVENUE`, `LIVRAISON`, `FLEURS10`.
- Le suivi de commande avance en accéléré (livrée en ~10 minutes).

## Organisation

```
src/
  components/
    shared/    composants réutilisables (cartes, images, notation…)
    site/      en-tête, pied de page, sélecteur de ville
    portal/    layout et primitives des espaces pro
    restaurant/ checkout/ account/ store/ flowers/ merchant/ driver/ admin/
  data/        données de démonstration (restaurants, commerces, produits…)
  lib/         formatage, calcul des prix, utilitaires
  pages/       site/, merchant/, driver/, admin/
  store/       état global Zustand (panier, compte, commandes, ville, favoris…)
  types.ts
```

Le panier ne contient qu'un commerce à la fois (une course, un livreur) ; ajouter un article d'un autre commerce propose de vider le panier.
