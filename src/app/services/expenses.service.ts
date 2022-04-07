import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {formatDate} from "@angular/common";

export interface Expense {
  id: number;
  amount: number;
  label: string;
  budgetid : number;
  date: string;
  start: string;
  end: string;
  repetition: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private addPunctualExpenseUrl: string;
  private addReccurentExpenseUrl: string;
  private addSpreadExpenseUrl: string;
  private editExpenseUrl: string;
  private deleteExpenseUrl: string;
  private expensesListUrl: string;

  constructor(private http: HttpClient) {
    this.addPunctualExpenseUrl = 'http://localhost:8081/newpuncexpense';
    this.addReccurentExpenseUrl = 'http://localhost:8081/newrecexpense';
    this.addSpreadExpenseUrl = 'http://localhost:8081/newsprexpense';
    this.editExpenseUrl = 'http://localhost:8081/editexpense';
    this.deleteExpenseUrl = 'http://localhost:8081/rmexpense';
    this.expensesListUrl = 'http://localhost:8081/expenses';
  }

  public getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expensesListUrl);
  }

  public addPunctualExpense(expense: {}): void {
    this.http.post<{}>(this.addPunctualExpenseUrl, expense).subscribe(expense => console.log("Punctual expense ok"));
  }

  public addReccurentExpense(expense: {}): void {
    this.http.post<{}>(this.addReccurentExpenseUrl, expense).subscribe(expense => console.log("Reccurent expense ok"));
  }

  public addSpreadExpense(expense: {}): void {
    this.http.post<{}>(this.addSpreadExpenseUrl, expense).subscribe(expense => console.log("Spread expense ok"));
  }

  public editExpense(expense: {}): void {
    console.log(expense);
    this.http.post<{}>(this.editExpenseUrl, expense);
  }

  public deleteExpense(expenseid: number): void {
    console.log(expenseid);
    this.http.post<{}>(this.deleteExpenseUrl, {id: expenseid}).subscribe(expense => console.log("Expense rm"));
  }
}
