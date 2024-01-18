import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CashflowBetaService {
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
  getPCCashFlowValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/Financials/cashflow",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportCompanyCashflow(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/Financials/cashflow/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
}
