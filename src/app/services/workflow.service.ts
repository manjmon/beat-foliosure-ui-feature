import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable()
export class WorkflowService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  async getWorkflowStatus() {
    return this._http
      .get<any>(this.myAppUrl + `api/workflow/status/get`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  async getWorkflowDetails(featureId:number, requestId:number){
    return this._http
      .get<any>(this.myAppUrl + `api/workflowrequest/get/${featureId}/${requestId}`)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  async createWorkflow(worfkflowmodel : any) {
    return this._http
      .post<any>(this.myAppUrl + `api/workflow/create`, worfkflowmodel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

}

