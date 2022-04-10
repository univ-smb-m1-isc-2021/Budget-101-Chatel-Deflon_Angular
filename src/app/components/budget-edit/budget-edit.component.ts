import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BudgetService} from "../../services/budget.service";
import {formatDate} from "@angular/common";
import {ExpensesService} from "../../services/expenses.service";

export interface Budget {
  id: number;
  name: string;
  lastexpense: any[];
  userId: number;
}

@Component({
  selector: 'app-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.css']
})
export class BudgetEditComponent implements OnInit, OnChanges {
  @Input() data: Budget | undefined;
  @Input() update: boolean = false;

  options: FormGroup;
  labelValue = new FormControl(''); // Nom du budget
  amountValue = new FormControl(''); // Montant du budget

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    // Paramétrage du formulaire de modification de budget
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });
  }

  ngOnInit(): void {
    if (this.data != undefined && this.update) {
      this.labelValue = new FormControl(this.data.name);
      this.update = false;
    }
  }

  ngOnChanges(): void {
    if (this.data != undefined && this.update) {
      this.labelValue = new FormControl(this.data.name);
      this.update = false;
    }
  }

  // Modification d'un budget
  editBudget(): void {
    if (this.data != undefined) {
      // Si une valeur est donnée au budget, une dépense est ajoutée pour correspondre à la valeur
      if (this.amountValue.value != '') {
        this.expensesApi.addPunctualExpense({
          label: 'Montant mis à jour ' + this.labelValue.value,
          amount: this.amountValue.value,
          date: formatDate(new Date(), "yyyy-MM-dd", "en"),
          type: "PUNCTUAL",
          budgetId: this.data.id
        });
      }

      // Ajout du nouveau budget
      let budget = {
        id : this.data.id,
        name: this.labelValue.value,
        amount: this.amountValue.value,
        userId: this.data.userId
      };

      // Call du service en lien avec l'API
      this.budgetApi.editBudget(budget);
    }
  }
}
