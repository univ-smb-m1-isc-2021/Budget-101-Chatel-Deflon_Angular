import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";
import {BudgetService} from "../../services/budget.service";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  budgets: any[] = [];
  private subscriptionExpenseForm: Subscription;

  currentDate = new Date();

  options: FormGroup;
  typeValue = new FormControl(''); // Type : dépense ou apport
  freqValue = new FormControl(''); // Fréquence : ponctuel, mensuel ou étendu
  labelValue = new FormControl(''); // Nom de la dépense
  amountValue = new FormControl(''); // Montant en €
  budgetValue = new FormControl(''); // Budget correspondant à la dépense
  dateValue = new FormControl(this.currentDate); // Date de virement ponctuel
  dateFirstValue = new FormControl(this.currentDate); // Date de premier virement
  dateLastValue = new FormControl(this.currentDate); // Date de dernier virement
  repetitionValue = new FormControl(''); // Fréquence de répétition

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService) {
    this.options = fb.group({
      typeValue: this.typeValue,
      freqValue: this.freqValue,
      labelValue: this.labelValue,
      amountValue: this.amountValue,
      budgetValue: this.budgetValue,
      dateValue: this.dateValue,
      dateFirstValue: this.dateFirstValue,
      dateLastValue: this.dateLastValue,
      repetitionValue: this.repetitionValue
    });

    this.subscriptionExpenseForm= this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
      });

  }

  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
  }

  // Ajout une nouvelle dépense
  addNewExpense() {

    let amount = parseFloat(this.amountValue.value);
    if (this.typeValue.value == 'depense') {
      amount *= -1;
    }

    if (this.freqValue.value == 'PUNCTUAL') {
      let punctualExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        date: this.dateValue.value
      }
      this.expensesApi.addPunctualExpense(punctualExpense);
    } else if (this.freqValue.value == 'RECURRENT') {
      let recurrentExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        date: this.dateFirstValue.value,
        repetition: this.repetitionValue.value,
      }
      this.expensesApi.addRecurrentExpense(recurrentExpense);
    } else {
      let spreadExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        start: this.dateFirstValue.value,
        end: this.dateLastValue.value,
      }
      this.expensesApi.addSpreadExpense(spreadExpense);
    }
  }

  getBudgetId(name: string): number {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].name == name) {
        return this.budgets[i].id;
      }
    }
    return -1;
  }
}
