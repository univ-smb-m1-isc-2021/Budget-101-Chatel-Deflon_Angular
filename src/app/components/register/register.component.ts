import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  username: string = '';
  password: string = '';
  errorMessage = 'Invalid Credentials';
  successMessage: string = '';
  invalidRegister = false;

  options: FormGroup;
  emailValue = new FormControl('');
  usernameValue = new FormControl('');
  passwordValue = new FormControl('');

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.options = fb.group({
      emailValue: this.emailValue,
      usernameValue: this.usernameValue,
      passwordValue: this.passwordValue
    })
  }

  ngOnInit() {}

  onSubmit() {
    this.invalidRegister = false;
    this.email = this.emailValue.value;
    this.username = this.usernameValue.value;
    this.password = this.passwordValue.value;
    console.log(this.email + ', ' + this.username + ', ' + this.password);
    this.handleRegister();
  }

  handleRegister() {
    console.log("register");
    this.authenticationService
      .register(this.email, this.username, this.password)
      .subscribe(
        result => {
          console.log(result);
          console.log("INSCRIPTION REUSSIE");
          this.router.navigate(["/connexion"]);
        },
        error => {
          // console.log("CONNEXION ECHOUEE")
          this.invalidRegister = true;
        }
      );
  }
}
