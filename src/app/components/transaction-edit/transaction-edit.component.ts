import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

// TODO : retirer les id après avoir fini le debug
export interface Transaction {
  id: number;
  label: string;
  amount: number;
  date : string;
  enddate: string;
  budget: string;
  frequency: string;
}

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.css']
})
export class TransactionEditComponent implements OnInit, OnChanges {
  @Input() budgetsT: any[] | undefined;
  @Input() dataT: Transaction | undefined;
  @Input() updateT: boolean = false;

  options: FormGroup;
  label = new FormControl(''); // Nom de la dépense
  amount = new FormControl(''); // Montant de la dépense
  date = new FormControl(''); // Date de la dépense
  enddate = new FormControl(''); // Date de fin de la dépense (si étalé)
  budget = new FormControl(''); // Budget lié à la dépense
  frequency = new FormControl(''); // Fréquence de la dépense

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      label: this.label,
      amount: this.amount,
      date: this.date,
      enddate: this.enddate,
      budget: this.budget,
      frequency: this.frequency
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.dataT != undefined && this.updateT) {
      this.label = new FormControl(this.dataT.label);
      this.amount = new FormControl(this.dataT.amount);
      this.date = new FormControl(this.dataT.date);
      this.enddate = new FormControl(this.dataT.enddate);
      this.budget = new FormControl(this.dataT.budget);
      this.frequency = new FormControl(this.dataT.frequency);
      this.updateT = false;
    }
  }

  // Modification d'un budget
  editBudget(): void {
    console.log("-- EDIT BUDGET --");
    if (this.dataT != undefined) {
      this.dataT.label = this.label.value;
      this.dataT.amount = this.amount.value;

      if (this.dataT.amount == null) this.dataT.amount = 0.0;

      this.dataT.date = this.date.value;
      this.dataT.enddate = this.enddate.value;
      this.dataT.budget = this.budget.value;
      this.dataT.frequency = this.frequency.value;

      console.log(this.dataT);
      // TODO : envoyer le budget modifié au back
      // TODO : update le front avec la nouvelle liste de budgets
    }
  }
}

