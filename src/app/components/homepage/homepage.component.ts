import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public hello: string[] = [];
  public budgets: any[] = [];
  public expenses: any[] = [];

  constructor(
    // private apiService: ApiService,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!authService.isAuthenticated()) {
      this.router.navigate(["/connexion"]);
    }
  }

  ngOnInit(): void {
    // this.apiService.getHello().subscribe(data => {
    //   this.hello = data;
    // })

    this.budgetApi.getBudgets().subscribe(
      budgets => {
        this.budgets = budgets;
      }
    );

    this.expensesApi.getExpenses().subscribe(
      expenses => {
        this.expenses = expenses;
      }
    )
  }


  // removeTodos(): void {
  //   this.todos = [];
  // }

}
