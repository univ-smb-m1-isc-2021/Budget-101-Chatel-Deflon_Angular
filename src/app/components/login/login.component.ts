// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { filter, Subject, take, takeUntil } from 'rxjs';
// import {AuthService} from "../../services/auth.service";

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit, OnDestroy {

//   public connexion = true;
//   public inscription = false;
//   public loginValid = true;
//   public inscValid = true;

//   public username = '';
//   public email = '';
//   public password = '';

//   private _destroySub$ = new Subject<void>();
//   private readonly returnUrl: string;

//   constructor(
//     private _route: ActivatedRoute,
//     private _router: Router,
//     private _authService: AuthService
//   ) {
//     this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/game';
//   }

//   public ngOnInit(): void {
//     // this._authService.isAuthenticated$.pipe(
//     //   filter((isAuthenticated: boolean) => isAuthenticated),
//     //   takeUntil(this._destroySub$)
//     // ).subscribe( _ => this._router.navigateByUrl(this.returnUrl));
//   }

//   public ngOnDestroy(): void {
//     this._destroySub$.next();
//   }

//   public logIn(): void {
//     this.loginValid = false; // display error message
//     this.inscValid = true; // hide other message

//     this._authService.login(this.username, this.password)
//     // .pipe(
//     //   take(1)
//     // )
//     // .subscribe({
//     //   next: _ => {
//     //     this.loginValid = true;
//     //     this._router.navigateByUrl('/');
//     //   },
//     //   error: _ => this.loginValid = false
//     // });
//   }

//   public inscriptionUser(): void {
//     this.inscValid = false; // display error message
//     this.loginValid = true; // hide other message
//   }

// }

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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

  ngOnInit() {}

  onSubmit() {
    this.invalidLogin = false;
    this.username = this.usernameValue.value;
    this.password = this.passwordValue.value;
    console.log(this.username + ', ' + this.password);
    this.handleLogin();
  }

  handleLogin() {
    console.log("login");
    this.authenticationService
      .login(this.username, this.password)
      .subscribe(
        result => {
          console.log("CONNEXION REUSSIE");
          console.log('logged', result)
          console.log(this.authenticationService.getToken());
          this.router.navigate(["/"]);
          // this.invalidLogin = false;
          // this.loginSuccess = true;
          // this.successMessage = 'Login Successful.';
          // this.router.navigate(['/hello-world']);
        },
        error => {
          console.log("CONNEXION ECHOUEE")
          this.invalidLogin = true;
          console.log(this.authenticationService.getToken());
        }
      );
  }
}
