import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username: string;
  email: string;
}

export interface ModifUser {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private getUserUrl: string;
  private editUserUrl: string;

  constructor(private http: HttpClient) {
    this.getUserUrl = 'http://localhost:8081/user';
    this.editUserUrl = 'http://localhost:8081/editmail';
  }

  public getUser(): any {
    return this.http.get<User>(this.getUserUrl);
  }

  public editMail(data: ModifUser): any {
    console.log(data)
    return this.http.post<User>(this.editUserUrl, data);
  }
}
