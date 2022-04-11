interface MyApiResponse {
  token: string;
}

import {HttpClient, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  cachedRequests: Array<HttpRequest<any>> = [];

  public username: String = '';
  public password: String = '';

  constructor(private http: HttpClient) {
  }

  // Stockage du token jwt
  setToken(token: string) {
    return localStorage.setItem('jwt', token);
  }

  // Récupération du token jwt
  getToken() {
    return localStorage.getItem('jwt');
  }

  // Connexion d'un utilisateur
  login(username: string, password: string) {
    return this.http.post<MyApiResponse>(
      'http://localhost:8081/authenticate',
      {username, password},
    );
  }

  // Inscription d'un nouvel utilisateur
  register(email: string, username: string, password: string) {
    return this.http.post('http://localhost:8081/register',
      {username, password, email},
    );
  }

  // Vérifie si l'utilisateur est connecté
  public isAuthenticated(): boolean {
    const token = this.getToken(); // Récupère le jwt token
    return (token !== null); // Retourne si le token est null ou non
  }

  // Recupere les requêtes échouées
  public collectFailedRequest(request: any): void {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  // Deconnexion
  logout() {
    localStorage.removeItem('jwt');
    this.username = "";
    this.password = "";
  }
}
