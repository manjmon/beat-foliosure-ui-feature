import { Injectable, Inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DealService {
  myAppUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getDealsList(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/Deals/Get", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  getDealsPageConfiguration(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/deal/get-deal-configuration", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }
  getDealsQuery(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/deals/getAll", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  getPortfolioCompanyFundHolding(filter: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/Deals/GetPortfolioCompanyFundHolding",
        filter
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  saveDeal(dealDetail: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/Deals/Save", dealDetail)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  savePortfolioCompanyFundHolding(portfolioCompanyFundHolding: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/Deals/SavePortfolioCompanyFundHolding",
        portfolioCompanyFundHolding,
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }
  savecustomPortfolioCompanyFundHolding(customFieldsData: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/Deals/SaveCustomPortfolioCompanyFundHolding",
        customFieldsData,
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }
  getDealsTradingRecordsEditAddConfiguration(portfolioCompanyFundHolding: any) {
    return this.http
      .post<any>(
        this.myAppUrl + "api/deal/get-dealtrackrecord-configuration",
        portfolioCompanyFundHolding
      )
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }

  getMasterDealModel() {
    return this.http.get<any>(this.myAppUrl + "api/deal/master-data").pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  GetMasterPortfolioFundHoldingModel() {
    return this.http
      .get<any>(this.myAppUrl + "api/master/FundHoldingStatus/get")
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }
  deleteTrackRecord(dealId:number,fundHoldingId:number) {
    return this.http
      .delete<any>(this.myAppUrl + "api/delete/fund-holding/"+dealId+"/"+fundHoldingId)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }
  exportDealList(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/Deals/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  GetPortfolioCompanyFundHolding(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/Deals/GetPortfolioCompanyFundHolding/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  getLatestDealQuarterYear() {
    return this.http.get<any>(this.myAppUrl + "api/deal/latest-quarter-year").pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }
  getFilterLatestDealQuarterYearCount(filter: any): Observable<any> {
    return this.http.post<any>(this.myAppUrl + "api/deal/latest-quarter-year/count", filter).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  exportDealNewTransaction(filter: any) {
    return this.http
      .post(this.myAppUrl + "api/Deals/Export/newTransaction", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  getDealDropDown() {
    return this.http.get<any>(this.myAppUrl + "api/deals/get/dealsDropDown").pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
