import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ExpensesService} from "../../services/expenses.service";
import {BudgetService} from "../../services/budget.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  options: FormGroup;
  labelValue = new FormControl(''); // Nom du budget
  amountValue = new FormControl(''); // Montant du budget

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private router: Router
  ) {
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });

  }

  ngOnInit(): void {}

  // Ajout d'un nouveau budget
  async addNewBudget() {
    let amount = this.amountValue.value;
    if (amount == '') amount = 0.0;

    let budget = {
      name: this.labelValue.value,
      // amount: amount si amount != 0 créer une depense
    };

    // TODO : envoyer le nouveau budget au back
    await this.budgetApi.addBudget(budget);
    // TODO : update le tableau au front
    this.budgetApi.sendUpdate("add Budget");
  }
}
