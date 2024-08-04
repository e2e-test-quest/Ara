# Back-end Ara

Le projet est une API [Nest.js](https://nestjs.com/) et utilise une base de données [PostgreSQL](https://www.postgresql.org/) avec [Prisma](https://www.prisma.io/).

## Prérequis

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

Installer les dépendances :

```sh
yarn install
```

Lancer les conteneurs docker :

```sh
docker-compose up -d
```
Ci-dessous la liste des applications démarrées :
| Application | Description | Accès |
| -- | -- | -- |
| `db` | Bases de données Postgres | localhost:5432 |
| `minio` | Serveur S3 permettant de :<br> - créer un bucket<br> - créer une paire AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY  | - IHM d'administration : http://localhost:9001 avec *login:* `ara-s3-user` / *mot de passe:* `ara-s3-password`<br> - API S3 : http://localhost:9000 |
| `fake-smtp` | Faux serveur smtp |  - IHM de consultation des mails : http://localhost:8901<br> - Port serveur SMTP : 1025 |

Lancer les migrations de la base de données :

```sh
yarn migrate:dev
```

## Développement

Lancer le serveur local :

```sh
yarn start:dev
```

La documentation de l’API est disponible sur Swagger (requiert d’avoir lancé le serveur local) : [http://localhost:4000/swagger](http://localhost:4000/swagger)
