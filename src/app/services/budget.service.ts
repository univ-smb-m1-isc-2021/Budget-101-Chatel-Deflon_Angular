import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {formatDate} from "@angular/common";
import {ExpensesService} from "./expenses.service";

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

  constructor(private http: HttpClient, private expensesApi: ExpensesService) {
  }

  // Notifie les composants qui utilisent ce service d'une modification
  getUpdate(): Observable<any> {
    return this.subjectBudget.asObservable();
  }

  // Récupère les Budgets de l'utilisateurs
  public getBudgets(): void {
    this.http.get<Budget[]>('http://gunter-101.oups.net/budgets')
      .subscribe(
        data => {
          this.budgets = data;
          this.subjectBudget.next(this.budgets);
        }
      );
  }

  // Ajoute un budget
  public addBudget(budget: {}): void {
    this.http.post<Budget>('http://gunter-101.oups.net/newbudget', budget)
      .subscribe(data => {
        this.budgets.push(data);
        this.subjectBudget.next(this.budgets);
      });
  }

  // Ajoute un budget avec une valeur initiale
  public addBudgetWithValue(budget: {}, amount: number): void {
    this.http.post<Budget>('http://gunter-101.oups.net/newbudget', budget)
      .subscribe(data => {
        this.budgets.push(data);
        this.subjectBudget.next(this.budgets);

        this.expensesApi.addPunctualExpense({
          label: 'Montant initial ' + data.name,
          amount: amount,
          date: formatDate(new Date(), "yyyy-MM-dd", "en"),
          type: "PUNCTUAL",
          budgetId: data.id
        });
      });
  }

  // Modifie un budget existant
  public editBudget(budget: Budget): void {
    this.http.post<Budget>('http://gunter-101.oups.net/editbudget', budget)
      .subscribe(data => {
        this.budgets = this.budgets.map(budget => budget.id == data.id ? data : budget);
        this.subjectBudget.next(this.budgets);
      });
  }

  // Supprime un budget
  public deleteBudget(budgetid: number): void {
    console.log(budgetid);
    this.http.post('http://gunter-101.oups.net/rmbudget', {
      id: budgetid
    }).subscribe(response => {
      this.budgets = this.budgets.filter(budget => budget.id !== budgetid);
      this.subjectBudget.next(this.budgets);
    });
  }
}
