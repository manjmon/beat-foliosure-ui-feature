import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private router: Router
  ) {
    this.myAppUrl = baseUrl;
  }
  getPCProfitAndLossValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/Financials/profitloss",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportCompanyProfitAndLoss(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/Financials/profitloss/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
