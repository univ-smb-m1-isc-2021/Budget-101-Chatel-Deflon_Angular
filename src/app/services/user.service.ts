import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface User{
  username: string, email: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserUrl: string;

  constructor(private http: HttpClient) {
    this.getUserUrl = 'http://localhost:8081/user';
  }

  public getUser(): any {
    return this.http.get<User>(this.getUserUrl);
  }
}
