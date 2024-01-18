import { CryptoService } from './crypto.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserManager } from "oidc-client";
import { OidcConfig } from '../configuration/oidcConfig';
import { AccountService } from './account.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class OidcAuthService {

  config: string = "";
  UserManager: UserManager;
  environment: string;
  envConfig: any;
  appIdentifier: string;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private cryptoService: CryptoService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.initializeconfig();
  }

  initializeconfig() {
    let config = this.getEnvironmentConfig();
    this.UserManager = new UserManager(config);
    this.registerOidcEvents();
    this.appIdentifier = `${OidcConfig.applicationName}${this.envConfig?.env}${this.envConfig?.clientName}`;
  }

  getEnvironmentConfig() {
    
    this.config = "";
    let configFinder = document.location.hostname.toLowerCase();
    if (!this.config)
      this.config = document.location.pathname.includes("/foliosure/feature")
        ? "feature" :
        document.location.href.includes("/foliosure/dev")
          ? "dev"
          : configFinder.includes("test.beatapps.net")
            ? "test"
            : configFinder.includes("demo.beatfoliosure")
              ? "prod"
              : configFinder.includes("enshi.beatfoliosure")
                ? "prod"
                : configFinder.includes("taabo-ch.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("larissa.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("monmouth.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("exeter.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("pizarro.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("trial.beatfoliosure")
                  ? "prod"
                  : configFinder.includes("uat")
                  ? "uat"
                  : configFinder.includes("taabo")
                  ? "uat"
                  : configFinder.includes("perf-test01")
                  ? "perf1"
                  : configFinder.includes("perf-test02")
                  ? "perf2"
                  : document.location.href.includes("localhost") ?
                    "localhost"
                    : "localhost";

    if (this.config == "prod" && configFinder.includes("demo.beatfoliosure")) {
      let config = OidcConfig[this.config];
      config = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "demo");
      this.envConfig = config[0];
    }
    else if (this.config == "prod" && configFinder.includes("trial.beatfoliosure")) {
      let config = OidcConfig[this.config];
      config = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "trial");
      this.envConfig = config[0];
    }
    else if (this.config == "prod" && configFinder.includes("taabo-ch.beatfoliosure")) {
      let config = OidcConfig[this.config];
      let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "taabo-ch")
      this.envConfig = result[0];
    }
    else if (this.config == "prod" && configFinder.includes("larissa.beatfoliosure")) {
      let config = OidcConfig[this.config];
      let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "larissa")
      this.envConfig = result[0];
    }
    else if (this.config == "prod" && configFinder.includes("monmouth.beatfoliosure")) {
      let config = OidcConfig[this.config];
      let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "monmouth")
      this.envConfig = result[0];
    }
    else if (this.config == "prod" && configFinder.includes("exeter.beatfoliosure")) {
      let config = OidcConfig[this.config];
      let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "exeter")
      this.envConfig = result[0];
    }
    else if (this.config == "prod" && configFinder.includes("pizarro.beatfoliosure")) {
      let config = OidcConfig[this.config];
      let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "pizarro")
      this.envConfig = result[0];
    }
    else if (this.config == "uat") {
      let config = OidcConfig[this.config];
      if (document.location.pathname.includes("taabo")) {
        let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "taabo")
        this.envConfig = result[0];
      }
      else 
      {
        if (document.location.pathname.includes("pod-b")) {
          let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "pod-b")
          this.envConfig = result[0];
        }
        else {
          let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "pod")
          this.envConfig = result[0];
        } 
      }     
    }
    else if (this.config == "test") {
      let config = OidcConfig[this.config];
      if (document.location.pathname.includes("pod-b")) {
        let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "pod-b")
        this.envConfig = result[0];
      }
      else {
        let result = config.filter((x: { clientName: string; }) => x.clientName.toLowerCase() == "pod")
        this.envConfig = result[0];
      }
    }
    else
      this.envConfig = OidcConfig[this.config];

    this.environment = `${OidcConfig.applicationName}_${this.config}_${this.envConfig.clientName}`;

    return this.envConfig;
  }

  registerOidcEvents() {
    this.UserManager.events.addUserLoaded(async (user) => {
      if (window.location.href.indexOf("/in") !== -1) {
        this.setUserDetails(user);
        this.navigateToDashboard(user);
      }
    });
    this.UserManager.events.addSilentRenewError((e) => {
      this.logout();
    });

    this.UserManager.events.addAccessTokenExpiring((e) => {
      this.signinSilent();
    });

    this.UserManager.events.addAccessTokenExpired((e) => {
      this.logout();
    });

    this.UserManager.events.addUserSignedOut(() => {
    });

  }

  signinRedirectCallback = () => {
    try{
      this.UserManager.signinRedirectCallback().then(() => {
        const loc = window.location.pathname;
      window.location.replace(loc);
      },error=>{
        this.logout();
      });
    }
    catch(error){
      this.logout();
    }
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    return user;
  };

  parseJwt = (token: string) => {
    if (token != null) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64));
    }
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({}).then((user) => {
    });
  };

  navigateToDashboard = (response: any) => {
    if (this.checkApplicaionAccess(response)) {
      const loc = window.location.pathname;
      window.location.replace(loc);
    }
  };

  isAuthenticated = () => {
    let claims = this.getClaimsFromToken();
    if (claims != null) {
      let expiry = Number(claims.exp);
      let isValid = new Date(expiry * 1000) > new Date();
    return isValid;
    }
    return false;
  };

  isTokenTampered() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${this.envConfig.introspectHeader}`
    });

    this.http
      .post(this.envConfig.introspect_endpoint, { "token": this.getToken() }, {
        headers: httpHeaders
      })
      .subscribe((data) => {
        return data;
      });
  }

  signinSilent = () => {
    this.UserManager.signinSilent()
      .then((user) => {
        this.setUserDetails(user);
      })
      .catch((err) => {
      });
  };

  signinSilentCallback = () => {
    this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.UserManager.createSigninRequest();
  };

  logout = () => {
    let encryptedToken = this.cookieService.getCookie(`${this.environment}_id_token`);
    let id_token = this.cryptoService.getDecryptedValue(encryptedToken);
    if (id_token == '')
      this.UserManager.signoutRedirect();
    else {
      let logout_url = `${this.envConfig.endsession_endpoint}?id_token_hint=${id_token}`;
      localStorage.clear();
      this.cookieService.removeCookie(`${this.environment}_access_token`);
      window.location.href = logout_url;
    }
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      sessionStorage.clear();
      this.cookieService.removeCookie(`${this.environment}_id_token`);
      this.router.navigate(["/login"]);
    });
    this.UserManager.clearStaleState();
  };

  setUserDetails = async (response: any) => {
    let date = new Date(response.expires_at * 1000);
    if (date > new Date()) {
      let token = response.access_token;
      let name = response.profile.name;
      localStorage.setItem("currentUser", name);
      localStorage.setItem("currentUserEmailId", response.profile.preferred_username); 
      this.cookieService.setCookie(`${this.environment}_access_token`, this.cryptoService.getEncryptedValue(token), date);
      this.cookieService.setCookie(`${this.environment}_id_token`, this.cryptoService.getEncryptedValue(response.id_token), date);
    }
  };

  getToken() {
    let encryptedToken = this.cookieService.getCookie(`${this.environment}_access_token`);
    if (encryptedToken != null)
      return this.cryptoService.getDecryptedValue(encryptedToken);
    return null;
  }

  getClaimsFromToken() {
    let token = this.getToken();
    if (token != null) {
      let claims = this.parseJwt(token);
      return claims
    }
    return null;
  }

  checkApplicaionAccess(response: any) {
    try {
      if(response!=null && response!=undefined && response.profile!=null && response.profile!=undefined && response.profile.APP_ACCESS!=null)
      {
        let obj: RootObject[] = JSON.parse(response.profile.APP_ACCESS);
        let AppAccess = obj?.filter(x => x.appName.toLowerCase() == OidcConfig.applicationName.toLocaleLowerCase());
        let isAppaccess: boolean = AppAccess?.length == 1;
        if(AppAccess?.length > 0)
        {
          let ClientAccess = AppAccess[0].appClients.filter(x => x.appClientName.toLowerCase() == this.envConfig.clientName.toLowerCase());
          let isClientAccess: boolean = ClientAccess.length == 1;
          if(ClientAccess?.length > 0)
          {
            let EnvAccess = ClientAccess[0].appEnvironments.filter(x => x.toLowerCase() == this.config.toLowerCase());
            let isEnvironmentAccess: boolean = EnvAccess.length == 1;
            if ((!isAppaccess || !isClientAccess || !isEnvironmentAccess) && window.location.hostname!='monmouth.beatfoliosure.com') {
              localStorage.setItem("authStatus", this.cryptoService.getEncryptedValue("false"));
              this.accountService.redirectToUnauthorized();
              return false;
            }
          }
        }
      }
    } catch (error) {
      localStorage.setItem("authStatus", this.cryptoService.getEncryptedValue('false'));
      this.accountService.redirectToUnauthorized();
      return false;
    }
  }
  getUsersFromBeatIds() {
    let endpoint = `${this.envConfig.wrapper_endpoint}Users/userList`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.get(endpoint, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  isUserExistFromBeatIds(emailId: string) {
    let endpoint = `${this.envConfig.wrapper_endpoint}Users/Exists?Email=${emailId}`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.get(endpoint, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  addUsersFromBeatIds(user: any) {
    user.AppIdentifier = this.appIdentifier;
    let endpoint = `${this.envConfig.wrapper_endpoint}Users`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.post(endpoint, user, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  updateUsersFromBeatIds(user: any) {
    let endpoint = `${this.envConfig.wrapper_endpoint}Users`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.put(endpoint, user, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  setActiveUserInBeatIds(guid: string) {
    let endpoint = `${this.envConfig.wrapper_endpoint}Users/ActivateUser/${guid}`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.get(endpoint, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  setDeActiveUserInBeatIds(guid: string) {
    let endpoint = `${this.envConfig.wrapper_endpoint}Users/DeactivateUser?/${guid}`;
    let httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'appidentifier': this.appIdentifier
    });
    return this.http.put(endpoint, { headers: httpHeaders }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}

export interface AppClient {
  appClientName: string;
  appEnvironments: string[];
}

export interface RootObject {
  appName: string;
  appClients: AppClient[];
}
