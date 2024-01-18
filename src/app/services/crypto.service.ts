import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private cryptoPassword:string = "BeatFSCryptoPwd@";
  getEncryptedValue(plainText:string) : string{
    if(plainText!=null && plainText!="")
      return CryptoJS.AES.encrypt(plainText.trim(), this.cryptoPassword.trim()).toString();
    return "";
  }
  getDecryptedValue(encryptedText:string) : string{
    if(encryptedText!=null && encryptedText!="")
      return CryptoJS.AES.decrypt(encryptedText.trim(), this.cryptoPassword.trim()).toString(CryptoJS.enc.Utf8);
    return "";
  }
}
