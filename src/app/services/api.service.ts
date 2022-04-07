import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private springUrl: string;

  constructor(private http: HttpClient) {
    this.springUrl = 'http://localhost:8081/api/test';
  }

  public getHello(): Observable<string[]> {
    return this.http.get<string[]>(this.springUrl);
  }
}
