import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {formatDate} from "@angular/common";
import {TransactionEditComponent} from "../transaction-edit/transaction-edit.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";

// TODO : WARNING MANQUE INFOS : Date, type de transaction
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

  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
    this.expenses = this.expensesApi.expenses;
  }

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    this.subscriptionExpenseListB= this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });

    this.subscriptionExpenseListE= this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  ngOnChanges(): void {
    this.expensesList = [];
    this.expenses.forEach(val => this.expensesList.push(Object.assign({}, val)));
    for (let i = 0; i < this.expensesList.length; i++) {
      this.expensesList[i].budget = this.getBudget(this.expensesList[i].budgetId);
      if (this.expensesList[i].date == undefined) this.expensesList[i].date = "--";
      if (this.expensesList[i].start == undefined) this.expensesList[i].start = "--";
      if (this.expensesList[i].end == undefined) this.expensesList[i].end = "--";

      if (this.expensesList[i].type == "SPREAD") {
        this.expensesList[i].type = "Etalé";
      } else if (this.expensesList[i].type == "RECURRENT") {
        this.expensesList[i].type = "Récurrent";
      } else {
        this.expensesList[i].type = "Ponctuel";
      }

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

  getTransaction(id: number): any {
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i].id == id) {
        return this.expenses[i];
      }
    }
  }

  getBudget(id: number): any {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == id) {
        return this.budgets[i].name;
      }
    }
  }

  deleteTransaction(id: number) {
    this.expensesApi.deleteExpense(id);
  }
}
