import { Component, OnInit } from '@angular/core';import {BudgetService} from "../../services/budget.service";
import {ExpensesService} from "../../services/expenses.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor(
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
