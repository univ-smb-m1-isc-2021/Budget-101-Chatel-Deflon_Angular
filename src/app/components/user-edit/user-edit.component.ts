import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {User, UserService} from 'src/app/services/user.service';
import {Subscription} from "rxjs";

export interface ModifUser {
  username: string;
  email: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  public user = {username: '', email: ''};
  private subscriptionUserEdit: Subscription;

  options: FormGroup;
  nicknameValue = new FormControl(this.user.username);
  emailValue = new FormControl(this.user.email);
  emailChanged = false;

  constructor(fb: FormBuilder, public userService: UserService) {
    this.options = fb.group({
      nicknameValue: this.nicknameValue,
      emailValue: this.emailValue,
    });
    this.user = this.userService.user;
    // Recharge le composant si les informations de l'utilisateur sont modifiées
    this.subscriptionUserEdit = this.userService.getUpdate()
      .subscribe((_) => {
        this.user = this.userService.user;
        this.ngOnChange();
      });
  }

  // Initialise les champs du formulaire
  ngOnInit(): void {
    this.nicknameValue = new FormControl(this.user.username);
    this.emailValue = new FormControl(this.user.email);
  }

  // Mets à jour les champs du formulaire
  ngOnChange(): void {
    this.nicknameValue = new FormControl(this.user.username);
    this.emailValue = new FormControl(this.user.email);
  }

  // Modification de l'adresse e-mail d'un utilisateur
  editUser(): void {
    const data = {username: this.nicknameValue.value, email: this.emailValue.value};
    this.userService.editMail(data);
    this.emailChanged = true; // Affiche à l'utilisateur que l'e-mail a été modifié
  }
}
