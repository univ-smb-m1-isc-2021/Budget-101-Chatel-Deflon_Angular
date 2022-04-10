import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {Observable, Subject, Subscription} from "rxjs";
import {BudgetEditComponent} from "../budget-edit/budget-edit.component";
import {BudgetService} from "../../services/budget.service";
import {Expense, ExpensesService} from "../../services/expenses.service";

// TODO : retirer les id après avoir fini le debug
export interface Budget {
  id: number;
  name: string;
  amount: number;
  userId: number;
  lastexpense: string;
}

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  @ViewChild(BudgetEditComponent) budgetEditComponent: BudgetEditComponent | undefined;
  private subscriptionBudgetListB: Subscription;
  private subscriptionBudgetListE: Subscription;

  currentDate = formatDate(new Date(), "yyyy-MM-dd", "en");
  currentYear = this.currentDate.substring(0, 4);

  budgetsList: Budget[] = [];
  displayedColumns: string[] = ['name', 'amount', 'lastexpense', 'actions'];
  clickedRows = new Set<Budget>();

  budgets: any[] = [];
  expenses: any[] = [];

  editRow = false;
  currentId = -1;

  constructor(
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService
  ) {
    this.subscriptionBudgetListB = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });
    this.subscriptionBudgetListE = this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
    this.expenses = this.expensesApi.expenses;

    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
  }

  ngOnChanges(): void {
    this.budgetsList = [];
    this.budgets.forEach(val => this.budgetsList.push(Object.assign({}, val)));
    // Set the missing properties of budgets : amount & lastexpense
    for (let i = 0; i < this.budgetsList.length; i++) {
      this.budgetsList[i].amount = 0; // Set amount
      this.budgetsList[i].lastexpense = "--"; // Set lastexpense
      for (let j = 0; j < this.expenses.length; j++) {
        // Set amount
        if (this.budgetsList[i].id == this.expenses[j].budgetId) {
          this.budgetsList[i].lastexpense = this.expenses[j].label; // Dernière dépense rentrée dans l'app
          this.budgetsList[i].amount += this.calculateExpense(this.expenses[j]);
        }
      }
    }
  }

  leap(year: number) {
    if (year % 100 == 0) year = year / 100;
    return year % 4 == 0;
  }

  calculateRecurrentExpenseAnnual(expense: Expense, month: number) {
    let value = 0;
    switch (expense.repetition) {
      case "DAILY":
        let startDay = parseInt(expense.date.substring(8, 10));
        let firstMonth = true;
        let days = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            days = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            days = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              days = 29;
            } else {
              days = 28;
            }
          }
          if (firstMonth) {
            days -= (startDay + 1); // +1 car le jour de début compte
            firstMonth = false;
          }
          value += (expense.amount * days);
        }
        break;
      case "WEEKLY":
        let day = parseInt(expense.date.substring(8, 10));
        let limit = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          let week = 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            limit = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            limit = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              limit = 29;
            } else {
              limit = 28;
            }
          }
          while (day < limit) {
            week += 1;
            day += 7;
          }
          value += (expense.amount * week);
          day = 1;
        }
        break;
      case "MONTHLY":
        for (let i = month; i <= 12; i++) {
          value += expense.amount;
        }
        break;
      case "THIRDLY":
        for (let i = month; i <= 12; i += 3) {
          value += expense.amount;
        }
        break;
      case "YEARLY":
        value = expense.amount;
        break;
      case "BIYEARLY":
        let currentYear = parseInt(formatDate(Date(), "yyyy-MM-DD", "en").substring(0, 4));
        let expenseYear = parseInt(expense.date.substring(0, 4));
        if (currentYear - expenseYear == 0) {
          value = expense.amount;
        }
        break;
    }
    return value;
  }

  calculateTotalMonthSpreadExpense(start: string, end: string) {
    let startYear = parseInt(start.substring(0, 4));
    let startMonth = parseInt(start.substring(5, 7));
    let lastMonthY1 = 13; // On part de 13 pour ne pas fausser les calculs, car 12 mois séparent janvier de décembre et non 11
    let endYear = parseInt(end.substring(0, 4));
    let endMonth = parseInt(end.substring(5, 7));
    let firstMonthLY = 1;

    // + 1 an pour compenser les mois restants qui composent l'année restante: startMonth à lastMonthY1 et firstMonthLY à endMonth
    let monthBetweenYears = ((endYear) - (startYear + 1)) * 12;
    let totalMonths = 0;

    if (monthBetweenYears > 0) {
      totalMonths = monthBetweenYears;
    }
    totalMonths += ((lastMonthY1 - startMonth) + (endMonth - firstMonthLY))

    return totalMonths;
  }

  calculateSpreadExpenseAnnual(expense: Expense) {
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end); //expense.end
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      let startMonth = parseInt(expense.start.substring(5, 7));
      let amount = 0;
      for (let i = startMonth; i <= 12; i++) {
        amount += spreadAmount;
      }
      return amount;
    } else {
      return expense.amount;
    }
  }

  calculateExpense(expense: Expense): number {
    if (expense.type == "SPREAD") {
      let year = expense.start.substring(0, 4);
      if (year == this.currentYear) {
        return this.calculateSpreadExpenseAnnual(expense);
      } else {
        return 0;
      }
    } else if (expense.type == "RECURRENT") {
      let year = expense.date.substring(0, 4);
      if (year == this.currentYear) {
        return this.calculateRecurrentExpenseAnnual(expense, parseInt(expense.date.substring(6, 8)));
      } else {
        return 0;
      }
    } else {
      let year = expense.date.substring(0, 4);
      if (year == this.currentYear) {
        return expense.amount;
      } else {
        return 0;
      }
    }
  }

  editBudget(id: number) {
    this.editRow = true;
    this.currentId = id;
    if (this.budgetEditComponent !== undefined) {
      // @ts-ignore
      this.budgetEditComponent?.update = true;
      // @ts-ignore
      this.budgetEditComponent?.data = this.getElement(id);
      this.budgetEditComponent?.ngOnChanges();
    }
  }

  getElement(id: number): any {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].id == id) {
        return this.budgets[i];
      }
    }
  }

  deleteBudget(id: number) {
    for (let i = 0; i < this.expensesApi.expenses.length; i++) {
      if (this.expensesApi.expenses[i].budgetId == id) this.expensesApi.deleteExpense(this.expensesApi.expenses[i].id);
    }
    this.budgetApi.deleteBudget(id);
  }
}
