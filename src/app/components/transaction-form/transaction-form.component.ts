import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  options: FormGroup;
  typeValue = new FormControl(false);
  freqValue = new FormControl('auto');
  selectFormControl = new FormControl('');

  constructor(
    fb: FormBuilder
  ) {
    this.options = fb.group({
      typeValue: this.typeValue,
      freqValue: this.freqValue,
    });
  }

  ngOnInit(): void {
  }

  Submit() {
    console.log("test submit");
  }

}
