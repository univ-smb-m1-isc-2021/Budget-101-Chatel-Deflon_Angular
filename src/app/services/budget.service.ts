import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

export interface Budget {
  id: number;
  name: string;
  amount: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  public budgets: Budget[] = [];
  private subjectBudget = new BehaviorSubject(this.budgets);

  constructor(private http: HttpClient) {}

  getUpdate(): Observable<any> {
    return this.subjectBudget.asObservable();
  }

  public getBudgets(): void {
    this.http.get<Budget[]>('http://localhost:8081/budgets')
      .subscribe(
        data => {
          this.budgets = data;
          this.subjectBudget.next(this.budgets);
        }
      );
  }

  public addBudget(budget: {}): void {
    this.http.post<Budget>('http://localhost:8081/newbudget', budget)
      .subscribe(data => {
        this.budgets.push(data);
        this.subjectBudget.next(this.budgets);
      });
  }

  public editBudget(budget: Budget): void {
    this.http.post<Budget>('http://localhost:8081/editbudget', budget)
      .subscribe(data => {
        this.budgets = this.budgets.map(budget => budget.id == data.id ? data : budget);
        this.subjectBudget.next(this.budgets);
      });
  }

  public deleteBudget(budgetid: number): void {
    console.log(budgetid);
    this.http.post('http://localhost:8081/rmbudget', {
      id: budgetid
    }).subscribe(response => {
      this.budgets = this.budgets.filter(budget => budget.id !== budgetid);
      this.subjectBudget.next(this.budgets);
    });
  }
}
