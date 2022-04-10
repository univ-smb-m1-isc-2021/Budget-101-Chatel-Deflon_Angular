import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ExpensesService} from "../../services/expenses.service";
import {BudgetService} from "../../services/budget.service";
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  options: FormGroup;
  labelValue = new FormControl(''); // Nom du budget
  amountValue = new FormControl(''); // Montant du budget
  private subscriptionBudgetForm: Subscription;

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });

    this.subscriptionBudgetForm = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.ngOnChanges();
      });

  }

  ngOnInit(): void {}

  ngOnChanges(): void {}

  // Ajout d'un nouveau budget
  addNewBudget() {
    let budget = {
      name: this.labelValue.value,
    };

    let amount = this.amountValue.value;
    if (amount != '') {
      this.budgetApi.addBudgetWithValue(budget, this.amountValue.value);
    } else {
      this.budgetApi.addBudget(budget);
    }
  }
}
