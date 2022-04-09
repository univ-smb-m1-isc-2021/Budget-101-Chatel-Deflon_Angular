import {AfterViewInit, Component, Input, OnChanges, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BudgetService} from "../../services/budget.service";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  name: string;
  lastexpense: any[];
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

  constructor(fb: FormBuilder, private budgetApi: BudgetService) {
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });
  }

  ngOnInit(): void {
    if (this.data != undefined && this.update) {
      console.log(this.data);
      this.labelValue = new FormControl(this.data.name);
      // this.amountValue = new FormControl(this.data.amount);
      this.update = false;
    }
  }

  ngOnChanges(): void {
    if (this.data != undefined && this.update) {
      this.labelValue = new FormControl(this.data.name);
      // this.amountValue = new FormControl(this.data.amount);
      this.update = false;
    }
  }

  // Modification d'un budget
  editBudget(): void {
    if (this.data != undefined) {
      let amount = this.amountValue.value;

      let budget = {
        id : this.data.id,
        name: this.labelValue.value,
        amount: this.amountValue.value,
      };

      // TODO : envoyer le nouveau budget au back
      this.budgetApi.editBudget(budget);
      // TODO : update le tableau au front
      this.budgetApi.sendUpdate("edit Budget");
    }
  }
}
