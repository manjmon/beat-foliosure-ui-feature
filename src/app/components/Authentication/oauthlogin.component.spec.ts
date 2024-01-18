import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { OauthLoginComponent } from './oauthlogin.component';

describe('OauthLoginComponent', () => {
  let component: OauthLoginComponent;
  let fixture: ComponentFixture<OauthLoginComponent>;

  beforeEach(() => {
    const oidcAuthServiceStub = () => ({ signinRedirectCallback: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OauthLoginComponent],
      providers: [{ provide: OidcAuthService, useFactory: oidcAuthServiceStub }]
    });
    fixture = TestBed.createComponent(OauthLoginComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'signinRedirectCallback').and.callThrough();
      component.ngOnInit();
      expect(oidcAuthServiceStub.signinRedirectCallback).toHaveBeenCalled();
    });
  });
});
