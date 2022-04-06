import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {formatDate} from '@angular/common';
import {ExpensesService} from "../../services/expenses.service";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit, AfterViewInit {
  @Input() budgets: any[] = [];
  expenses: any[] = [];

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

  constructor(fb: FormBuilder, private expensesApi: ExpensesService) {
    console.log(this.currentDate);
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

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  // Ajout une nouvelle dépense
  addNewExpense(): void {
    let expense = {
      name: "",
      amount: 0,
      budgetId: 0
    };

    expense.name = this.labelValue.value;

    if (this.typeValue.value == 'depense') {
      expense.amount = (-1 * parseFloat(this.amountValue.value));
    } else {
      expense.amount = parseFloat(this.amountValue.value);
    }


    expense.budgetId = this.getBudgetId(this.budgetValue.value);

    // TODO : add other properties: date, datedebut, datefin, type
    // if (this.freqValue.value == 'ponctuel') {
    //   expense.push(this.dateValue.value);
    // } else if (this.freqValue.value == 'recurrent') {
    //   expense.push(this.dateFirstValue.value);
    //   expense.push(this.repetitionValue.value);
    // } else {
    //   expense.push(this.dateFirstValue.value);
    //   expense.push(this.dateLastValue.value);
    // }

    // TODO : Envoyer la nouvelle dépense au back
    this.expensesApi.addExpense(expense);
    // TODO : Mettre à jour les graphiques au front
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
