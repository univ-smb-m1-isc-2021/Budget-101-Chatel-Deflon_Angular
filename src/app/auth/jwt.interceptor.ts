import 'rxjs/add/operator/do';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private router: Router) {
  }

  // Vérifie que la personne se connectant a bien un token de connexion
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Si la personne est connectée, rien ne se passe
          }
        },
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // Si la personne n'est pas connecté, elle est redirigée vers la page de connexion
              this.router.navigate(['/connexion']);
              this.auth.collectFailedRequest(request);
            }
          }
        }
      }));
  }
}
