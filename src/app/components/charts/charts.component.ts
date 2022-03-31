// import {Component, ViewChild} from '@angular/core';
// import {ChartConfiguration, ChartEvent, ChartType} from 'chart.js';
// import {BaseChartDirective} from 'ng2-charts';
//
// @Component({
//   selector: 'app-charts',
//   templateUrl: './charts.component.html',
//   styleUrls: ['./charts.component.css']
// })
// export class ChartsComponent {

import {Component} from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  public months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // TODO : setup data avec les informations des budgets
  public graphAnnual = {
    data: [
      {
        name: "Voiture",
        x: this.months,
        y: [0, 100, 500, -200, 10, 0, 0, 0, 500, 100, -200, 300],
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: 'red'}
      },
      {
        name: "Maison",
        x: this.months,
        y: [2, 5, 3, -500, 1000, 3, 100, 200, 0, 0, 0, 100],
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: 'blue'}
      },
    ],
    layout: {width: "100%", height: "100%", title: 'Evolution des budgets sur l\'année'}
  };

  // TODO : setup data avec informations des Budgets
  public graphGlobal = {
    data: [
      {
        values: [1200, 400, 0],
        labels: ['Voiture', 'Maison', 'Mariage'],
        type: 'pie'
      },
    ],
    layout: {width: "100%", height: "100%", title: 'Dépenses par budgets'}
  }
}

//
//   public lineChartData: ChartConfiguration['data'] = {
//     datasets: [
//       {
//         data: [65, 59, 80, 81, 56, 55, 40, 60, 40, 0, 10, 100],
//         label: 'Series A',
//         backgroundColor: 'rgba(148,159,177,0.2)',
//         borderColor: 'rgba(148,159,177,1)',
//         pointBackgroundColor: 'rgba(148,159,177,1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(148,159,177,0.8)',
//         fill: 'origin',
//       },
//       {
//         data: [28, 48, 40, 19, 86, 27, 90, 0, 0, 0, 0, 0, 0],
//         label: 'Series B',
//         backgroundColor: 'rgba(77,83,96,0.2)',
//         borderColor: 'rgba(77,83,96,1)',
//         pointBackgroundColor: 'rgba(77,83,96,1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(77,83,96,1)',
//         fill: 'origin',
//       },
//       {
//         data: [0, 0, 0, 0, 0, 180, 480, 770, 90, 1000, 270, 400],
//         label: 'Series C',
//         yAxisID: 'y-axis-1',
//         backgroundColor: 'rgba(255,0,0,0.3)',
//         borderColor: 'red',
//         pointBackgroundColor: 'rgba(148,159,177,1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(148,159,177,0.8)',
//         fill: 'origin',
//       }
//     ],
//     labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
//   };
//
//   public lineChartOptions: ChartConfiguration['options'] = {
//     elements: {
//       line: {
//         tension: 0.5
//       }
//     },
//     scales: {
//       // We use this empty structure as a placeholder for dynamic theming.
//       x: {},
//       'y-axis-0':
//         {
//           position: 'left',
//         },
//       'y-axis-1': {
//         position: 'right',
//         grid: {
//           color: 'rgba(255,0,0,0.3)',
//         },
//         ticks: {
//           color: 'red'
//         }
//       }
//     },
//
//     plugins: {
//       legend: {display: true}
//     }
//   };
//
//   public lineChartType: ChartType = 'line';
//
//   @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
//
//   private static generateNumber(i: number): number {
//     return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
//   }
//
//   public randomize(): void {
//     for (let i = 0; i < this.lineChartData.datasets.length; i++) {
//       for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
//         this.lineChartData.datasets[i].data[j] = ChartsComponent.generateNumber(i);
//       }
//     }
//     this.chart?.update();
//   }
//
//   // events
//   public chartClicked({event, active}: { event?: ChartEvent, active?: {}[] }): void {
//     console.log(event, active);
//   }
//
//   public chartHovered({event, active}: { event?: ChartEvent, active?: {}[] }): void {
//     console.log(event, active);
//   }
//
//   public hideOne(): void {
//     const isHidden = this.chart?.isDatasetHidden(1);
//     this.chart?.hideDataset(1, !isHidden);
//   }
//
//   public pushOne(): void {
//     this.lineChartData.datasets.forEach((x, i) => {
//       const num = ChartsComponent.generateNumber(i);
//       x.data.push(num);
//     });
//     this.lineChartData?.labels?.push(`Label ${this.lineChartData.labels.length}`);
//
//     this.chart?.update();
//   }
//
//   public changeColor(): void {
//     this.lineChartData.datasets[2].borderColor = 'green';
//     this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
//
//     this.chart?.update();
//   }
//
//   public changeLabel(): void {
//     if (this.lineChartData.labels) {
//       this.lineChartData.labels[2] = ['1st Line', '2nd Line'];
//     }
//
//     this.chart?.update();
//   }
// }
