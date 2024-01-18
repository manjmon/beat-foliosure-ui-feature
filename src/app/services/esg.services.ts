import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EsgService {
  appUrl: string = "";
  private selectedSubpageData = new BehaviorSubject<any>([]);
  private queryFilter = new BehaviorSubject<any>(null);
  private isEsdDataUpdated = new BehaviorSubject<boolean>(false);
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }

  getEsgDashboardData = (pcId: string) => {
    return this._http.get<any>(this.appUrl + "api/esg/dashboard/data?encryptedPortfolioCompanyId=" + pcId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  setselectedSubpageData(selectedSubpageData: any) {
    this.selectedSubpageData.next(selectedSubpageData);
  }
  getSelectData() {
    return this.selectedSubpageData.asObservable();
  }

  setQueryFilter(selectedSubpageData: any) {
    this.queryFilter.next(selectedSubpageData);
  }

  getQueryFilter() {
    return this.queryFilter.asObservable();
  }
  getEsgbarData(filter: any) {
    return this._http.post<any>(this.appUrl + "api/esg/getEsgBar/data",
      filter
    )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getCompanyKpiValueByEsgModuleId = (filter: any) => {
    return this._http.post<any>(this.appUrl + "api/esg/kpidetailsbyid/get",
      filter
    )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  updateEsgKpiData = (filter: any) => {
    return this._http.post<any>(this.appUrl + "api/esg/updateKpiData", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  
  setEsgDataUpdatedFlag(flag: boolean) {
    this.isEsdDataUpdated.next(flag);
  }
  getEsgDataUpdatedFlag() {
    return this.isEsdDataUpdated.asObservable();
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
