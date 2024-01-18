import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { PermissionService } from "src/app/services/permission.service";
import { AccountService } from "../../services/account.service";
import { AlertService } from "../../services/alert.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { OidcAuthService } from "src/app/services/oidc-auth.service";
import { CryptoService } from "src/app/services/crypto.service";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { queryParams: {} } });
    const routerStub = () => ({ navigate: {} });
    const permissionServiceStub = () => ({
      getUserSubFeature: object => ({ subscribe: f => f({}) })
    });
    const accountServiceStub = () => ({
      logout: () => ({}),
      login: model => ({ subscribe: f => f({}) })
    });
    const alertServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({ getMessageTimeSpan: () => ({}) });
    const oidcAuthServiceStub = () => ({
      isAuthenticated: () => ({}),
      signinRedirect: () => ({})
    });
    const cryptoServiceStub = () => ({ getEncryptedValue: permission => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LoginComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: AlertService, useFactory: alertServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: CryptoService, useFactory: cryptoServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`isIdsEnabled has default value`, () => {
    expect(component.isIdsEnabled).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`msgTimeSpan has default value`, () => {
    expect(component.msgTimeSpan).toEqual(0);
  });

  it(`displayForgotPasswordDialog has default value`, () => {
    expect(component.displayForgotPasswordDialog).toEqual(false);
  });

  it(`pageName has default value`, () => {
    expect(component.pageName).toEqual(`forgotPassword`);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(accountServiceStub, "logout").and.callThrough();
      spyOn(miscellaneousServiceStub, "getMessageTimeSpan").and.callThrough();
      spyOn(oidcAuthServiceStub, "isAuthenticated").and.callThrough();
      spyOn(oidcAuthServiceStub, "signinRedirect").and.callThrough();
      component.ngOnInit();
      expect(accountServiceStub.logout).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
      expect(oidcAuthServiceStub.isAuthenticated).toHaveBeenCalled();
      expect(oidcAuthServiceStub.signinRedirect).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("makes expected calls", () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const cryptoServiceStub: CryptoService = fixture.debugElement.injector.get(
        CryptoService
      );
      spyOn(permissionServiceStub, "getUserSubFeature").and.callThrough();
      spyOn(accountServiceStub, "login").and.callThrough();
      spyOn(cryptoServiceStub, "getEncryptedValue").and.callThrough();
      component.login();
      expect(permissionServiceStub.getUserSubFeature).toHaveBeenCalled();
      expect(accountServiceStub.login).toHaveBeenCalled();
      expect(cryptoServiceStub.getEncryptedValue).toHaveBeenCalled();
    });
  });
});
