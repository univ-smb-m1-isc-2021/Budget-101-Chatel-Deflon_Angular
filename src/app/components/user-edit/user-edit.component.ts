import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public user = { pseudo: "Luke", email: "lukesky@hotmail.fr" }; // TODO : rplace avec un get

  options: FormGroup;
  nicknameValue = new FormControl(this.user.pseudo); // Nom du budget
  emailValue = new FormControl(this.user.email); // Montant du budget
  passwordValue = new FormControl(''); // Montant du budget

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      nicknameValue: this.nicknameValue,
      emailValue: this.emailValue,
      passwordValue: this.passwordValue,
    });
  }

  ngOnInit(): void {
    // this.nicknameValue = new FormControl(this.data.label);
    // this.emailValue = new FormControl(this.data.amount);
    // this.passwordValue = new FormControl(this.data.amount);
  }

  editUser(): void {
    console.log("edit user");
  }

}
