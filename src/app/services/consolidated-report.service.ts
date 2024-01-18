import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ConsolidatedReportService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl+"api/";
  }
  getConsolidatedReportConfiguration() {
    return this.http
      .get<any>(this.appUrl + "get/consolidated-report/config")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getConsolidatedReportKpis(templateId:number) {
    return this.http
      .get<any>(this.appUrl + "get/cr-report/kpis/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  
  getAllConfig(templateId:number) {
    return this.http
      .get<any>(this.appUrl + "c-report/template/config/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  updateTemplate(template:any) {
    return this.http
      .put<any>(this.appUrl + "c-report/template/update",template)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  mapKpis(config:any) {
    return this.http
      .put<any>(this.appUrl + "c-report/template/kpi/update",config)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  addOrUpdateTemplate(template:any) {
    return this.http
      .post<any>(this.appUrl + "c-report/template/add",template)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  deleteTemplate(templateId:number) {
    return this.http
      .delete<any>(this.appUrl + "c-report/template/delete/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
