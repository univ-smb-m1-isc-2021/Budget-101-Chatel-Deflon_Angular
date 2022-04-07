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

// https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }},
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // TODO: redirect to the login route
              this.router.navigate(['/connexion']);
              // or show a modal
              this.auth.collectFailedRequest(request);
            }
          }
        }
      }));
  }
}
