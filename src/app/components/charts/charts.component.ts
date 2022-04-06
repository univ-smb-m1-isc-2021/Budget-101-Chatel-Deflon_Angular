import {Component, Input, OnInit} from '@angular/core';
import {BudgetService} from "../../services/budget.service";
import {coerceBooleanProperty} from "@angular/cdk/coercion";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() budgets: any[] = [];
  @Input() expenses: any[] = [];
  colors = ['red', 'blue', 'green', 'purple', 'brown', 'pink', 'cyan', 'grey', 'black', 'yellow'];
  public months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

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

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // @ts-ignore
    this.graphAnnual.data = this.setMonthlyData();
    // @ts-ignore
    this.graphGlobal.data = this.setAnnualData();
  }

  setMonthlyData(): any[] {
    // TODO : faire attention au type de dépense
    let currentData;
    let result = [];
    for (let i = 0; i < this.budgets.length; i++) {
      currentData = {
        name: this.budgets[i].name,
        x: this.months,
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: this.colors[i % this.colors.length]}
      }
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          let month = parseInt(this.expenses[j].date.substring(5, 7));
          currentData.y[month - 1] += parseFloat(this.expenses[j].amount);
        }
      }
      result.push(currentData);
    }

    return result;
  }

  setAnnualData(): any[] {
    let result = {
      values: [],
      labels: [],
      type: 'pie'
    }

    for (let i = 0; i < this.budgets.length; i++) {
      let value = 0;
      // @ts-ignore
      result.labels.push(this.budgets[i].name);
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          value += parseInt(this.expenses[j].amount);
        }
      }
      // @ts-ignore
      result.values.push(value);
    }
    return [result];
  }
}
