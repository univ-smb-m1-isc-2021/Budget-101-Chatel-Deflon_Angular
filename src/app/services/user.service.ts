import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

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
  private subjectUser = new BehaviorSubject(this.user);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router) { }

  // Notifie les composants qui utilisent le service qu'il y a eu une modification
  getUpdate(): Observable<any> {
    return this.subjectUser.asObservable();
  }

  // Récupère l'utilisateur courant
  public getUser(): void {
    this.http.get<User>('http://localhost:8081/user')
      .subscribe(user => {
        this.user = user;
        this.subjectUser.next(this.user);
      });
  }

  // Modifie l'email de l'utilisateur
  public editMail(data: ModifUser): any {
    this.http.post<User>('http://localhost:8081/editmail', data)
      .subscribe(data => {
        this.user = data;
        this.subjectUser.next(this.user);
      });
  }

  // Supprime l'utilisateur courant et toutes ses données
  public deleteUser(): void {
    this.http.get('http://localhost:8081/removeuser')
      .subscribe( resp => {
        this.authService.logout();
        this.router.navigate(['/connexion']);
      });
  }
}
