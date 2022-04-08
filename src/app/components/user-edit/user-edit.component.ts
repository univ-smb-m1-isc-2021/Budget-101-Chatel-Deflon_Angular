import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  public user = { username: '', email: '' }; // TODO : rplace avec un get

  options: FormGroup;
  nicknameValue = new FormControl(this.user.username); // Nom du budget
  emailValue = new FormControl(this.user.email); // Montant du budget
  passwordValue = new FormControl(''); // Montant du budget
  oldPasswordValue = new FormControl(''); // Montant du budget

  constructor(fb: FormBuilder, public userService: UserService) {
    this.options = fb.group({
      nicknameValue: this.nicknameValue,
      emailValue: this.emailValue,
      passwordValue: this.passwordValue,
      oldPasswordValue: this.oldPasswordValue,
    });
    userService.getUser().subscribe((data: any) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    // this.nicknameValue = new FormControl(this.data.label);
    // this.emailValue = new FormControl(this.data.amount);
    // this.passwordValue = new FormControl(this.data.amount);
  }

  editUser(): void {
    console.log('edit user');
  }
}
