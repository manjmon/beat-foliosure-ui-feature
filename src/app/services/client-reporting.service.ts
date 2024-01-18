import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class ClientReportingService {

  myAppUrl: string = "";

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string, private router: Router) {
    this.myAppUrl = baseUrl;
  }
  public getJSON(): Observable<any> {
    return this.http.get("./assets/json/efe95577-fe4d-4b02-ba0e-39d01fdcf297.json");
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  getUnstructerDataByPortfolioCompanyId(portfolioCompanyId: any,guId) {
    return this.http.get<any>(this.myAppUrl + "api/UnstructuredHistory/GetUnstructuredList/" + portfolioCompanyId+"/"+guId).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  getTabsByPortfolioCompanyId(portfolioCompanyId: any) {
    return this.http.get<any>(this.myAppUrl + "api/UnstructuredHistory/GetClientReportTabs/" + portfolioCompanyId).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  getTabs(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/UnstructuredHistory/GetClientReportTabs", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPeriodTypes(portfolioCompanyId: any) {
    return this.http.get<any>(this.myAppUrl + "api/UnstructuredHistory/adhoc-periodTypes/" + portfolioCompanyId).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  exportReports(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/UnstructuredHistory/adhoc-excel-download", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
}
