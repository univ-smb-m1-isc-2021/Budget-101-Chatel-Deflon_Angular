# Budget-101-Chatel-Deflon_Angular

**Participants :**
- Antoine Chatel
- Elodie Deflon

## Description :

Serveur front de l'application "*Gunter-101, Application de gestion de budgets*"

## Serveur back :

**Spring Boot :** https://github.com/univ-smb-m1-isc-2021/budget-101-chatel-deflon

## Pages web :
- Page de connexion : "http://gunter-101.oups.net/connexion"
- Page d'inscription : "http://gunter-101.oups.net/inscription"
- Page d'accueil : "http://gunter-101.oups.net/"
- Page de gestion des données : "http://gunter-101.oups.net/gestion"
- Page de gestion de l'utilisateur : "http://gunter-101.oups.net/utilisateur"

## Fonctionnalités :

- **Application multi-utilisateurs :**
  - Création et suppression d'utilisateurs
  - Modification de l'adresse e-mail
- **Gestion de budgets :**
  - Création, modification et suppression des budgets
  - Budgets constitués par 2 types de transactions (apport, dépense)
- **Gestion de transactions :**
  - Création, modification et suppression des transactions
  - 2 types de transactions (apport, dépense)
  - 3 sous-types de transactions :
    - Ponctuelle : transaction à une date précise
    - Récurrente : transaction qui se répète à une fréquence donnée
    - Etalée : transaction étalée entre une date de début et une date de fin
- **Visualisation des données pour l'année courante :**
  - Un graphique à lignes représentant le solde de chaque budget pour chaque mois de l'année
  - Un graphique camembert représentant le solde total de chaque budget 
  - Un tableau listant les informations des budgets : nom, solde annuel, dernière transaction
  - Un tableau listant les informatiosn des transactions : nom, montant, budget, dates, type, fréquence
- **Envoie d'un mail récapitulatif :**
  - Envoie du mail au clic sur le bouton "Envoyer Recap" sur la page "http://gunter-101.oups.net/utilisateur"
  - Liste chaque budget et chaque transaction de l'utilisateur
  
## Arborescence du projet :

- **src/app :** fichiers de paramétrage global
  - app.module.ts : import, export et déclaration des modules utilisés
  - app-routing.module.ts : définition des routes de l'application
- **src/app/auth :** authentification et interception des tokens pour la connexion des utilisateurs
- **src/app/components :** tous les components qui constituent les différentes pages
  - En-tête : header
  - Pied de page : footer
  - Page d'accueil : homepage
    - transaction-form
    - charts
  - Page de gestion : managing-data
    - budget-form
    - budget-list
    - budget-edit
    - transaction-list
    - transaction-edit
  - Page de l'utilisateur : user-settings
    - user-edit
  - Page de connexion : login
  - Page d'inscription : register
- **src/app/services :** tous les services qui interrogent et stocke les données de l'API

