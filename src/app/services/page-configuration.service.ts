import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageConfigurationService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }
  getConfiguration() {
    return this.http
      .post<any>(
        this.appUrl + "api/configuration/get", "")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  pageConfigurationSaveData(dataObj: any) {
    return this.http
      .post<any>(this.appUrl + "api/pageconfiguration/SaveSettings", dataObj)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  
  getTrackrecordDataTypes() {
    return this.http
      .get<any>(
        this.appUrl + "api/pageconfiguration/getTrackrecordDataTypes")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getAllReportTemplates() {
    return this.http
      .get<any>(
        this.appUrl + "api/GetAllReportTemplates")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getLPReportMasterList() {
    return this.http
      .get<any>(
        this.appUrl + "api/LPReportMasterList")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  savetemplate(templateObj: any) {
    return this.http
      .post<any>(this.appUrl + "api/AddNewTemplate", templateObj)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  lpreportMappingItems() {
    return this.http
      .get<any>(
        this.appUrl + "api/LPReportMappingLineItems")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  lpreport_KPI_Mapping_ItemsBY_ModuleName() {
    return this.http
      .get<any>(
        this.appUrl + "api/LPReportMappingLineItems")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  lpReportPeriodTypes() {
    return this.http
      .get<any>(
        this.appUrl + "api/LPReportPeriodTypes")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  requestDataFromMultipleSources(): Observable<any[]> {
    let TradingRecords = this.http.get(this.appUrl + `api/LPReportMappingLineItems/TradingRecords`);
    let CreditKPI = this.http.get(this.appUrl + `api/LPReportMappingLineItems/CreditKPI`);
    return forkJoin([TradingRecords, CreditKPI]);
  }
  lptemplateConfig(templateObj: any) {
    return this.http
      .post<any>(this.appUrl + "api/LpConfigurationSettings", templateObj)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  lpReportSectionItems(templateId) {
    return this.http
      .get<any>(
        this.appUrl + `api/LPTemplateSections/${templateId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getFundReportSectionList() {
    return this.http
      .get<any>(
        this.appUrl + "api/FundReportSectionList")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getPageConfiguration = () => {

    return this.http
      .get<any>(
        this.appUrl + "api/pageconfiguration/get")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  
  getPageConfigSettingById= (pageId:number) => {

    return this.http
      .post<any>(
        this.appUrl + "api/pageconfigsetting/get",  { Value: pageId.toString() })
       .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );    
  }


  getPageFieldAttributes = () => {
    return this.http
      .get<any>(
        this.appUrl + "api/GetAllPageFieldAttributes")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );

  }

  SavePageConfiguration = () => {

    return this.http
      .get<any>(
        this.appUrl + "api/SavePageConfiguration")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );

  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
