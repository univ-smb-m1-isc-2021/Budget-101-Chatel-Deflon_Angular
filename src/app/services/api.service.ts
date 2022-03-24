import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


// export interface Todo {
//   completed: boolean;
//   id: number;
//   title: string;
//   userId: number;
// }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private springUrl: string;

  constructor(private http: HttpClient) {
    this.springUrl = 'http://localhost:8080/api/test';
  }

  public getHello(): Observable<string[]> {
    return this.http.get<string[]>(this.springUrl);
  }

  // getTodos(): Observable<Todo[]> {
  //   return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
  // }
}
