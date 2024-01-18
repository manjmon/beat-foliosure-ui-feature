import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { CookieService } from './cookie.service';
import { OidcAuthService } from './oidc-auth.service';

describe('OidcAuthService', () => {
  let service: OidcAuthService;
  let config: any;

  beforeEach(() => {
    config = { wrapper_endpoint: 'http://example.com' }; 
    const cryptoServiceStub = () => ({
      getDecryptedValue: encryptedToken => ({}),
      getEncryptedValue: string => ({})
    });
    const routerStub = () => ({});
    const accountServiceStub = () => ({ redirectToUnauthorized: () => ({}) });
    const cookieServiceStub = () => ({ getCookie: arg => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OidcAuthService,
        { provide: CryptoService, useFactory: cryptoServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: CookieService, useFactory: cookieServiceStub },
      ]
    });
    spyOn(OidcAuthService.prototype, 'initializeconfig');
    service = TestBed.get(OidcAuthService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('makes expected calls', () => {
      expect(OidcAuthService.prototype.initializeconfig).toHaveBeenCalled();
    });
  });

  describe('initializeconfig', () => {
    it('makes expected calls', () => {
      spyOn(service, 'getEnvironmentConfig').and.callThrough();
      spyOn(service, 'registerOidcEvents').and.callThrough();
      (<jasmine.Spy>service.initializeconfig).and.callThrough();
      service.initializeconfig();
      expect(service.getEnvironmentConfig).toHaveBeenCalled();
      expect(service.registerOidcEvents).toHaveBeenCalled();
    });
  });

 
  describe('getToken', () => {
    it('makes expected calls getToken', () => {
      const cryptoServiceStub: CryptoService = TestBed.get(CryptoService);
      const cookieServiceStub: CookieService = TestBed.get(CookieService);
      spyOn(cryptoServiceStub, 'getDecryptedValue').and.callThrough();
      spyOn(cookieServiceStub, 'getCookie').and.callThrough();
      service.getToken();
      expect(cryptoServiceStub.getDecryptedValue).toHaveBeenCalled();
      expect(cookieServiceStub.getCookie).toHaveBeenCalled();
    });
  });

  describe('getClaimsFromToken', () => {
    it('makes expected calls getClaimsFromToken', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      spyOn(service, 'getToken').and.returnValue(mockToken);
      service.getClaimsFromToken();
      expect(service.getToken).toHaveBeenCalled();
    });
  });
 
});
