import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';

@Component({
  selector: 'app-oauth-refresh',
  template: ''
})
export class OauthRefreshComponent implements OnInit {

  constructor(private identityloginService: OidcAuthService) { }

  ngOnInit() {
    this.identityloginService.signinSilentCallback();
  }

}
