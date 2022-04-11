import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  // Demande l'envoie du mail récapitulatif du mois
  public sendRecap(): void {
    this.http.get('http://gunter-101.oups.net/recapmail')
      .subscribe(response => {
        console.log(response);
      });
  }
}
