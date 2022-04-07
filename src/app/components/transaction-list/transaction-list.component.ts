import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {formatDate} from "@angular/common";
import {TransactionEditComponent} from "../transaction-edit/transaction-edit.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";

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

// const TRANSACTION_DATA: Transaction[] = [
//   { id: 1, label: "Repas midi",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test1', frequency: 'Journalière' },
//   { id: 2, label: "Plein d'essence",amount: 200, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test2', frequency: 'Hebdomadaire' },
//   { id: 3, label: "Virement maman",amount: 150, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test3', frequency: '--' },
//   { id: 4, label: "Pension Henry",amount: 120, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test4', frequency: 'Hebdomadaire' },
//   { id: 5, label: "Révision annuelle voiture",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test5', frequency: 'Annuel' },
// ];

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  @ViewChild(TransactionEditComponent) transactionEditComponent: TransactionEditComponent | undefined;

  expensesList: Expenses[] = [];
  displayedColumns: string[] = ['label', 'amount', 'budget', 'date', 'start', 'end', 'type', 'repetition', 'actions'];
  clickedRows = new Set<Expenses>();

  @Input() expenses: any[] = [];
  @Input() budgets: any[] = [];

  editT = false;
  transactionId = -1;

  ngOnInit(): void {
  }

  constructor(private expensesApi: ExpensesService) {
  }

  ngOnChanges(): void {
    console.log(this.expenses);
    this.expensesList = this.expenses;
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
      if (this.expenses[i].budgetid == id) {
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

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
