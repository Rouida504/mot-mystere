# Le Mot Mystère

Projet réalisé en binôme avec React et Vite dans le cadre du projet d'évaluation.

Le but du jeu est de trouver un mot de cinq lettres en six essais maximum. Après chaque essai, les lettres changent de couleur :
- vert : la lettre est à la bonne place ;
- jaune : la lettre est dans le mot, mais pas à la bonne place ;
- gris : la lettre n'est pas dans le mot, ou il n'y en a pas assez d'occurrences.

## Notre binôme

- Mekdoud Lyliane
- Rouida Messai

## Installer et lancer le projet

Il faut avoir Node.js et npm installés.

```bash
git clone https://github.com/Rouida504/mot-mystere.git
cd mot-mystere
npm install
npm run dev
```

Ouvrir ensuite l'adresse indiquée dans le terminal,  `http://localhost:5173/`.

## Les technologies utilisées

- React pour construire l'interface.
- Vite pour lancer le projet en local.
- React Router DOM pour passer d'une page à l'autre.
- ESLint pour vérifier une partie du code.
- L'API du Wiktionnaire pour vérifier les mots proposés.
- `localStorage` pour garder certaines informations dans le navigateur.

## Ce que nous avons commencé à développer

Le projet contient notamment :
- une page d'accueil et une page de jeu ;
- une grille de six essais et un clavier à l'écran ;
- la saisie au clavier de l'ordinateur ;
- les couleurs des lettres après une proposition ;
- la vérification des mots avec le Wiktionnaire ;
- des pages pour les règles, les scores et les statistiques ;
- la sauvegarde de certaines données dans le navigateur ;
- un mot du jour et un compte à rebours ;
- des variantes avec des mots de différentes longueurs et une option de mode difficile ;
- une page pour le mode à quatre grilles.

Nous devons encore tester les fonctionnalités pour vérifier que tout fonctionne correctement. La présence d'une fonctionnalité dans le code ne veut pas forcément dire qu'elle est terminée.

## Répartition du travail

La répartition ci-dessous est à adapter selon ce que nous avons réellement fait.

### les taches de Lyliane

- travailler sur la logique de comparaison des lettres ;
- gérer les essais et les résultats de la partie ;
- participer à la vérification des mots ;
- tester le jeu et corriger des erreurs.

### les taches de Rouida

- créer le dépôt GitHub et le partager ;
- travailler sur les pages et la navigation ;
- développer ou intégrer des composants de l'interface ;
- participer aux tests et à l'intégration du code.

### Travail en commun

- Nous avons travaillé ensemble sur l'organisation du projet, l'intégration des fonctionnalités et les vérifications. Nous devons chacune pouvoir expliquer les parties du code que nous présentons.

- Nous avons principalement travaillé ensemble sur le PC de Rouida, car c'est elle qui avait créé le dépôt GitHub au départ. C'est pour cette raison que la plupart des commits apparaissent sous son nom. Nous nous sommes réparti les tâches et nous avons participé ensemble à l'avancement du projet. Nous devons chacune être capables d'expliquer le code et les fonctionnalités que nous présentons.

## Le code dont nous sommes fières

Nous avons choisi de mettre en avant la fonction `compareWords`, située dans `src/logic/gameLogic.js`.

Cette fonction compare le mot proposé avec le mot mystère. Elle fonctionne en deux étapes : elle repère d'abord les lettres qui sont bien placées, puis les lettres qui sont présentes mais mal placées. Cela permet de mieux gérer les lettres en double et d'éviter d'afficher trop de cases jaunes.

Nous trouvons cette partie intéressante parce que la logique est dans un fichier séparé de l'affichage. Elle est donc plus facile à comprendre et à tester.

La fonction `generateShareText` est également intéressante : elle prépare un résultat avec des carrés colorés, sans afficher les lettres du mot.

## Tests et points à vérifier

Avant de rendre le projet, nous devons :
- vérifier que le projet se lance correctement ;
- lancer le build et le lint ;
- tester les lettres répétées ;
- vérifier le comportement si le Wiktionnaire ne répond pas ;
- vérifier que la partie du jour est bien sauvegardée après actualisation ;
- vérifier les pages directement par leur adresse ;
- vérifier que les tests automatisés peuvent être lancés.

## État d'avancement

- Palier visé :6
- Dernier palier entièrement validé : palier 5
- Difficultés rencontrées : la finalisation et les tests du palier 6.
- Lien du site en ligne : https://mot-mystere-o143.vercel.app/
