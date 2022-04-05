import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.css']
})
export class UserInformationsComponent implements OnInit {
  public user = { pseudo: "Luke", email: "lukesky@hotmail.fr" }; // TODO : replace avec un getCurrentUser()

  constructor() { }

  ngOnInit(): void {
  }
}
