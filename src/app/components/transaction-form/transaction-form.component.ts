import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit, AfterViewInit {
  expenses: any[] = [];

  currentDate = new Date();

  options: FormGroup;
  typeValue = new FormControl('0'); // Type : dépense ou apport
  freqValue = new FormControl('0'); // Fréquence : ponctuel, mensuel ou étendu
  amountValue = new FormControl('0'); // Montant en €
  budgetValue = new FormControl('0'); // Budget correspondant à la dépense
  dateValue = new FormControl('0'); // Date de virement ponctuel
  dateFirstValue = new FormControl('0'); // Date de premier virement
  dateLastValue = new FormControl('0'); // Date de dernier virement

  repetitionValue = new FormControl('0'); // Fréquence de répétition

  constructor(fb: FormBuilder) {
    console.log(this.currentDate);
    this.options = fb.group({
      typeValue: this.typeValue,
      freqValue: this.freqValue,
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

  addNewExpense(): void {
    console.log("-- NEW EXPENSE --");
    let expense = [];

    if (this.typeValue.value == 'depense') {
      expense.push(-1 * parseFloat(this.amountValue.value));
    } else {
      expense.push(parseFloat(this.amountValue.value));
    }

    expense.push(this.budgetValue.value)

    if (this.freqValue.value == 'ponctuel') {
      expense.push(this.dateValue.value);
    } else if (this.freqValue.value == 'mensuel') {
      expense.push(this.dateFirstValue.value);
      expense.push(this.repetitionValue.value);
    } else {
      expense.push(this.dateFirstValue.value);
      expense.push(this.dateLastValue.value);
      expense.push(this.repetitionValue.value);
    }

    this.expenses.push(expense)
    console.log(this.expenses);
  }
}
