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
  private subjectName = new BehaviorSubject<any>(this.expenses); //need to create a subject

  private addPunctualExpenseUrl: string;
  private addRecurrentExpenseUrl: string;
  private addSpreadExpenseUrl: string;
  private editExpenseUrl: string;
  private deleteExpenseUrl: string;
  private expensesListUrl: string;

  constructor(private http: HttpClient) {
    this.addPunctualExpenseUrl = 'http://localhost:8081/newpuncexpense';
    this.addRecurrentExpenseUrl = 'http://localhost:8081/newrecexpense';
    this.addSpreadExpenseUrl = 'http://localhost:8081/newsprexpense';
    this.editExpenseUrl = 'http://localhost:8081/editexpense';
    this.deleteExpenseUrl = 'http://localhost:8081/rmexpense';
    this.expensesListUrl = 'http://localhost:8081/expenses';
  }

  sendUpdate(message: string) { //the component that wants to update something, calls this fn
    this.subjectName.next(message); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> { //the receiver component calls this function
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public getExpenses(): void {
    this.http.get<Expense[]>(this.expensesListUrl)
      .subscribe(
        data => {
          this.expenses = data;
          this.sendUpdate("init");
        }
      );
  }

  public addExpenseLocal(expense: any): void {
    this.expenses.push( {
      amount: expense.amount,
      budgetId : expense.budgetId ,
      date: expense.date,
      id: expense.id,
      label: expense.label,
      start: expense.start,
      end: expense.end,
      repetition: expense.repetition,
      userId: expense.userId,
      type: expense.type,
    })
  }

  public addPunctualExpense(expense: {}): void {
    this.http.post<any>(this.addPunctualExpenseUrl, expense)
      .subscribe( data => {
        this.addExpenseLocal(data)
      });
    this.sendUpdate("add expense");
  }

  public addRecurrentExpense(expense: {}): void {
    this.http.post<any>(this.addRecurrentExpenseUrl, expense)
      .subscribe( data => {
        this.addExpenseLocal(data)
        }
      );
  }

  public addSpreadExpense(expense: {}): void {
    this.addExpenseLocal(expense)
    this.http.post<any>(this.addSpreadExpenseUrl, expense)
      .subscribe(data => {
        this.addExpenseLocal(data)
      });
  }

  public editExpenseLocal(expense: Expense): void {
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i].id == expense.id) {
        this.expenses[i] = expense;
        break;
      }
    }
  }

  public editExpense(expense: Expense): void {
    this.editExpenseLocal(expense);
    this.http.post<{}>(this.editExpenseUrl, expense);
  }

  public rmExpenseLocal(expenseid: number) {
    let newExpenses = [];
    for (let i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i].id !== expenseid) newExpenses.push(this.expenses[i]);
    }
    this.expenses = newExpenses;
  }

  public deleteExpense(expenseid: number): void {
    this.rmExpenseLocal(expenseid);
    this.http.post<{}>(this.deleteExpenseUrl, {id: expenseid})
      .subscribe();
  }
}
