import { Component, OnInit,Inject } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
  selector: 'app-oauthlogout',
  template: ''
})
export class OauthLogoutComponent implements OnInit {

  myAppUrl: string = "";


  constructor(
    private identityloginService: OidcAuthService,
    private route: ActivatedRoute,private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;}

  ngOnInit() {
    let action = this.route.snapshot.queryParams['action'];
    if(action == 'logout'){
      this.deActivateToken().subscribe(
        (response) => {
          this.identityloginService.logout();
        }
      );
    }    
    else
      this.identityloginService.signoutRedirectCallback();
  }
  errorHandler(error: Response) {
    return throwError(() => error);
  }

  deActivateToken = () => {
    return this.http.post(this.myAppUrl + "api/TokenManager/Cancel",null).pipe(
      map((response) => response),
      catchError(this.errorHandler
      ));
  }
}
