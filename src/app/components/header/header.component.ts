import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
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
    // Recharge le composant si les informations de l'utilisateur courant sont mises à jour
    this.subscriptionUser = this.userService.getUpdate()
      .subscribe((_) => {
        this.username = this.userService.user.username;
        this.ngOnChange();
      });
  }

  // Premier appel aux API pour récupérer les listes des dépenses, des budgets et les informations de l'utilisateur courant
  loadData() {
    this.userService.getUser();
    this.expensesApi.getExpenses();
    this.budgetApi.getBudgets();
  }

  ngOnInit(): void {
    this.username = this.userService.user.username;
  }

  ngOnChange(): void {
    this.username = this.userService.user.username;
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/connexion']);
  }
}
