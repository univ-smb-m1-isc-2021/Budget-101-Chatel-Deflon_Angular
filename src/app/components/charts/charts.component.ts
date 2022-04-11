import {Component, OnInit} from '@angular/core';
import {BudgetService} from "../../services/budget.service";
import {formatDate} from "@angular/common";
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";

export interface annualData {
  name: string;
  x: any[],
  y: number[],
  type: string,
  mode: string,
  marker: { color: string }
}

export interface Expense {
  id: number;
  amount: number;
  label: string;
  budgetId: number;
  date: string;
  start: string;
  end: string;
  repetition: string;
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  private subscriptionName: Subscription;
  private subscriptionChart: Subscription;

  budgets: any[] = [];
  expenses: any[] = [];

  colors = ['red', 'blue', 'green', 'purple', 'brown', 'pink', 'cyan', 'grey', 'black', 'yellow'];
  public months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // Paramétrage des graphiques annuel et global
  public graphAnnual = {
    data: [],
    layout: {width: "100%", height: "100%", title: 'Evolution des budgets sur l\'année'}
  };

  public graphGlobal = {
    data: [],
    layout: {
      width: "100%",
      height: "100%",
      title: 'Vue globale des budgets',
      colors: this.colors,
    }
  }

  constructor(
    public budgetApi: BudgetService,
    public expensesApi: ExpensesService
  ) {
    this.budgets = this.budgetApi.budgets;
    // Recharge le composant si la liste des budgets est mise à jour
    this.subscriptionChart = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
        this.ngOnChanges();
      });

    this.expenses = this.expensesApi.expenses;
    // Recharge le composant si la liste des dépenses est mise à jour
    this.subscriptionName = this.expensesApi.getUpdate()
      .subscribe((_) => {
        this.expenses = this.expensesApi.expenses;
        this.ngOnChanges();
      });
  }

  // Initialisation des chiffres des graphiques
  ngOnInit(): void {
    // @ts-ignore
    this.graphAnnual.data = this.setMonthlyData();
    // @ts-ignore
    this.graphGlobal.data = this.setAnnualData();
  }

  // Mise à jour des chiffres des graphiques
  ngOnChanges(): void {
    // @ts-ignore
    this.graphAnnual.data = this.setMonthlyData();
    // @ts-ignore
    this.graphGlobal.data = this.setAnnualData();
  }

  // FONCTIONS POUR CALCULER LE MONTANT DES DEPENSES D'UN BUDGET (MENSUEL)
  // Retourne si une année est bissextile ou non
  leap(year: number) {
    if (year % 100 == 0) year = year / 100;
    return year % 4 == 0;
  }

  // Calcule le montant d'une dépense récurrente pour chaque mois de l'année
  calculateRecurrentExpenseMonthly(data: annualData, expense: Expense, month: number) {
    let updatedData = data;
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
          updatedData.y[i] += (expense.amount * days);
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
          // Calcul du nombre de semaines pour le mois
          while (day < limit) {
            week += 1;
            day += 7;
          }
          updatedData.y[i] += (expense.amount * week);
          day = 1;
        }
        break;
      case "MONTHLY":
        for (let i = month; i <= 12; i++) {
          updatedData.y[i] += expense.amount;
        }
        break;
      case "THIRDLY":
        for (let i = month; i <= 12; i += 3) {
          updatedData.y[i] += expense.amount;
        }
        break;
      case "YEARLY":
        updatedData.y[month] += expense.amount;
        break;
      case "BIYEARLY":
        let currentYear = parseInt(formatDate(Date(), "yyyy-MM-DD", "en").substring(0, 4));
        let expenseYear = parseInt(expense.date.substring(0, 4));
        if (currentYear - expenseYear == 0) {
          updatedData.y[month] += expense.amount;
        }
        break;
    }
    return updatedData;
  }

  // Calcule le montant d'une dépense étalée pour chaque mois de l'année
  calculateSpreadExpenseMonthly(data: annualData, expense: Expense) {
    let updatedData = data;
    let startMonth = (parseInt(expense.start.substring(5, 7)) - 1);
    let endMonth = (parseInt(expense.end.substring(5, 7)) - 1);
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    // Si l'année de départ est différente de l'année de fin
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end);
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      for (let i = startMonth; i <= 12; i++) {
        updatedData.y[i] += spreadAmount;
      }
    } // Si l'année de départ est l'année courante
    else {
      let spreadExpense = Math.round(expense.amount / ((endMonth + 1) - (startMonth + 1) + 1) * 10) / 10;
      for (let i = startMonth; i <= endMonth; i++) {
        updatedData.y[i] += spreadExpense;
      }
    }
    return updatedData;
  }

  // Défini les informations mensuelles pour le graphique annuel
  setMonthlyData(): any[] {
    let currentYear = formatDate(new Date(), "yyyy-MM-DD", "en").substring(0, 4);
    let currentData: annualData;
    let result = [];
    for (let i = 0; i < this.budgets.length; i++) {
      // Défini la base de la data du graphique
      currentData = {
        name: this.budgets[i].name,
        x: this.months,
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: this.colors[i % this.colors.length]}
      }
      // Pour chaque dépense, on calcule le montant pour chaque mois (data.y)
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          if (this.expenses[j].type == "RECURRENT") {
            // Dépenses récurrentes
            let year = this.expenses[j].date.substring(0, 4);
            if (year == currentYear) {
              let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
              currentData = this.calculateRecurrentExpenseMonthly(currentData, this.expenses[j], month);
            }
          } else if (this.expenses[j].type == "PUNCTUAL") {
            // Dépenses ponctuelles
            let year = this.expenses[j].date.substring(0, 4);
            if (year == currentYear) {
              let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
              currentData.y[month] += this.expenses[j].amount;
            }
          } else {
            // Dépenses étalées
            let year = this.expenses[j].start.substring(0, 4);
            if (year == currentYear) {
              currentData = this.calculateSpreadExpenseMonthly(currentData, this.expenses[j]);
            }
          }
        }
      }
      result.push(currentData);
    }
    return result;
  }

  // FONCTIONS POUR CALCULER LE MONTANT DES DEPENSES D'UN BUDGET (ANNUEL)
  // Calcule le montant d'une dépenses récurrente sur une année
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
          // Calcule du nombre de semaine dans le mois
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

  // Calcule le nombre de mois sur lequel s'étend une dépense étalée
  calculateTotalMonthSpreadExpense(start: string, end: string) {
    let startYear = parseInt(start.substring(0, 4)); // première année
    let startMonth = parseInt(start.substring(5, 7)); // premier mois
    let lastMonthY1 = 13; // On part de 13 pour ne pas fausser les calculs car (13-1) mois séparent janvier de décembre
    let endYear = parseInt(end.substring(0, 4)); // dernière année
    let endMonth = parseInt(end.substring(5, 7)); // dernier mois
    let firstMonthLY = 1; // premier mois de la dernière année

    // + 1 an pour compenser les mois restants qui composent l'année restante: startMonth à lastMonthY1 et firstMonthLY à endMonth
    let monthBetweenYears = ((endYear) - (startYear + 1)) * 12;
    let totalMonths = 0;

    if (monthBetweenYears > 0) {
      totalMonths = monthBetweenYears;
    }
    totalMonths += ((lastMonthY1 - startMonth) + (endMonth - firstMonthLY))

    return totalMonths;
  }

  // Calcule le montant d'une dépense étalée sur une année
  calculateSpreadExpenseAnnual(expense: Expense) {
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    // Si l'année de début est différente de l'année de fin
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end);
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      let startMonth = parseInt(expense.start.substring(5, 7));
      let amount = 0;
      for (let i = startMonth; i <= 12; i++) {
        amount += spreadAmount;
      }
      return amount;
    } // Sinon on retourne le montant de la dépense
    else {
      return expense.amount;
    }
  }

  // Défini les informations annuelles pour le graphique global
  setAnnualData(): any[] {
    let result: { values: number[], labels: string[], type: string } = {values: [], labels: [], type: 'pie'};
    let currentYear = formatDate(new Date(), "yyyy-MM-DD", "en").substring(0, 4);
    // Pour chaque budget, on calcule le montant total des dépenses sur l'année
    for (let i = 0; i < this.budgets.length; i++) {
      let value = 0;
      result.labels.push(this.budgets[i].name);
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          if (this.expenses[j].type == "RECURRENT") {
            // Dépenses récurrentes
            let year = this.expenses[j].date.substring(0, 4);
            if (year == currentYear) {
              let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
              value += this.calculateRecurrentExpenseAnnual(this.expenses[j], month);
            }
          } else if (this.expenses[j].type == "PUNCTUAL") {
            // Dépenses ponctuelles
            let year = this.expenses[j].date.substring(0, 4);
            if (year == currentYear) {
              let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
              value += this.expenses[j].amount;
            }
          } else {
            // Dépenses étalées
            let year = this.expenses[j].start.substring(0, 4);
            if (year == currentYear) {
              value += this.calculateSpreadExpenseAnnual(this.expenses[j]);
            }
          }
        }
      }
      if (value < 0) value = 0;
      result.values.push(value);
    }
    return [result];
  }
}
