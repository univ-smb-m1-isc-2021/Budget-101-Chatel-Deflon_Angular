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
  private addBudgetUrl: string;
  private editBudgetUrl: string;
  private deleteBudgetUrl: string;
  private budgetListUrl: string;

  constructor(private http: HttpClient) {
    this.addBudgetUrl = 'http://localhost:8081/newbudget';
    this.editBudgetUrl = 'http://localhost:8081/editbudget';
    this.deleteBudgetUrl = 'http://localhost:8081/rmbudget';
    this.budgetListUrl = 'http://localhost:8081/budgets';
  }

  public getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.budgetListUrl);
  }

  public addBudget(budget: {}): void {
    console.log("Call new budget")
    console.log(budget);
    this.http.post<{}>(this.addBudgetUrl, budget).subscribe(Budget => {console.log(Budget);});
    
  }

  public editBudget(budget: {}): void {
    console.log(budget);
    this.http.post<{}>(this.editBudgetUrl, budget).subscribe(data => {console.log(data);});
  }

  public deleteBudget(budgetid: number): void {
    console.log(budgetid);
    this.http.post<{}>(this.deleteBudgetUrl, {'id':budgetid}).subscribe(data => {console.log(data);});
  }
}
