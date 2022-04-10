import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

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
  public user: User = {username: "", email: ""};
  private subjectUser = new BehaviorSubject(this.user); //need to create a subject

  constructor(private http: HttpClient) { }

  getUpdate(): Observable<any> { //the receiver component calls this function
    return this.subjectUser.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public getUser(): void {
    this.http.get<User>('http://localhost:8081/user')
      .subscribe(user => {
        this.user = user;
        this.subjectUser.next(this.user);
      });
  }

  public editMail(data: ModifUser): any {
    this.http.post<User>('http://localhost:8081/editmail', data)
      .subscribe(data => {
        this.user = data;
        this.subjectUser.next(this.user);
      });
  }
}
