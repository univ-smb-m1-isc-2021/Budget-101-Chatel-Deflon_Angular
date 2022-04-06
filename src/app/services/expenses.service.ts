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
  private expenseListUrl: string;

  constructor(private http: HttpClient) {
    this.expenseListUrl = 'http://localhost:8081/expenses';
  }

  //
  public getExpenses(): Observable<Expense[]> {
    // return new Observable<Expense[]>( observer => {
    //   [
    //     { id: 1, name: "Repas midi",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Voiture', frequency: 'Journalière' },
    //     { id: 2, name: "Plein d'essence",amount: 200, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Courses', frequency: 'Hebdomadaire' },
    //     { id: 3, name: "Virement maman",amount: 150, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Rénovations', frequency: '--' },
    //     { id: 4, name: "Pension Henry",amount: 120, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Vacances', frequency: 'Hebdomadaire' },
    //     { id: 5, name: "Révision annuelle voiture",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Voiture', frequency: 'Annuel' },
    //   ]
    // });

    return this.http.get<Expense[]>(this.expenseListUrl);
  }
}
