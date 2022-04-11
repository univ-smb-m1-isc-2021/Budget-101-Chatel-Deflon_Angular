import {Component, OnInit, ViewChild} from '@angular/core';
import {TransactionEditComponent} from "../transaction-edit/transaction-edit.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";

export interface Expenses {
  id: number,
  amount: number,
  label: string,
  budgetId: number,
  budget: string,
  date: string,
  start: string,
  end: string,
  type: string,
  repetition: string,
}

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  private subscriptionExpenseListB: Subscription;
  private subscriptionExpenseListE: Subscription;

  @ViewChild(TransactionEditComponent) transactionEditComponent: TransactionEditComponent | undefined;

  expensesList: Expenses[] = [];
  displayedColumns: string[] = ['label', 'amount', 'budget', 'date', 'start', 'end', 'type', 'repetition', 'actions'];
  clickedRows = new Set<Expenses>();

  budgets: any[] = [];
  expenses: any[] = [];

  editT = false;
  transactionId = -1;

  // Initialisation des listes du composant
  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
    this.expenses = this.expensesApi.expenses;
  }

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    // Recharge le composant si la liste des budgets est mise à jour
    this.subscriptionExpenseListB= this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });
    // Recharge le composant si la liste des dépenses est mise à jour
    this.subscriptionExpenseListE= this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  // Mise à jour de la liste des dépenses affichées dans le composant
  ngOnChanges(): void {
    this.expensesList = [];
    this.expenses.forEach(val => this.expensesList.push(Object.assign({}, val)));
    for (let i = 0; i < this.expensesList.length; i++) {
      this.expensesList[i].budget = this.getBudget(this.expensesList[i].budgetId);
      // Remplace les informations undefined par des "--"
      if (this.expensesList[i].date == undefined) this.expensesList[i].date = "--";
      if (this.expensesList[i].start == undefined) this.expensesList[i].start = "--";
      if (this.expensesList[i].end == undefined) this.expensesList[i].end = "--";

      // Traduction des différents types pour l'affichage
      if (this.expensesList[i].type == "SPREAD") {
        this.expensesList[i].type = "Etalé";
      } else if (this.expensesList[i].type == "RECURRENT") {
        this.expensesList[i].type = "Récurrent";
      } else {
        this.expensesList[i].type = "Ponctuel";
      }

      // Traduction des différentes répétitions pour l'affichage
      if (this.expensesList[i].repetition == undefined) this.expensesList[i].repetition = "--";
      switch (this.expensesList[i].repetition) {
        case "DAILY":
          this.expensesList[i].repetition = "Journalière";
          break;
        case "WEEKLY":
          this.expensesList[i].repetition = "Hebdomadaire";
          break;
        case "MONTHLY":
          this.expensesList[i].repetition = "Mensuelle";
          break;
        case "THIRDLY":
          this.expensesList[i].repetition = "Trimestrielle";
          break;
        case "YEARLY":
          this.expensesList[i].repetition = "Annuelle";
          break;
        case "BIYEARLY":
          this.expensesList[i].repetition = "Bi-Annuelle";
          break;
      }
    }
  }

  // Génère le composant pour modifier une dépense suite à un clic bouton
  editTransaction(id: number) {
    this.editT = true;
    this.transactionId = id;
    if (this.transactionEditComponent !== undefined) {
      // @ts-ignore
      this.transactionEditComponent?.updateT = true;
      // @ts-ignore
      this.transactionEditComponent?.dataT = this.getTransaction(id);
      this.transactionEditComponent?.ngOnChanges();
    }
  }

  // Récupère une dépense avec son id
  getTransaction(id: number): any {
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i].id == id) {
        return this.expenses[i];
      }
    }
  }

  // Récupère un budget avec son id
  getBudget(id: number): any {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == id) {
        return this.budgets[i].name;
      }
    }
  }

  // Supprime une transaction suite à un clic bouton
  deleteTransaction(id: number) {
    this.expensesApi.deleteExpense(id);
  }
}
