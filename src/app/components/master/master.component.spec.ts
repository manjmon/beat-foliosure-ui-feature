import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IdleService } from 'ngx-idle-timeout';
import { AccountService } from 'src/app/services/account.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { FeaturesImageEnum } from '../../services/permission.service';
import { MasterComponent } from './master.component';
import { of } from 'rxjs';

describe('MasterComponent', () => {
  let component: MasterComponent;
  let fixture: ComponentFixture<MasterComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const idleServiceStub = () => ({
      idleStateChanged: () => ({ subscribe: f => f({}) }),
      stopTimer: () => ({})
    });
    const accountServiceStub = () => ({
      getUserPermissionByEmail: () => ({ subscribe: f => of({}) }),
      redirectToUnauthorized: () => ({}),
      getCurrentUserDeatils: () => ({ subscribe: f => of({}) })
    });
    const cryptoServiceStub = () => ({ getDecryptedValue: arg => ({}) });
    const oidcAuthServiceStub = () => ({
      getToken: () => ({}),
      environment: {},
      getClaimsFromToken: () => ({ preferred_username: {} })
    });
    const permissionServiceStub = () => ({ getFeatureData: () => ('[{"name":"John", "age":30, "car":null}]') });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MasterComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: IdleService, useFactory: idleServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: CryptoService, useFactory: cryptoServiceStub },
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MasterComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isPermissionAvailable has default value`, () => {
    expect(component.isPermissionAvailable).toEqual(true);
  });

  it(`userName has default value`, () => {
    expect(component.userName).toEqual(`A`);
  });

  it(`idleTimer has default value`, () => {
    expect(component.idleTimer).toEqual(true);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(true);
  });

  it(`navbarString has default value`, () => {
    expect(component.navbarString).toEqual(`nep-sidebar-expanded`);
  });

  it(`panelOpenState has default value`, () => {
    expect(component.panelOpenState).toEqual(true);
  });

  it(`isClientUser has default value`, () => {
    expect(component.isClientUser).toEqual(false);
  });

  it(`featureList has default value`, () => {
    expect(component.featureList).toEqual([]);
  });

  it(`featureImage has default value`, () => {
    expect(component.featureImage).toEqual(FeaturesImageEnum);
  });

  it(`sidenavWidth has default value`, () => {
    expect(component.sidenavWidth).toEqual(4.68);
  });

  it(`displayOpenOption has default value`, () => {
    expect(component.displayOpenOption).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const cryptoServiceStub: CryptoService = fixture.debugElement.injector.get(
        CryptoService
      );
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(component, 'resetParntActive').and.callThrough();
      spyOn(component, 'getFeatureData').and.callThrough();
      spyOn(accountServiceStub, 'getUserPermissionByEmail').and.callThrough();
      spyOn(accountServiceStub, 'redirectToUnauthorized').and.callThrough();
      spyOn(cryptoServiceStub, 'getDecryptedValue').and.callThrough();
      spyOn(oidcAuthServiceStub, 'getToken').and.callThrough();
      spyOn(oidcAuthServiceStub, 'getClaimsFromToken').and.callThrough();
      component.ngOnInit();
      expect(component.resetParntActive).toHaveBeenCalled();
      expect(component.getFeatureData).toHaveBeenCalled();
      expect(accountServiceStub.getUserPermissionByEmail).toHaveBeenCalled();
      expect(oidcAuthServiceStub.getToken).toHaveBeenCalled();
      expect(oidcAuthServiceStub.getClaimsFromToken).toHaveBeenCalled();
    });
  });

  describe('getFeatureData', () => {
    it('makes expected calls', () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, 'resetParntActive').and.callThrough();
      spyOn(permissionServiceStub, 'getFeatureData').and.callThrough();
      component.featureList = [];
      component.getFeatureData();
      expect(component.resetParntActive).toHaveBeenCalled();
      expect(permissionServiceStub.getFeatureData).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('makes expected calls', () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      spyOn(accountServiceStub, 'getCurrentUserDeatils').and.callThrough();
      component.getCurrentUser();
      expect(accountServiceStub.getCurrentUserDeatils).toHaveBeenCalled();
    });
  });
  describe('getFeatureData', () => {

    it('should not set featureList when it is not empty', () => {
      // Arrange
      component.featureList = [{"name":"John", "age":30, "car":null}]; // Set featureList to a non-empty array
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(permissionServiceStub, 'getFeatureData');

      // Act
      component.getFeatureData();

      // Assert
      expect(permissionServiceStub.getFeatureData).not.toHaveBeenCalled();
      // Add more assertions if needed
    });
});
});