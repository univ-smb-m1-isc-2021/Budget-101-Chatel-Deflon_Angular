import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";

export interface Expense {
  id: number;
  amount: number;
  label: string;
  budgetId : number;
  date: string;
  start: string;
  end: string;
  repetition: string;
  type: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  public expenses: Expense[] = [];
  private subjectName = new BehaviorSubject(this.expenses); //need to create a subject

  constructor(private http: HttpClient) { }

  getUpdate(): Observable<any> { //the receiver component calls this function
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public getExpenses(): void {
    this.http.get<Expense[]>('http://localhost:8081/expenses')
      .subscribe(
        data => {
          this.expenses = data;
          this.subjectName.next(this.expenses);
        }
      );
  }

  public addPunctualExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newpuncexpense', expense)
      .subscribe( data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  public addRecurrentExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newrecexpense', expense)
      .subscribe( data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  public addSpreadExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newsprexpense', expense)
      .subscribe(data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  public editPunctualExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editpuncexpense', expense)
      .subscribe( data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  public editRecurrentExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editrecexpense', expense)
      .subscribe( data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  public editSpreadExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editsprexpense', expense)
      .subscribe(data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  public deleteExpense(expenseid: number): void {
    this.http.post('http://localhost:8081/rmexpense', {
      id: expenseid
    }).subscribe(response => {
        this.expenses = this.expenses.filter(expense => expense.id !== expenseid);
        this.subjectName.next(this.expenses);
      });
  }
}
