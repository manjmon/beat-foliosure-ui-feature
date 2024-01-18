import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CookieService] });
    service = TestBed.get(CookieService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('should set cookie', () => {
    const key = 'testKey';
    const value = 'testValue';
    const expiry = new Date(); // Provide a value for expiry
    expiry.setDate(expiry.getDate() + 1); // Set expiry to one day in the future
    service.setCookie(key, value, expiry);
    expect(document.cookie).toContain(`${key}=${value}`);
  });

  it('should get cookie', () => {
    const key = 'testKey';
    const value = 'testValue';
    document.cookie = `${key}=${value}`;
    expect(service.getCookie(key)).toEqual(value);
  });
});
