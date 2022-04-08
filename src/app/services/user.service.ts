import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

// export interface User{

// }

export class UserService {
  private getUserUrl: string;

  constructor(private http: HttpClient) {
    this.getUserUrl = 'http://localhost:8081/user';
  }

  public getUser(): any {
    return this.http.get<any>(this.getUserUrl);
  }
}
