import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";
import {BudgetService} from "../../services/budget.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public username: string = "";
  private subscriptionUser: Subscription;

  constructor(
    public auth: AuthService,
    public userService: UserService,
    public expensesApi: ExpensesService,
    public budgetApi: BudgetService,
    private router: Router
  ) {
    this.loadData();
    this.username = this.userService.user.username;
    this.subscriptionUser = this.userService.getUpdate()
      .subscribe((_) => {
        this.username = this.userService.user.username;
        this.ngOnChange();
      });


  }

  async loadData() {
    await this.userService.getUser();
    await this.expensesApi.getExpenses();
    await this.budgetApi.getBudgets();

    this.userService.sendUpdate("init user");
    this.expensesApi.sendUpdate("init expenses");
    this.budgetApi.sendUpdate("init budget");
  }

  ngOnInit(): void {
    this.username = this.userService.user.username;
  }

  ngOnChange(): void {
    this.username = this.userService.user.username;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/connexion']);
  }
}
