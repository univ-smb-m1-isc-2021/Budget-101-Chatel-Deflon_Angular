import { Component, OnInit } from '@angular/core';
import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

export interface Budget {
  id: number;
  name: string;
}

export interface Expenses {
  id: number;
  amount: number;
  label: string;
  budgetid : number;
}

@Component({
  selector: 'app-managing-data',
  templateUrl: './managing-data.component.html',
  styleUrls: ['./managing-data.component.css']
})
export class ManagingDataComponent implements OnInit {
  public budgets: Budget[] = [];
  public expenses: Expenses[] = [];

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!authService.isAuthenticated()) {
      this.router.navigate(["/connexion"]);
    } else {
      budgetApi.getBudgets().subscribe(
        budgets => {
          this.budgets = budgets;
        }
      );

      expensesApi.getExpenses().subscribe(
        expenses => {
          this.expenses = expenses;
        }
      );
    }
  }

  ngOnInit(): void {
  }

}
