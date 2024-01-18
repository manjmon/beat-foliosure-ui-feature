import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OauthLogoutComponent } from './oauthlogout.component';

describe('OauthLogoutComponent', () => {
  let component: OauthLogoutComponent;
  let fixture: ComponentFixture<OauthLogoutComponent>;
  let oidcAuthService: OidcAuthService;

  beforeEach(() => {
    const oidcAuthServiceStub = {
      logout: jasmine.createSpy('logout'),
      signoutRedirectCallback: jasmine.createSpy('signoutRedirectCallback')
    };
    const activatedRouteStub = {
      snapshot: {
        queryParams: {
          action: 'logout'
        }
      }
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OauthLogoutComponent],
      providers: [
        { provide: OidcAuthService, useValue: oidcAuthServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: 'BASE_URL', useValue: 'http://example.com' }
      ],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(OauthLogoutComponent);
    component = fixture.componentInstance;
    oidcAuthService = TestBed.inject(OidcAuthService);
  });

  it('should call logout method when action is "logout"', () => {
    spyOn(component, 'deActivateToken').and.returnValue(of({}));
    component.ngOnInit();
    expect(component.deActivateToken).toHaveBeenCalled();
    expect(oidcAuthService.logout).toHaveBeenCalled();
  });

  it('should call signoutRedirectCallback method when action is not "logout"', () => {
    spyOn(component, 'deActivateToken').and.returnValue(of({}));
    component.ngOnInit();
    expect(component.deActivateToken).toHaveBeenCalled();
  });
});