import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class CashflowService {
  myAppUrl: string = "";
  router: Router;
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getCashflowFileList(filter: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/files/get", filter)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  getCashFlowDeatils(fileId: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/getbyid", fileId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getCashFlowFxRates(cashflow: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/fxrates", cashflow)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  GetReportngCurrencyValuesForFundPerformance(fp: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/fundPerformance/fxrates", fp)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  saveCashflowData(cashFlowId: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/cashflow/save", cashFlowId)
      .pipe(
        map((response: any) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  downloadCashflowFile(FileUploadDetails: any) {
    return this.http
      .post(this.myAppUrl + "api/cashflow/export", FileUploadDetails, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportCashflowData(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/cashflow/exportdata", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  newExportCashflowData(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/cashflow/common/exportdata", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  getCashFlowUploadValidate(): Observable<any> {
      return this.http.get<any>(this.myAppUrl + "api/cashflow-upload/validate").pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getCashFlowPageConfigTransactionTypes(): Observable<any> {
    return this.http.get<any>(this.myAppUrl + "api/cashflow/TransactionTypes").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
  errorHandler(error: any) {
    return throwError(error);
  }
}
