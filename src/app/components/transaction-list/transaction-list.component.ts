import { Component, OnInit, AfterViewInit , ViewChild} from '@angular/core';
import {formatDate} from "@angular/common";
import {TransactionEditComponent} from "../transaction-edit/transaction-edit.component";

export interface Transaction {
  id: number;
  label: string;
  amount: number;
  date : string;
  enddate: string;
  budget: string;
  frequency: string;
}

const TRANSACTION_DATA: Transaction[] = [
  { id: 1, label: "Repas midi",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test1', frequency: 'Journalière' },
  { id: 2, label: "Plein d'essence",amount: 200, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test2', frequency: 'Hebdomadaire' },
  { id: 3, label: "Virement maman",amount: 150, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test3', frequency: '--' },
  { id: 4, label: "Pension Henry",amount: 120, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test4', frequency: 'Hebdomadaire' },
  { id: 5, label: "Révision annuelle voiture",amount: 100, date : formatDate(new Date(), 'dd-MM-yyy', "en"), enddate: "", budget: 'Test5', frequency: 'Annuel' },
];

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  @ViewChild(TransactionEditComponent) transactionEditComponent: TransactionEditComponent | undefined;

  displayedColumns: string[] = ['id', 'label', 'amount', 'date', 'budget', 'frequency', 'actions'];
  data = TRANSACTION_DATA;
  clickedRows = new Set<Transaction>();

  editT = false;
  transactionId = -1;

  ngOnInit(): void {}
  constructor() {}

  editTransaction(id: number) {
    this.editT = true;
    this.transactionId = id;
    if (this.transactionEditComponent !== undefined) {
      // @ts-ignore
      this.transactionEditComponent?.updateT = true;
      // @ts-ignore
      this.transactionEditComponent?.dataT = this.getTransaction(id);
      this.transactionEditComponent?.ngOnChanges();
    }
  }

  getTransaction(id: number): any {
    for (let i = 0; i < TRANSACTION_DATA.length; i++) {
      if (TRANSACTION_DATA[i].id == id) {
        return TRANSACTION_DATA[i];
      }
    }
  }

  deleteTransaction(id: number) {
    console.log("delete " + id);
    for (let i = 0; i < TRANSACTION_DATA.length; i++) {
      console.log("id elem: " + TRANSACTION_DATA[i].id + ", id: " + id + " = " + (TRANSACTION_DATA[i].id == id));
      if (TRANSACTION_DATA[i].id == id) {
        TRANSACTION_DATA.splice(i, 1);
        console.log(TRANSACTION_DATA);
        break;
      }
    }

    // TODO : prévoir rechargement de la page ou au moins du module pour afficher les changements
    this.ngOnInit();
  }
}
