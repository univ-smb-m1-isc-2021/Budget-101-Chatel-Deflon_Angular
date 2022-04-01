import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  label: string;
  amount: number;
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

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      labelValue: this.labelValue,
      amountValue: this.amountValue
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.data != undefined && this.update) {
      this.labelValue = new FormControl(this.data.label);
      this.amountValue = new FormControl(this.data.amount);
      this.update = false;
    }
  }

  // Modification d'un budget
  editBudget(): void {
    console.log("-- EDIT BUDGET --");
    if (this.data != undefined) {
      this.data.label = this.labelValue.value;
      this.data.amount = this.amountValue.value;

      if (this.data.amount == null) this.data.amount = 0.0;

      console.log(this.data);
      // TODO : envoyer le budget modifié au back
      // TODO : update le front avec la nouvelle liste de budgets
    }
  }
}
