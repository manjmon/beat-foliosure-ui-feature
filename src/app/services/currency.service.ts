import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class CurrencyService {

  myAppUrl: string = "";

  constructor(private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private router: Router) {
    this.myAppUrl = baseUrl;
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  getAllCurrencies() {
    return this._http
      .get<any>(
        this.myAppUrl + "api/master/GetAllCurrencies"
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  GetToCurrenciesByFromCurrency(currCode) {
    return this._http
      .get<any>(
        this.myAppUrl + "api/master/GetToCurrenciesByFromCurrency?fromCurrency=" + currCode
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  GetFxratesBulkUpload() {
    return this._http
      .get<any>(
        this.myAppUrl + "api/master/fxrates"
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
}
