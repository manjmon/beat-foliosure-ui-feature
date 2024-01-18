import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { AccountService } from "../services/account.service";
import { OidcAuthService } from "../services/oidc-auth.service";
import { OidcConfig } from "../configuration/oidcConfig";

@Injectable()
export class HttpServiceInterceptor implements HttpInterceptor {
  myAppUrl: string = "";
  constructor(
    @Inject(DOCUMENT) private document: any,
    private accountService: AccountService,
    private identityService: OidcAuthService,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  getToken(){
    if (OidcConfig.isIdsEnabled){
      return this.identityService.getToken();
    }
    else{
    return this.accountService.getToken();
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    return next.handle(req).pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.accountService.redirectToUnauthorized();
          } else {
            return err;
          }
        }
      }
    ));
  }
}
