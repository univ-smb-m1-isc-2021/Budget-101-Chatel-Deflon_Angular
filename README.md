## Fonctionnalités demandées :

- Application multi-utilisateurs :
  - Création et suppression d'utilisateurs
  - Modification de l'adresse e-mail
- Gestion de budgets :
  - Création, modification et suppression des budgets
  - Budgets constitués par 2 types de transactions (apport, dépense)
- Gestion de transactions :
  - Création, modification et suppression des transactions
  - 2 types de transactions (apport, dépense)
  - 3 sous-types de transactions :
    - Ponctuelle : transaction à une date précise
    - Récurrente : transaction qui se répète à une fréquence donnée
    - Etalée : transaction étalée entre une date de début et une date de fin
- Visualisation des données pour l'année courante :
  - Un graphique à lignes représentant le solde de chaque budget pour chaque mois de l'année
  - Un graphique camembert représentant le solde total de chaque budget 
  - Un tableau listant les informations des budgets : nom, solde annuel, dernière transaction
  - Un tableau listant les informatiosn des transactions : nom, montant, budget, dates, type, fréquence
- Envoie d'un mail récapitulatif :
  - Envoie du mail au clic sur le bouton "Envoyer Recap" sur la page "/utilisateur"
  - Liste chaque budget et chaque transaction de l'utilisateur

