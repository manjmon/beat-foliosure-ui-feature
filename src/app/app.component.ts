  import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DataService } from './services/data-service.service';
import { AppSettingService } from './services/appsettings.service';
declare let pendo: any;
import CryptoJS from 'crypto-js';
import { OidcAuthService } from "src/app/services/oidc-auth.service";
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'beat-foliosure-ui';
  loading: boolean = false;
  VAPID_PUBLIC_KEY: string;
  clientCode:string = null;
  constructor(private ids: OidcAuthService, private router: Router, private dataService: DataService, private appSettingService: AppSettingService) {
    appSettingService.setGetConfig().then(res => { });
    if (location.hash == "") {
      if (location?.pathname.substring(location?.pathname.lastIndexOf('/') + 1) != '')
        this.router.navigate(['/404']);
    } else {
      this.currentApprovalStageMessage(router);
    }
    this.GetClientCode();
  }
  ngOnInit() {
    this.GetClientCode();
    setTimeout(() => {
      if (window['pendo'] != undefined && window['pendo'] != null && window.location.host !="dev.beatapps.net" && window.location.host != "localhost:4200" && window.location.host != "test.beatapps.net" && window.location.host != "perf-test01.beatapps.net" && window.location.host != "perf-test02.beatapps.net") {
        let userEmail = localStorage.getItem("currentUserEmailId");
        let config = this.ids.getEnvironmentConfig();
        const encryptedEmail = this.encrypt(userEmail);
        const encryptedClientName = this.encrypt(config.clientName);
        if (encryptedEmail !== undefined && encryptedClientName !== undefined) {
          if (window['pendo'] != undefined && pendo != undefined && pendo != null) {
            pendo.initialize({
              visitor: {
                id: encryptedEmail, // Required if user is logged in
                ClientCode:this.clientCode
              },
              account: {
                id: encryptedClientName, // Highly recommended, required if using Pendo Feedback
                ClientCode:this.clientCode
              },
            });
          }
        }
      }
    }, 2000);
  }
  GetClientCode()
  {
    this.clientCode =  this.ids.getEnvironmentConfig().clientName;
  }
  encrypt(hashedText: string) {
    const encrypted = CryptoJS.SHA3(hashedText, {outputLength: 256});
    return encrypted.toString();
  }
  currentApprovalStageMessage(router: any) {
    this.dataService.currentApprovalStageMessage.subscribe(msg => {
      this.loading = !msg; //sonarlink avoid using this boolean literal.
      router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError) {
          if (event instanceof NavigationEnd) {
            let filterValue = this.filterValueFunction(this.router.config, event.url);
            if (!filterValue)
              this.router.navigate(['/404']);
          }
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      });
    }
    );
  }

  filterValueFunction(configValue: any, url: any) {
    let returnValue = false
    let filterValue = [];
    if (url && (url.match(new RegExp("/", "g")) || []).length != 0) {
      if ((url.match(new RegExp("/", "g")) || []).length == 1) {
        if (url.includes("?")) {
          const urlName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));
          if (urlName && (urlName != "out" || urlName != "in" || urlName != "refresh" || urlName != "login")) {
            filterValue = configValue.filter(e => e.path === urlName);
            if (filterValue.length > 0)
              returnValue = true;
          }
        } else {
          filterValue = configValue.filter(e => e.path === url.replace('/', ''));
          if (filterValue.length > 0)
            returnValue = true;
        }
      }
      else if ((url.match(new RegExp("/", "g")) || []).length > 1) {
        filterValue = configValue.filter(e => e.path.includes(url.substring(url.indexOf("/") + 1, url.lastIndexOf("/"))));
        if (filterValue.length > 0)
          returnValue = true;
      }
    }
    return returnValue
  }
}