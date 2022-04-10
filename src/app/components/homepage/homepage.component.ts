import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor(
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
