import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Observable, Subject} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";
import {BudgetService} from "../../services/budget.service";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  label: string;
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

  displayedColumns: string[] = ['id', 'label']; //, 'amount', 'lastexpense', 'actions'
  clickedRows = new Set<Budget>();
  dataSource: any[] = [];

  editRow = false;
  currentId = -1;

  ngOnInit(): void {}

  constructor(private budgetApi: BudgetService) {
    budgetApi.getBudgets().subscribe(
      budgets => {
        this.dataSource = budgets;
        console.log(this.dataSource);
      }
    );
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
    // for (let i = 0; i < ELEMENT_DATA.length; i++) {
    //   if (ELEMENT_DATA[i].id == id) {
    //     return ELEMENT_DATA[i];
    //   }
    // }
  }

  deleteBudget(id: number) {
    // console.log("delete " + id);
    // for (let i = 0; i < ELEMENT_DATA.length; i++) {
    //   console.log("id elem: " + ELEMENT_DATA[i].id + ", id: " + id + " = " + (ELEMENT_DATA[i].id == id));
    //   if (ELEMENT_DATA[i].id == id) {
    //     ELEMENT_DATA.splice(i, 1);
    //     console.log(ELEMENT_DATA);
    //     break;
    //   }
    // }

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
