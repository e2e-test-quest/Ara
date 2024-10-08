# Front-end Ara

Le projet a été créé avec [Vite.js](https://vitejs.dev/). Le framework front-end est [Vue.js (en version 3)](https://vuejs.org/) avec [TypeScript](https://www.typescriptlang.org/).

La partie style utilise le [DSFR (Système de Design de l'État)](https://www.systeme-de-design.gouv.fr/) et du CSS sans pré-processeur.

## Prérequis

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

## Installation

Installer les dépendances :

```sh
yarn install
```

Générer les fichiers requis du RAWEB, RAAM et RAPDF (critères et tests et méthodologies) :

```sh
yarn generate:reference
```

## Développement

Lancer le [serveur local sur le port 3000](http://localhost:3000) :

```sh
yarn dev
```

## Tests

[Cypress](https://www.cypress.io/) est utilisé pour lancer des tests end-to-end (e2e) dans un navigateur pour reproduire le comportement des utilisateurs.

Les tests peuvent être lancés de 2 manières :

- Via l’application Cypress avec :

  ```sh
  yarn cypress open
  ```

- Via le terminal avec :

  ```sh
  yarn cypress run
  ```

## Guidelines

- Utiliser les media queries en "desktop first" et avec la notation suivante avec les [valeurs de points de rupture du DSFR](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/grille-et-points-de-rupture) :
  ```css
  @media (width < 62rem) {
    ...
  }
  ```
- Ordonner les classes CSS de la manière suivante : `<1. classes du composant DSFR> <2. classes utilitaires du DSFR> <3. classes custom>`. Exemple :
  ```html
  <button class="fr-btn fr-btn--secondary fr-mt-4w submit-button">...</button>
  ```
  1. `fr-btn fr-btn--secondary`
  2. `fr-mt-4w`
  3. `submit-button`
