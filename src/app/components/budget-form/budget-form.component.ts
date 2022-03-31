import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  budget: any[] = [];

  options: FormGroup;
  labelValue = new FormControl(''); // Nom du budget
  amountValue = new FormControl(''); // Montant du budget

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });

  }

  ngOnInit(): void {
  }

  addNewBudget(): void {
    console.log("-- NEW BUDGET --");
    let label = this.labelValue.value;
    let amount = this.amountValue.value;

    if (amount == '') amount = 0.0;

    this.budget.push([label, amount]); // solde initial du budget

    console.log(this.budget);
  }
}
