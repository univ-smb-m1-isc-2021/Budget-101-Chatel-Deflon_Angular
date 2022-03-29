import { Component, OnInit, AfterViewInit , ViewChild} from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface Test {
  date : Date;
  amount: number;
  budget: string;
  frequency: string;
}

const ELEMENT_DATA: Test[] = [
    { date : new Date(), amount: 100, budget: 'Test1', frequency: 'Journalière' },
    { date : new Date(), amount: 200, budget: 'Test2', frequency: 'Hebdomadaire' },
    { date : new Date(), amount: 150, budget: 'Test3', frequency: 'Journalière' },
    { date : new Date(), amount: 120, budget: 'Test4', frequency: 'Hebdomadaire' },
    { date : new Date(), amount: 100, budget: 'Test5', frequency: 'Annuel' },
  ];

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date','amount', 'budget', 'frequency'];
  dataSource = new MatTableDataSource(ELEMENT_DATA)

  ngOnInit(): void {}

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // clickedRows = new Set<Test>();
}
