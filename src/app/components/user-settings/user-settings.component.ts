import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {MailService} from "../../services/mail.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private router: Router
  ) {
    // Si la personne n'est pas authentifiée, elle est redirigée vers la page de connexion
    if (!authService.isAuthenticated()) {
      this.router.navigate(["/connexion"]);
    }
  }

  ngOnInit(): void {
  }

  // Envoie un mail récapitulatif du mois à l'utilisateur
  sendRecap(): void {
    this.mailService.sendRecap();
  }
}
