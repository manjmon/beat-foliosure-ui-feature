import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { AccountService } from "../services/account.service";
import { PermissionService } from "../services/permission.service";
import { OidcConfig } from "src/app/configuration/oidcConfig";
import { OidcAuthService } from "../services/oidc-auth.service";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  isIdsEnabled: boolean;
  featureList: any = [];
  constructor(
    private router: Router,
    private accountService: AccountService,
    private permissionService: PermissionService,
    private identityloginService: OidcAuthService,
    private ids:OidcAuthService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.isIdsEnabled = OidcConfig.isIdsEnabled;
    if ((!this.isIdsEnabled && localStorage.getItem("currentUser")) ||
          this.isIdsEnabled && this.identityloginService.isAuthenticated()) {
        const result = await firstValueFrom(this.accountService.getUserPermissionByEmail());
        if (result != null) {
        let permissions = JSON.stringify(result.permissions);
        let features = JSON.stringify(result.features);
        localStorage.setItem(`${this.ids.environment}_userPermissions`, permissions);
        localStorage.setItem(`${this.ids.environment}_featurePermissions`, features);
        this.featureList = result.features != null ? result?.features : [];
      }
      let isLoggedIn = (!this.isIdsEnabled ? this.accountService.isLoggedIn() : this.identityloginService.isAuthenticated());
      if (isLoggedIn) {
        if (route.url != null && route.url.length > 0) {
          let url = "";
          route.url.forEach(function (val: UrlSegment) {
            url += "/" + val.path;
          });
        }else{
          if(this.featureList?.length > 0)
          this.router.navigate([this.featureList[0]?.path]);
        }
        return true;
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }

  checkPermission(url: any) {
    //TODO: Authentication patched for audit logs also
    if (url == "" || url == "/home" || url ==="/kpi-list"|| url ==="/lp-report-config" || url==="/audit-logs") {
      return true;
    }
    let navItem = this.permissionService.navigationItems.filter(function (
      ele: any,
      i: any
    ) {
      return ele.url == url;
    });
    if (navItem.length <= 0) {
      navItem = this.permissionService.navigationItems.filter(function (
        ele: any,
        i: any
      ) {
        let segments = url.split("/");
        segments.pop();
        segments.splice(0, 1);
        return ele.url == "/" + segments.join("/") + "/:id";
      });
    }
    if (navItem.length > 0) {
      return this.permissionService.checkFeaturePermission(navItem[0].feature);
    }
    return false;
  }
}
