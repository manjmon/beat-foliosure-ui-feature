import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowCompanyService {
  appUrl: string = "";
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }
  createWorkflow(workFlowRequest: any) {
    return this.http
      .post<any>(this.appUrl + "api/workflow/create", workFlowRequest)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  updateWorkflow(workFlowRequest: any) {
    return this.http
      .post<any>(this.appUrl + "api/workflow/Update", workFlowRequest)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getWorkflowStatus() {
    return this.http
      .get<any>(this.appUrl + "api/workflow/status/get")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getWorkflowCurrentStatus(workflowRequest:any) {
    return this.http
      .post<any>(this.appUrl + "api/workflow/submit/status",workflowRequest)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  moveStatusToNextLevel(workflowRequestId:number) {
    return this.http
      .get<any>(this.appUrl + `api/workflow/submit/next/${workflowRequestId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  publishWorkflow(workflowRequestId:number) {
    return this.http
      .put<any>(this.appUrl + `api/workflow/submit/publish/${workflowRequestId}`,'')
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getCompanyWorkFlowDraft(WorkFlowRequestId:any,encryptedRequestId:any) {
    return this.http
      .get<any>(this.appUrl + `api/workflowrequest/IsCompanyWorkflowTable/${WorkFlowRequestId}/${encryptedRequestId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getWorkflowPermissions(model) {
    return this.http
      .post<any>(this.appUrl + 'api/workflowrequest/getPermission/',model)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  addWorkflowComment(comment : any) {
    return this.http
      .post<any>(this.appUrl + `api/workflow/AddOrUpdateComment`, comment)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  updateWorkflowRequest(request : any) {
    return this.http
      .put<any>(this.appUrl + `api/workflow/updateStatus`, request)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getWorkflowComments(mappingId: any) {
    return this.http
      .get<any>(this.appUrl + `api/workflow/comments/get/${mappingId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  discardWorkflow(workFlowRequest: any) {
    return this.http
      .post<any>(this.appUrl + "api/workflow/Discard", workFlowRequest)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getPCCompanyKPIValues(id: any) {
    return this.http
      .post<any>(this.appUrl + "api/workflow/company-kpi-values/get", id)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyOperationalKpiValues(filter: any) {
    return this.http
      .post<any>(
        this.appUrl + "api/workflow/operational-kpi-values/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  updateWorkflowKpiValue(model) {
    return this.http
      .post<any>(this.appUrl + 'api/workflow/investment/update-kpi',model)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  ResetWorkflowStatus(workflowRequestId:number) {
    return this.http
      .put<any>(this.appUrl + `api/workflow/status/reset/${workflowRequestId}`,'')
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  UpdateWorkflowMappingStatus(workflowRequestMappingId:number) {
    return this.http
      .put<any>(this.appUrl + `api/workflow/mappingstatus/update/${workflowRequestMappingId}`,'')
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getWorkflowAllDetails(workflowRequestId:number){
    return this.http
      .get<any>(this.appUrl + `api/workflow/GetAll/${workflowRequestId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
