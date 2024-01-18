import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowTradingRecordsService {

  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }  
  getWorkflowTradingRecordsKPIValues(filter: any) {
    return this.http
      .post<any>(
        this.appUrl + "api/workflow/master-kpi-draft-values/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
