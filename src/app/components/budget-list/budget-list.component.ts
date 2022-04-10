import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Observable, Subject, Subscription} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  name: string;
  amount: number;
  userId: number;
  lastexpense: any[];
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

  budgetsList: Budget[] = [];
  displayedColumns: string[] = ['name', 'amount', 'lastexpense', 'actions']; //, 'amount', 'lastexpense', 'actions'
  clickedRows = new Set<Budget>();

  budgets: any[] = [];
  expenses: any[] = [];

  editRow = false;
  currentId = -1;

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    this.subscriptionBudgetListB = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });
    this.subscriptionBudgetListE = this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
    this.expenses = this.expensesApi.expenses;

    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
  }

  ngOnChanges(): void {
    this.budgetsList = [];
    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
    // Set the missing properties of budgets : amount & lastexpense
    for (let i = 0; i < this.budgetsList.length; i++) {
      this.budgetsList[i].amount = 0; // Set amount
      // @ts-ignore
      this.budgetsList[i].lastexpense = "--"; // Set lastexpense
      for (let j = 0; j < this.expenses.length; j++) {
        // Set amount
        if (this.budgetsList[i].id == this.expenses[j].budgetId) {
          this.budgetsList[i].amount += this.expenses[j].amount;
          // TODO : check la date pour prendre la plus récente
          // @ts-ignore
          if (this.budgetsList[i].lastexpense == "--") {
            this.budgetsList[i].lastexpense = this.expenses[j].label;
          }
        }
      }
    }
    console.log(this.budgetsList);
  }

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

  getElement(id: number): any {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == id) {
        return this.budgets[i];
      }
    }
  }

  deleteBudget(id: number) {
    this.budgetApi.deleteBudget(id);
  }
}
