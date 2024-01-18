import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CryptoService] });
    service = TestBed.get(CryptoService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getEncryptedValue', () =>{
    it('spyOn getEncryptedValue', () =>{
      let plainText = 'test';
      spyOn(service, 'getEncryptedValue').and.callThrough();
      service.getEncryptedValue(plainText);
      expect(service.getEncryptedValue).toHaveBeenCalled();
    })
  });
});
