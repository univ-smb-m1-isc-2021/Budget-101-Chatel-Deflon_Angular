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
  private subjectName = new BehaviorSubject(this.expenses);

  constructor(private http: HttpClient) { }

  // Notifie les composants qui utilisent le service qu'il y a eu une modification
  getUpdate(): Observable<any> {
    return this.subjectName.asObservable();
  }

  // Récupère les dépenses de l'utilisateur
  public getExpenses(): void {
    this.http.get<Expense[]>('http://localhost:8081/expenses')
      .subscribe(
        data => {
          this.expenses = data;
          this.subjectName.next(this.expenses);
        }
      );
  }

  // Ajoute une dépense ponctuelle
  public addPunctualExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newpuncexpense', expense)
      .subscribe( data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  // Ajoute une dépense récurrente
  public addRecurrentExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newrecexpense', expense)
      .subscribe( data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  // Ajoute une dépense étalée
  public addSpreadExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/newsprexpense', expense)
      .subscribe(data => {
        this.expenses.push(data);
        this.subjectName.next(this.expenses);
      });
  }

  // Modifie une dépense ponctuelle
  public editPunctualExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editpuncexpense', expense)
      .subscribe( data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  // Modifie une dépense récurrente
  public editRecurrentExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editrecexpense', expense)
      .subscribe( data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  // Modifie une dépense étalée
  public editSpreadExpense(expense: {}): void {
    this.http.post<any>('http://localhost:8081/editsprexpense', expense)
      .subscribe(data => {
        this.expenses = this.expenses.map(expense => expense.id == data.id ? data : expense);
        this.subjectName.next(this.expenses);
      });
  }

  // Supprime une dépense
  public deleteExpense(expenseid: number): void {
    this.http.post('http://localhost:8081/rmexpense', {
      id: expenseid
    }).subscribe(response => {
        this.expenses = this.expenses.filter(expense => expense.id !== expenseid);
        this.subjectName.next(this.expenses);
      });
  }
}
