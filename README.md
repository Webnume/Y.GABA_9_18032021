# Débugger et tester un SaaS RH

## Description

L'application de gestion de notes de frais Billed est pleine de bugs. Correction du code et implémentation des tests unitaires et d'intégration pour que ce ne soit plus le cas.

- Ecrire des tests unitaires avec JavaScript
- Débugger une application web avec le Chrome Debugger
- Rédiger un plan de test end-to-end manuel
- Ecrire des tests d'intégration avec JavaScript

**Comment lancer l'application en local** :

Clonez le projet :
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR.git
```

Allez au repo cloné :
```
$ cd Billed-app-FR
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


**Comment lancer tous les tests en local avec Jest :**

```
$ npm run test
```

**Comment lancer un seul test :**

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

**Comment voir la couverture de test :**

`http://127.0.0.1:8080/coverage/lcov-report/`


