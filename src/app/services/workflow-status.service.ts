import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowStatusService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }

  getWorkflowStatus() {
    return this.http
      .get<any>(this.appUrl + "api/WorkFlowStatus/get")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  addOrUpdateWorkflowStatus(workFlowStatus: any) {
    return this.http
      .post<any>(this.appUrl + "api/WorkFlowStatus/add-or-update", workFlowStatus)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  deleteWorkflowStatus(statusId) {
    return this.http
      .delete<any>(this.appUrl + "api/WorkFlowStatus/delete/" + statusId)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  MapStatusToGroup(workFlowStatus: any) {
    return this.http
      .post<any>(this.appUrl + "api/WorkFlowStatus/mapStatusToGroup", workFlowStatus)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
