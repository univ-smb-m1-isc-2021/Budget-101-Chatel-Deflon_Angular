import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Budget {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgetListUrl: string;

  constructor(private http: HttpClient) {
    this.budgetListUrl = 'http://localhost:8081/budgets';
  }

  public getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.budgetListUrl);
  }
}
