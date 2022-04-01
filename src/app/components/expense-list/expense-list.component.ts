import { Component, OnInit, AfterViewInit , ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";

export interface Expense {
  id: number;
  label: string;
  amount: number;
  date : string;
  budget: string;
  frequency: string;
}

const ELEMENT_DATA: Expense[] = [
  { id: 1, label: "Repas midi",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), budget: 'Test1', frequency: 'Journalière' },
  { id: 2, label: "Plein d'essence",amount: 200, date : formatDate(new Date(), 'dd-MM-yyy', "en"), budget: 'Test2', frequency: 'Hebdomadaire' },
  { id: 3, label: "Virement maman",amount: 150, date : formatDate(new Date(), 'dd-MM-yyy', "en"), budget: 'Test3', frequency: '--' },
  { id: 4, label: "Pension Henry",amount: 120, date : formatDate(new Date(), 'dd-MM-yyy', "en"), budget: 'Test4', frequency: 'Hebdomadaire' },
  { id: 5, label: "Révision annuelle voiture",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), budget: 'Test5', frequency: 'Annuel' },
];

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'label', 'amount', 'date', 'budget', 'frequency', 'actions'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<Expense>();
  ngOnInit(): void {}
  constructor() {}
}
