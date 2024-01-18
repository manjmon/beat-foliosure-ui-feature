import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }
  errorHandler(error: any) {
    return throwError(error);
  }
  getReportTypes() {
    return this._http
      .get<any>(this.myAppUrl + "api/get/download/report-types")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getInternalReportTemplates() {
    return this._http
      .get<any>(this.myAppUrl + "api/get/internal-report/templates")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getInternalReportCompanies(templateIds:any) {
    return this._http
      .post<any>(this.myAppUrl + "api/internal-report/companies/template",templateIds)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  downloadReport(configuration:any) {
    return this._http
      .post(this.myAppUrl + "api/internal-report/download", configuration, {
        responseType: "blob",
        observe: "response"
      }).pipe(catchError(this.errorHandler));
  }
  downloadConsolidatedReport(configuration:any) {
    return this._http
      .post(this.myAppUrl + "api/consolidated-report/download", configuration, {
        responseType: "blob",
        observe: "response"
      }).pipe(catchError(this.errorHandler));
  }
  downloadBackgroundReport(jobId:any) {
    return this._http
      .post(this.myAppUrl + "api/internal-report/download-bg",{
        JobId:jobId
      },{
        responseType: "blob",
        observe: "response"
      }).pipe(catchError(this.errorHandler));
  }
  getConsolidatedReportTemplates() {
    return this._http
      .get<any>(this.myAppUrl + "api/get/consolidated-report/templates")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
}
