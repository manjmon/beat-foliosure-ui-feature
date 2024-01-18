import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowInvestmentService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }  
  getWorkflowInvestmentKPIValues(filter: any) {
    return this.http
      .post<any>(
        this.appUrl + "api/workflow/investment-kpi-value/get",
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
