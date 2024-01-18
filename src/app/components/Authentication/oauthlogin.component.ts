import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';

@Component({
  selector: 'app-oauthlogin',
  template: ''
})
export class OauthLoginComponent implements OnInit {

  constructor(private identityloginService: OidcAuthService) { 
  }

  ngOnInit() {
    this.identityloginService.signinRedirectCallback();
  }

}
