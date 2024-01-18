import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InvestorService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }
  getInvestorAddEditConfiuration(filter: any) {
    return this.http
      .post<any>(this.appUrl + "get/investor/configuration", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getMasterGeoLocations() {
    return this.http.get<any>(this.appUrl + "get/investor/locations").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
  investorAddEdit(model: any) {
    return this.http
      .post<any>(this.appUrl + "investor/save", model)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getinvestorlist(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/getInvestorList", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundsByInvestor(encryptedId: string) {
    let url = `${this.appUrl}get/investor/funds/${encryptedId}`;
    return this.http
      .get<any>(url)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInvestorStakeTitle() {
    let url = `${this.appUrl}investor-stake/title`;
    return this.http
      .get<any>(url)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInvestorByValuationTableSelection(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/get/Valuationtable/selections", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInvestorById(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/getInvestorDetails", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundInvestorsById(filter: any) {
    return this.http
      .post<any>(this.appUrl + "get/investor/investor-funds", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundInvestorTrackRecord(model: any) {
    return this.http
      .post<any>(this.appUrl + "get/investor/fund-track-record", model)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInvestorDashBoard(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/getInvestorDashboardDetails", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundInvestorWiseDealTrackRecord(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/get/company-details", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getCompanyPerformanceData(filter) {
    return this.http
      .post<any>(this.appUrl + "get/investor/company-performance", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundInvestorWiseValuationTable(filter: any) {
    return this.http
      .post<any>(this.appUrl + "investor/get/Valuation-table", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getCompanyPerformanceCompanyMasterList(filter) {
    return this.http
      .post<any>(this.appUrl + "get/investor/company-performance/masterCompanyList", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getAllInvestorsList() {
    return this.http.get<any>(this.appUrl + "investor/get/fillInvestors").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

}
