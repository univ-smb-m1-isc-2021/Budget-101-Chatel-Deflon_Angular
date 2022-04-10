import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User = { username: '', email: '' };
  private getUserUrl: string;
  private editUserUrl: string;
  private subjectUser = new BehaviorSubject<any>(this.user); //need to create a subject

  constructor(private http: HttpClient) {
    this.getUserUrl = 'http://localhost:8081/user';
    this.editUserUrl = 'http://localhost:8081/editmail';
  }

  sendUpdate(message: string) {
    //the component that wants to update something, calls this fn
    this.subjectUser.next(message); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> {
    //the receiver component calls this function
    return this.subjectUser.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public getUser(): void {
    this.http.get<User>(this.getUserUrl).subscribe((user) => {
      this.user = user;
      this.sendUpdate('init User');
    });
  }

  public editMail(data: User): any {
    console.log(data);
    return this.http.post<User>(this.editUserUrl, data);
  }
}
