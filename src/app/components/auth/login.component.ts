import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionService } from "src/app/services/permission.service";
import { AccountService } from "../../services/account.service";
import { AlertService } from "../../services/alert.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { OidcAuthService } from "src/app/services/oidc-auth.service";
import { OidcConfig } from "src/app/configuration/oidcConfig";
import { CryptoService } from "src/app/services/crypto.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  isIdsEnabled:boolean = false;
  model: LoginModel = {
    UserId: 0,
    Email: "",
    Password: "",
    OldPassword: "",
  };

  forgetModel: ResetPasswordModel = {
    currentPassword: "",
    newPassword: "",
    emailId: "",
    userId: 0,
    encryptedUserId: "",
    confirmPassword: "",
    eventName: "forgotPassword",
  };
  loading = false;
  returnUrl: string="";
  msgs: string = "";
  msgTimeSpan: number=0;
  validateForgotPassword: string = "";
  displayForgotPasswordDialog: boolean = false;
  pageName = "forgotPassword";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private miscService: MiscellaneousService,
    private permissionService: PermissionService,
    private identityloginService: OidcAuthService,
    private cryptoService:CryptoService
  ) {}

  ngOnInit() {
    this.isIdsEnabled = OidcConfig.isIdsEnabled;
    if (!this.isIdsEnabled) {
      // reset login status
      this.accountService.logout();
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
      this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    } else {
      this.loading = true;
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
      this.msgTimeSpan = this.miscService.getMessageTimeSpan();
      if (!this.identityloginService.isAuthenticated())
        this.identityloginService.signinRedirect();
      else
        this.router.navigate[this.returnUrl];
    }
  }
  login() {
    this.loading = true;
    this.accountService.login(this.model).subscribe({
      next:(data) => {
        if (data !== null && data.authenticated ===true) {
          this.permissionService.getUserSubFeature({EncryptedUserId:data.encryptedUserId})
          .subscribe(
            (result) => {
              let permission = JSON.stringify(result.body);
              localStorage.setItem("UserSubFeaturePermissions", this.cryptoService.getEncryptedValue(permission));
            });
          this.router.navigate[this.returnUrl];
        } else {
          this.msgs = "Username or password is incorrect";
          this.loading = false;
        }
      },
      error:(error) => {
        if (error.statusText == "Unauthorized") {
          this.msgs = "Username or password is incorrect";
        }

        this.loading = false;
      }
  });
  }

  currentModelRef: any;
  openForgotPassword(pageName: any) {
    this.displayForgotPasswordDialog = true;
    this.msgs = "";
    this.pageName = pageName;
    this.forgetModel = {
      currentPassword: "",
      newPassword: "",
      emailId: this.model.Email,
      userId: 0,
      encryptedUserId: "",
      confirmPassword: "",
      eventName: "forgotPassword",
    };
  }

  onReset(status: any) {
    this.displayForgotPasswordDialog = false;
    this.msgs = status.message;
  }
}
interface LoginModel {
  UserId: number;
  Email: string;
  Password: string;
  OldPassword: string;
}
interface ResetPasswordModel {
  encryptedUserId: string;
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailId: string;
  eventName: string;
}
