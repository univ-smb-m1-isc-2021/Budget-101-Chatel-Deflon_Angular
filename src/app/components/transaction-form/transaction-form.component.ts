import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ExpensesService} from "../../services/expenses.service";
import {Subscription} from "rxjs";
import {BudgetService} from "../../services/budget.service";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  budgets: any[] = [];
  private subscriptionExpenseForm: Subscription;

  options: FormGroup;
  typeValue = new FormControl(''); // Type : dépense ou apport
  freqValue = new FormControl(''); // Fréquence : ponctuelle, mensuelle ou étalée
  labelValue = new FormControl(''); // Nom de la dépense
  amountValue = new FormControl(''); // Montant en euros
  budgetValue = new FormControl(''); // Budget correspondant à la dépense
  dateValue = new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en")); // Date de virement ponctuel
  dateFirstValue = new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en")); // Date de premier virement
  dateLastValue = new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en")); // Date de dernier virement
  repetitionValue = new FormControl(''); // Fréquence de répétition

  constructor(
    fb: FormBuilder,
    private budgetApi: BudgetService,
    private expensesApi: ExpensesService) {
    // Initialisation des champs du formulaire
    this.options = fb.group({
      typeValue: this.typeValue,
      freqValue: this.freqValue,
      labelValue: this.labelValue,
      amountValue: this.amountValue,
      budgetValue: this.budgetValue,
      dateValue: this.dateValue,
      dateFirstValue: this.dateFirstValue,
      dateLastValue: this.dateLastValue,
      repetitionValue: this.repetitionValue
    });

    // Recharge le composant si la liste des budgets est mise à jour
    this.subscriptionExpenseForm = this.budgetApi.getUpdate()
      .subscribe((_) => {
        this.budgets = this.budgetApi.budgets;
      });
  }

  // Initialisation de la liste des budgets du composant
  ngOnInit(): void {
    this.budgets = this.budgetApi.budgets;
  }

  // Ajout une nouvelle dépense
  addNewExpense() {
    let amount = parseFloat(this.amountValue.value);
    if (this.typeValue.value == 'depense') {
      amount *= -1; // Le montant est négatif s'il s'agit d'une dépense
    }

    // Ajout d'une dépense ponctuelle
    if (this.freqValue.value == 'PUNCTUAL') {
      let punctualExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        date: this.dateValue.value
      }
      this.expensesApi.addPunctualExpense(punctualExpense);
    } // Ajout d'une dépense récurrente
    else if (this.freqValue.value == 'RECURRENT') {
      let recurrentExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        date: this.dateFirstValue.value,
        repetition: this.repetitionValue.value,
      }
      this.expensesApi.addRecurrentExpense(recurrentExpense);
    } // Ajout d'une dépense étalée
    else {
      let spreadExpense = {
        label: this.labelValue.value,
        amount: amount,
        budgetId: this.getBudgetId(this.budgetValue.value),
        start: this.dateFirstValue.value,
        end: this.dateLastValue.value,
      }
      this.expensesApi.addSpreadExpense(spreadExpense);
    }
  }

  // Récupération d'un budget via son id
  getBudgetId(name: string): number {
    for (let i = 0; i < this.budgets.length; i++) {
      if (this.budgets[i].name == name) {
        return this.budgets[i].id;
      }
    }
    return -1;
  }
}
