import {Component, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";
import {BudgetService} from "../../services/budget.service";
import {Expense, ExpensesService} from "../../services/expenses.service";

export interface Budget {
  id: number;
  name: string;
  amount: number;
  userId: number;
  lastexpense: string;
}

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  @ViewChild(BudgetEditComponent) budgetEditComponent: BudgetEditComponent | undefined;
  private subscriptionBudgetListB: Subscription;
  private subscriptionBudgetListE: Subscription;

  // Récupère l'année courante
  currentYear = formatDate(new Date(), "yyyy-MM-dd", "en").substring(0, 4);

  budgetsList: Budget[] = []; // Liste des budgets du composant
  displayedColumns: string[] = ['name', 'amount', 'lastexpense', 'actions'];
  clickedRows = new Set<Budget>();

  budgets: any[] = [];
  expenses: any[] = [];

  editRow = false;
  currentId = -1;

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    // Recharge le composant si la liste des budgets est mise à jour
    this.subscriptionBudgetListB = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });
    // Recharge le composant si la liste des dépenses est mise à jour
    this.subscriptionBudgetListE = this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  // Initialise les listes
  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
    this.expenses = this.expensesApi.expenses;
    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
  }

  ngOnChanges(): void {
    this.budgetsList = [];
    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
    // Set les informations "amount" et "last expense" de chaque budget
    for (let i = 0; i < this.budgetsList.length; i++) {
      this.budgetsList[i].amount = 0;
      this.budgetsList[i].lastexpense = "--";
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.budgetsList[i].id == this.expenses[j].budgetId) {
          this.budgetsList[i].lastexpense = this.expenses[j].label; // Récupère le nom de la dépense
          this.budgetsList[i].amount += this.calculateExpense(this.expenses[j]); // Calcul le montant annuel du budget
        }
      }
    }
  }

  // FONCTIONS POUR CALCULER LE MONTANT DES DEPENSES D'UN BUDGET
  // Retourne si une année est bissextile ou non
  leap(year: number) {
    if (year % 100 == 0) year = year / 100;
    return year % 4 == 0;
  }

  // Calcule le montant d'une dépense récurrente sur une année
  calculateRecurrentExpenseAnnual(expense: Expense, month: number) {
    let value = 0;
    switch (expense.repetition) {
      case "DAILY":
        let startDay = parseInt(expense.date.substring(8, 10));
        let firstMonth = true;
        let days = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            days = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            days = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              days = 29;
            } else {
              days = 28;
            }
          }
          if (firstMonth) {
            days -= (startDay + 1); // +1 car le jour de début compte
            firstMonth = false;
          }
          value += (expense.amount * days);
        }
        break;
      case "WEEKLY":
        let day = parseInt(expense.date.substring(8, 10));
        let limit = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          let week = 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            limit = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            limit = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              limit = 29;
            } else {
              limit = 28;
            }
          }
          // Calcul du nombre de semaines dans le mois
          while (day < limit) {
            week += 1;
            day += 7;
          }
          value += (expense.amount * week);
          day = 1;
        }
        break;
      case "MONTHLY":
        for (let i = month; i <= 12; i++) {
          value += expense.amount;
        }
        break;
      case "THIRDLY":
        for (let i = month; i <= 12; i += 3) {
          value += expense.amount;
        }
        break;
      case "YEARLY":
        value = expense.amount;
        break;
      case "BIYEARLY":
        let currentYear = parseInt(formatDate(Date(), "yyyy-MM-DD", "en").substring(0, 4));
        let expenseYear = parseInt(expense.date.substring(0, 4));
        if (currentYear - expenseYear == 0) {
          value = expense.amount;
        }
        break;
    }
    return value;
  }

  // Calcule le nombre de mois sur lequel s'étend une dépense étalée
  calculateTotalMonthSpreadExpense(start: string, end: string) {
    let startYear = parseInt(start.substring(0, 4)); // première année
    let startMonth = parseInt(start.substring(5, 7)); // premier mois
    let lastMonthY1 = 13; // On part de 13 pour ne pas fausser les calculs car (13-1) mois séparent janvier de décembre
    let endYear = parseInt(end.substring(0, 4)); // dernière année
    let endMonth = parseInt(end.substring(5, 7)); // dernier mois
    let firstMonthLY = 1; // premier mois de la dernière année

    // + 1 an pour compenser les mois restants qui composent l'année restante: startMonth à lastMonthY1 et firstMonthLY à endMonth
    let monthBetweenYears = ((endYear) - (startYear + 1)) * 12;
    let totalMonths = 0;

    if (monthBetweenYears > 0) {
      totalMonths = monthBetweenYears;
    }
    totalMonths += ((lastMonthY1 - startMonth) + (endMonth - firstMonthLY))

    return totalMonths;
  }

  // Calcule le montant d'une dépense étalée sur une année
  calculateSpreadExpenseAnnual(expense: Expense) {
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    // Si l'année de début est différente de l'année de fin
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end);
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      let startMonth = parseInt(expense.start.substring(5, 7));
      let amount = 0;
      for (let i = startMonth; i <= 12; i++) {
        amount += spreadAmount;
      }
      return amount;
    } // Sinon on retourne le montant de la dépense
    else {
      return expense.amount;
    }
  }

  // Calcule le montant total d'une dépense sur un an
  calculateExpense(expense: Expense): number {
    if (expense.type == "SPREAD") {
      let year = expense.start.substring(0, 4);
      if (year == this.currentYear) {
        return this.calculateSpreadExpenseAnnual(expense);
      } else {
        return 0;
      }
    } else if (expense.type == "RECURRENT") {
      let year = expense.date.substring(0, 4);
      if (year == this.currentYear) {
        return this.calculateRecurrentExpenseAnnual(expense, parseInt(expense.date.substring(6, 8)));
      } else {
        return 0;
      }
    } else {
      let year = expense.date.substring(0, 4);
      if (year == this.currentYear) {
        return expense.amount;
      } else {
        return 0;
      }
    }
  }

  // Génère le composant pour modifier un budget suite au clic sur le bouton "Modifier"
  editBudget(id: number) {
    this.editRow = true;
    this.currentId = id;
    if (this.budgetEditComponent !== undefined) {
      // @ts-ignore
      this.budgetEditComponent?.update = true;
      // @ts-ignore
      this.budgetEditComponent?.data = this.getElement(id);
      this.budgetEditComponent?.ngOnChanges();
    }
  }

  // Récupère le budget de l'id donné
  getElement(id: number): any {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == id) {
        return this.budgets[i];
      }
    }
  }

  // Supprime un budget suite au clic sur le bouton "Supprimer"
  deleteBudget(id: number) {
    // Supprime toutes les dépenses associées au budget
    for (let i = 0; i < this.expensesApi.expenses.length; i++) {
      if (this.expensesApi.expenses[i].budgetId == id) this.expensesApi.deleteExpense(this.expensesApi.expenses[i].id);
    }
    this.budgetApi.deleteBudget(id); // Supprime le budget via le service budget
  }
}
