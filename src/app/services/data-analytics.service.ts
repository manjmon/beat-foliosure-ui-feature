import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
declare let $: any;
@Injectable({
  providedIn: "root",
})
export class DataAnalyticsService {
  myAppUrl: string = "";
  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private router: Router
  ) {
    this.myAppUrl = baseUrl;
  }
  errorHandler(error: any) {
    return throwError(() => error);
  }
  getDataAnalyticsList(isCustom: boolean) {
    return this.http
      .get<any>(this.myAppUrl + "api/dataAnalytics/get/" + isCustom)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getStaticFields = () => {
    return this.http
      .get<any>(this.myAppUrl + "api/data-analytics/static-field")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  };
  getFixedStaticFields = () => {
    return this.http
      .get<any>(this.myAppUrl + "api/data-analytics/fixed-static-fields")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  };
  isExistDashboard(name: string) {
    return this.http
      .get<any>(this.myAppUrl + "api/analytics/dashboard/is-exist/" + name)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  saveDashboard(dashboard: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/analytics/dashboard/save", dashboard)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  deleteDashboard(dashboard: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/analytics/dashboard/delete", dashboard)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getQuarter(date) {
    return "Q" + Math.ceil((date.getMonth() + 1) / 3);
  }

  GetAllFilterData() {
    return this.http
      .post<any>(this.myAppUrl + "api/data-analytics/filters", {})
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  GetCompanies(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/data-analytics/filters/companies", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  GetFundsByInvestor(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/data-analytics/filters/funds", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getInvestorsList() {
    return this.http
      .get<any>(this.myAppUrl + "api/data-analytics/filters/investors")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  GetKpisByModuleId(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/data-analytics/filters/kpis", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  GetESGKpisByModuleId(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/data-analytics/filters/esgkpis", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  uploadAnalyticsFiles(filter: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/analytics/dashboard/upload", filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
}
