import {Component, OnInit} from '@angular/core';
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
    // Initialisation des paramètres du formulaire
    this.options = fb.group({
      emailValue: this.emailValue,
      usernameValue: this.usernameValue,
      passwordValue: this.passwordValue
    })
  }

  ngOnInit() {
  }

  // Soumission du formulaire d'inscription
  onSubmit() {
    this.invalidRegister = false;
    this.email = this.emailValue.value;
    this.username = this.usernameValue.value;
    this.password = this.passwordValue.value;
    console.log(this.email + ', ' + this.username + ', ' + this.password);
    this.handleRegister();
  }

  // Gestion de l'inscription d'un utilisateur
  handleRegister() {
    this.authenticationService
      .register(this.email, this.username, this.password)
      .subscribe(
        result => {
          // Si l'inscription est réussite, l'utilisateur est redirigé vers la page de connexion
          this.router.navigate(["/connexion"]);
        },
        error => {
          this.invalidRegister = true;
        }
      );
  }
}
