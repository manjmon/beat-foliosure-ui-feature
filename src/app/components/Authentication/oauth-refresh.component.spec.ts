import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { OauthRefreshComponent } from './oauth-refresh.component';

describe('OauthRefreshComponent', () => {
  let component: OauthRefreshComponent;
  let fixture: ComponentFixture<OauthRefreshComponent>;

  beforeEach(() => {
    const oidcAuthServiceStub = () => ({ signinSilentCallback: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OauthRefreshComponent],
      providers: [{ provide: OidcAuthService, useFactory: oidcAuthServiceStub }]
    });
    fixture = TestBed.createComponent(OauthRefreshComponent);
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
      spyOn(oidcAuthServiceStub, 'signinSilentCallback').and.callThrough();
      component.ngOnInit();
      expect(oidcAuthServiceStub.signinSilentCallback).toHaveBeenCalled();
    });
  });
});
