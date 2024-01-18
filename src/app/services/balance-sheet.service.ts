import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private router: Router
  ) {
    this.myAppUrl = baseUrl;
  }
  errorHandler(error: any) {
    return throwError(error);
  }
  getPCBalanceSheetValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/Financials/balancesheet",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportCompanyBalanceSheet(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/Financials/balancesheet/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
}
