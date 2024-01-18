import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InternalReportService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl+"api/";
  }
  getInternalReportConfiguration() {
    return this.http
      .get<any>(this.appUrl + "get/internal-report/config")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInternalReportKpis(companyId:number,templateId:number) {
    return this.http
      .get<any>(this.appUrl + "get/internal-report/kpis/"+companyId+"/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getAllConfig(templateId:number) {
    return this.http
      .get<any>(this.appUrl + "template/config/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  updateTemplate(template:any) {
    return this.http
      .put<any>(this.appUrl + "template/update",template)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  mapKpis(config:any) {
    return this.http
      .put<any>(this.appUrl + "template/kpi/update",config)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  addOrUpdateTemplate(template:any) {
    return this.http
      .post<any>(this.appUrl + "template/add",template)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  deleteTemplate(templateId:number) {
    return this.http
      .delete<any>(this.appUrl + "template/delete/"+templateId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
