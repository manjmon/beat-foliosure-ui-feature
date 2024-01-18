import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {


  setCookie = (cname:string, cvalue:string, expiry:any) => {
    let expires = "expires=" + expiry.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  getCookie = (cname:string) => {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let c of ca) {
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };

  removeCookie(name:string) {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=;" + expires + ";path=/";
  }

}
