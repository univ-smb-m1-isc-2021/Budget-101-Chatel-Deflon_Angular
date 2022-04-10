import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BudgetService} from "../../services/budget.service";
import {Subscription} from "rxjs";
import {ExpensesService} from "../../services/expenses.service";
import {formatDate} from "@angular/common";

export interface Transaction {
  id: number,
  userId: number,
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
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.css']
})
export class TransactionEditComponent implements OnInit, OnChanges {
  // Transaction à modifier
  @Input() dataT: Transaction = {
    id: 0,
    amount: 0,
    label: "",
    budgetId: 0,
    budget: "",
    date: "",
    start: "",
    end: "",
    type: "",
    repetition: "",
    userId: 0
  };
  @Input() updateT: boolean = false;
  budgetsT: any[] = [];

  private subscriptionExpenseEdit: Subscription;

  options: FormGroup;
  label = new FormControl(''); // Nom de la dépense
  amount = new FormControl(''); // Montant de la dépense
  date = new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en")); // Date de la dépense
  enddate = new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en")); // Date de fin de la dépense (étalée)
  budget = new FormControl(''); // Budget lié à la dépense
  frequency = new FormControl(''); // Fréquence de la dépense

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService,
  ) {
    // Initialisation des champs du formulaire
    this.options = fb.group({
      label: this.label,
      amount: this.amount,
      date: this.date,
      enddate: this.enddate,
      budget: this.budget,
      frequency: this.frequency
    });

    // Recharge le composant si la liste des budgets est mise à jour
    this.subscriptionExpenseEdit = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgetsT = this.budgetApi.budgets;
        this.ngOnChanges();
      });
  }

  // Initialisation des champs du formulaire
  ngOnInit(): void {
    this.budgetsT = this.budgetApi.budgets;
    if (this.dataT != undefined) {
      this.label = new FormControl(this.dataT.label);
      this.amount = new FormControl(this.dataT.amount);
      if (this.dataT.date == undefined) {
        this.date = new FormControl(this.dataT.start);
      } else {
        this.date = new FormControl(this.dataT.date);
      }
      this.enddate = new FormControl(this.dataT.end);
      this.budget = new FormControl(this.dataT.budget);
      this.frequency = new FormControl(this.dataT.repetition);
    }
  }

  // Mise à jour des champs du formulaire
  ngOnChanges(): void {
    this.budgetsT = this.budgetApi.budgets;
    if (this.dataT != undefined && this.updateT) {
      this.label = new FormControl(this.dataT.label);
      this.amount = new FormControl(this.dataT.amount);
      this.date = new FormControl(this.dataT.date);
      this.enddate = new FormControl(this.dataT.end);
      this.budget = new FormControl(this.dataT.budget);
      this.frequency = new FormControl(this.dataT.repetition);
      this.updateT = false;
    }
  }

  // Modification d'une dépense
  editTransaction(): void {
    this.dataT.label = this.label.value;
    this.dataT.amount = this.amount.value;

    this.dataT.budgetId = this.budget.value;

    if (this.dataT.amount == null) this.dataT.amount = 0.0;

    // Dépense ponctuelle
    if (this.dataT.type == "PUNCTUAL") {
      this.dataT.date = this.date.value;
      this.expensesApi.editPunctualExpense(this.dataT);
    } // Dépense récurrente
    else if (this.dataT.type == "RECURRENT") {
      this.dataT.start = this.date.value;
      this.dataT.repetition = this.frequency.value;
      this.expensesApi.editRecurrentExpense(this.dataT);
    } // Dépense étalée
    else {
      this.dataT.start = this.date.value;
      this.dataT.end = this.enddate.value;
      this.expensesApi.editSpreadExpense(this.dataT);
    }
  }
}

