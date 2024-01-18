import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MasterKpiService {
  appUrl: string = "";
constructor(private http: HttpClient,@Inject("BASE_URL") baseUrl: string) {
  this.appUrl = baseUrl;
 }
 getMasterKPIValues(filter: any) {
  return this.http
    .post<any>(
      this.appUrl + "api/portfolio-company/master-kpi-values/get",
      filter
    )
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getBetaMasterKPIValues(filter: any) {
  return this.http
    .post<any>(
      this.appUrl + "api/pc-kpis/master-kpi",
      filter
    )
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
errorHandler(error: any) {
  return throwError(error);
}

}
