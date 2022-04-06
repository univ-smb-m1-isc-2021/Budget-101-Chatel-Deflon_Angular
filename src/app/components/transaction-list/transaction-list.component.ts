import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {formatDate} from "@angular/common";
import {TransactionEditComponent} from "../transaction-edit/transaction-edit.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";

export interface Expenses {
  id: number;
  amount: number;
  label: string;
  budgetid : number;
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

  displayedColumns: string[] = ['label', 'amount', 'budget', 'actions'];
  clickedRows = new Set<Expenses>();

  @Input() expenses: any[] = [];
  @Input() budgets: any[] = [];

  editT = false;
  transactionId = -1;

  ngOnInit(): void {}
  constructor() {}

  ngOnChanges(): void {
    for (let i = 0; i < this.expenses.length; i++) {
      this.expenses[i]["budget"] = this.getBudget(this.expenses[i].budgetId);
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
      console.log(this.budgets[i].id + ", " + id);
      if (this.budgets[i].id == id) {
        return this.budgets[i].name;
      }
    }
  }

  deleteTransaction(id: number) {
    console.log("delete " + id);
    for (let i = 0; i < this.expenses.length; i++) {
      console.log("id elem: " + this.expenses[i].id + ", id: " + id + " = " + (this.expenses[i].id == id));
      if (this.expenses[i].id == id) {
        this.expenses.splice(i, 1);
        console.log(this.expenses);
        break;
      }
    }

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
