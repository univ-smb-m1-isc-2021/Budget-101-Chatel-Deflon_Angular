import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Subject} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  label: string;
  amount: number;
  lastexpense: any[];
}

let ELEMENT_DATA: Budget[] = [
  { id: 1, label: "Test1" , amount: -1000, lastexpense: ["Repas midi", 100, formatDate(new Date(), 'dd-MM-yyy', "en")] },
  { id: 2, label: "Test2" , amount: 2500, lastexpense: ["Plein d'essence", 200, formatDate(new Date(), 'dd-MM-yyy', "en") ] },
  { id: 3, label: "Test3" , amount: -150, lastexpense: ["Virement maman", 150, formatDate(new Date(), 'dd-MM-yyy', "en") ] },
  { id: 4, label: "Test4" , amount: 120, lastexpense: ["Pension Henry", 120, formatDate(new Date(), 'dd-MM-yyy', "en")] },
  { id: 5, label: "Test5" , amount: 70, lastexpense: ["Révision annuelle voiture", 100, formatDate(new Date(), 'dd-MM-yyy', "en")] },
  { id: 6, label: "NewBudget" , amount: 0, lastexpense: [] },
];

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  @ViewChild(BudgetEditComponent) budgetEditComponent: BudgetEditComponent | undefined;

  displayedColumns: string[] = ['id', 'label', 'amount', 'lastexpense', 'actions'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<Budget>();

  editRow = false;
  currentId = -1;

  ngOnInit(): void {}
  constructor() {}

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
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      if (ELEMENT_DATA[i].id == id) {
        return ELEMENT_DATA[i];
      }
    }
  }

  deleteBudget(id: number) {
    console.log("delete " + id);
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      console.log("id elem: " + ELEMENT_DATA[i].id + ", id: " + id + " = " + (ELEMENT_DATA[i].id == id));
      if (ELEMENT_DATA[i].id == id) {
        ELEMENT_DATA.splice(i, 1);
        console.log(ELEMENT_DATA);
        break;
      }
    }

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
