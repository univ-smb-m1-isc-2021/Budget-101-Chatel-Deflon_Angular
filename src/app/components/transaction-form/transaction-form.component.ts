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
  typeValue = new FormControl(''); // Type : dépense ou apport
  freqValue = new FormControl(''); // Fréquence : ponctuel, mensuel ou étendu
  labelValue = new FormControl(''); // Nom de la dépense
  amountValue = new FormControl(''); // Montant en €
  budgetValue = new FormControl(''); // Budget correspondant à la dépense
  dateValue = new FormControl(this.currentDate); // Date de virement ponctuel
  dateFirstValue = new FormControl(this.currentDate); // Date de premier virement
  dateLastValue = new FormControl(this.currentDate); // Date de dernier virement
  repetitionValue = new FormControl(''); // Fréquence de répétition

  constructor(fb: FormBuilder) {
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
    console.log("-- NEW EXPENSE --");
    let expense = [];
    expense.push(this.labelValue.value);

    if (this.typeValue.value == 'depense') {
      expense.push(-1 * parseFloat(this.amountValue.value));
    } else {
      expense.push(parseFloat(this.amountValue.value));
    }

    expense.push(this.budgetValue.value)

    if (this.freqValue.value == 'ponctuel') {
      expense.push(this.dateValue.value);
    } else if (this.freqValue.value == 'recurrent') {
      expense.push(this.dateFirstValue.value);
      expense.push(this.repetitionValue.value);
    } else {
      expense.push(this.dateFirstValue.value);
      expense.push(this.dateLastValue.value);
    }

    this.expenses.push(expense)
    console.log(this.expenses);

    // TODO : Envoyer la nouvelle dépense au back
    // TODO : Mettre à jour les graphiques au front
  }
}
