import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

export interface Budget {
  id: number;
  name: string;
}

export interface Expenses {
  id: number;
  amount: number;
  label: string;
  budgetid: number;
}

@Component({
  selector: 'app-managing-data',
  templateUrl: './managing-data.component.html',
  styleUrls: ['./managing-data.component.css']
})
export class ManagingDataComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    // Si la personne n'est pas authentifiée, elle est redirigée vers la page de connexion
    if (!authService.isAuthenticated()) {
      this.router.navigate(["/connexion"]);
    }
  }

  ngOnInit(): void {
  }

}
