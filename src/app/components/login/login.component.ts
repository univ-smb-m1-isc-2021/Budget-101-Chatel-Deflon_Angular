import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage = 'Invalid Credentials';
  successMessage: string = '';
  invalidLogin = false;
  loginSuccess = false;

  options: FormGroup;
  usernameValue = new FormControl('');
  passwordValue = new FormControl('');

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.options = fb.group({
      usernameValue: this.usernameValue,
      passwordValue: this.passwordValue
    })
  }

  ngOnInit() {
  }

  // Soumission du formulaire de connexion
  onSubmit() {
    this.invalidLogin = false;
    this.username = this.usernameValue.value;
    this.password = this.passwordValue.value;
    console.log(this.username + ', ' + this.password);
    this.handleLogin();
  }

  // Gestion de l'authentification
  handleLogin() {
    this.authenticationService
      .login(this.username, this.password)
      .subscribe(
        result => {
          // Si l'authentification est réussie, redirection vers l'accueil du site
          this.authenticationService.setToken(result.token);
          this.router.navigate(["/"]);
        },
        error => {
          this.invalidLogin = true;
        }
      );
  }
}
