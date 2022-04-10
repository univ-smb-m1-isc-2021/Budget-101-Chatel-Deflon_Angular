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
  private subjectBudget = new BehaviorSubject<any>(this.budgets); //need to create a subject

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

  sendUpdate(message: string) { //the component that wants to update something, calls this fn
    this.subjectBudget.next(message); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> { //the receiver component calls this function
    return this.subjectBudget.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public getBudgets(): void {
    this.http.get<Budget[]>(this.budgetListUrl)
      .subscribe(
        data => {
          this.budgets = data;
          this.sendUpdate("getbudgets");
        }
      );
  }

  public addBudgetLocal(budget: any): void {
    this.budgets.push( {
      id: budget.id,
      name: budget.name,
      amount: budget.amount,
      userId: budget.userId
    });
  }

  public addBudget(budget: {}): void {
    this.http.post<Budget>(this.addBudgetUrl, budget)
      .subscribe(data => {
        this.addBudgetLocal(data);
      });
  }

  public editBudgetLocal(budget: Budget): void {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == budget.id) {
        this.budgets[i].id = budget.id;
        this.budgets[i].name = budget.name;
        this.budgets[i].amount = budget.amount;
        this.budgets[i].userId = budget.userId;
      }
    }
  }

  public editBudget(budget: Budget): void {
    this.editBudgetLocal(budget);
    this.http.post<{}>(this.editBudgetUrl, budget)
      .subscribe(data => {console.log(data);});
  }

  public rmBudgetLocal(budgetid: number) {
    let newBudgets = [];
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id !== budgetid) newBudgets.push(this.budgets[i]);
    }
    this.budgets = newBudgets;
  }

  public deleteBudget(budgetid: number): void {
    this.rmBudgetLocal(budgetid);
    this.http.post<{}>(this.deleteBudgetUrl, {'id':budgetid}).subscribe();
  }
}
