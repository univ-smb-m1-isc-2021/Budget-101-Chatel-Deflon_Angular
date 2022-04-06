import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Observable, Subject} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";
import {BudgetService} from "../../services/budget.service";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  name: string;
  amount: number;
  lastexpense: any[];
}

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  @ViewChild(BudgetEditComponent) budgetEditComponent: BudgetEditComponent | undefined;

  displayedColumns: string[] = ['name', 'amount', 'lastexpense', 'actions']; //, 'amount', 'lastexpense', 'actions'
  clickedRows = new Set<Budget>();

  @Input() budgets: any[] = [];
  @Input() expenses: any[] = [];

  editRow = false;
  currentId = -1;

  ngOnInit(): void {}

  ngOnChanges(): void {
    // Set the missing properties of budgets : amount & lastexpense
    for (let i = 0; i < this.budgets.length; i++) {
      this.budgets[i].amount = 0; // Set amount
      this.budgets[i].lastexpense = "--"; // Set lastexpense
      for (let j = 0; j < this.expenses.length; j++) {
        // Set amount
        if (this.budgets[i].id == this.expenses[j].budgetId) {
          this.budgets[i].amount += this.expenses[j].amount;
          // TODO : check la date pour prendre la plus récente
          if (this.budgets[i].lastexpense == "--") {
            this.budgets[i].lastexpense = this.expenses[j].label;
          }
        }
      }
    }
  }

  constructor(private budgetApi: BudgetService) {}

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

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
