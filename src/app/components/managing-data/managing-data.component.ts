import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  constructor(
    private cdr:ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    if (!authService.isAuthenticated()) {
      this.router.navigate(["/connexion"]);
    }
  }

  ngOnInit(): void {
  }

}
