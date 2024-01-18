import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FormsModule } from "@angular/forms";
import { ResetPasswordControl } from "./reset-password.control";

describe("ResetPasswordControl", () => {
  let component: ResetPasswordControl;
  let fixture: ComponentFixture<ResetPasswordControl>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: array => ({}) });
    const accountServiceStub = () => ({
      getUserById: object => ({ subscribe: f => f({}) }),
      resetPassword: model => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      showAlertMessages: (string, message) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResetPasswordControl],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ResetPasswordControl);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`isCurrentPasswordValid has default value`, () => {
    expect(component.isCurrentPasswordValid).toEqual(true);
  });

  it(`isPasswordMatch has default value`, () => {
    expect(component.isPasswordMatch).toEqual(true);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getUserDetails").and.callThrough();
      component.ngOnInit();
      expect(component.getUserDetails).toHaveBeenCalled();
    });
  });

  describe("getUserDetails", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(accountServiceStub, "getUserById").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getUserDetails();
      expect(accountServiceStub.getUserById).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("makes expected calls", () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      spyOn(component, "chkPasswordMatch").and.callThrough();
      spyOn(routerStub, "navigate").and.callThrough();
      spyOn(accountServiceStub, "resetPassword").and.callThrough();
      component.resetPassword();
      expect(component.chkPasswordMatch).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(accountServiceStub.resetPassword).toHaveBeenCalled();
    });
  });
});
