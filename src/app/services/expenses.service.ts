import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {formatDate} from "@angular/common";

export interface Expense {
  id: number;
  amount: number;
  label: string;
  budgetid : number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private addExpenseUrl: string;
  private editExpenseUrl: string;
  private deleteExpenseUrl: string;
  private expensesListUrl: string;

  constructor(private http: HttpClient) {
    this.addExpenseUrl = 'http://localhost:8081/addexpense';
    this.editExpenseUrl = 'http://localhost:8081/editexpense';
    this.deleteExpenseUrl = 'http://localhost:8081/deleteexpense';
    this.expensesListUrl = 'http://localhost:8081/expenses';
  }

  public getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expensesListUrl);
  }

  public addExpense(expense: {}): void {
    console.log(expense);
    this.http.post<{}>(this.addExpenseUrl, expense);
  }

  public editExpense(expense: {}): void {
    console.log(expense);
    this.http.post<{}>(this.editExpenseUrl, expense);
  }

  public deleteExpense(expenseid: number): void {
    console.log(expenseid);
    this.http.post<{}>(this.deleteExpenseUrl, expenseid);
  }
}
