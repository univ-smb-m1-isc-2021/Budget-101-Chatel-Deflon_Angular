// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private loginUrl: string;

//   constructor(private http: HttpClient) {
//     this.loginUrl = 'http://localhost:8081/login';
//   }

//   public login(username: string, password: string): void {
//     console.log("login")
//     this.http.post<{}>(this.loginUrl, {username: username, password: password});
//   }
// }

interface MyApiResponse {
  token: string;
}

import {HttpClient, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BASE_PATH: 'http://localhost:8080'
  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';
  cachedRequests: Array<HttpRequest<any>> = [];

  public username: String = '';
  public password: String = '';

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem('jwt');
  }

  login(username: string, password: string) {
    return this.http.post<MyApiResponse>(
      'http://localhost:8081/authenticate',
      {username, password},
    ).pipe(tap((response: MyApiResponse) => {
      console.log("LALALILALOU : " + response.token);
      if (response) {
        localStorage.setItem('jwt', response.token);
      }
    }));
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return (token !== null);
    // return tokenNotExpired(null, token);
  }

  public collectFailedRequest(request: any): void {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  // createBasicAuthToken(username: String, password: String) {
  //   return 'Basic ' + window.btoa(username + ':' + password);
  // }
  //
  // registerSuccessfulLogin(username : string, password : string) {
  //   sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username);
  // }

  logout() {
    localStorage.removeItem('jwt');
    // sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.username = "";
    this.password = "";
  }

  // isUserLoggedIn() {
  //   let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
  //   if (user === null) return false;
  //   return true;
  // }
  //
  // getLoggedInUserName() {
  //   let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
  //   if (user === null) return '';
  //   return user;
  // }
}
