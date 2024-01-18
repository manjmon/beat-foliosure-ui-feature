import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowAccessService {
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
  updateGroupPermission(permissionModel: any) {
    return this.http
      .post<any>(this.appUrl + "api/mapping/subfeatures/update/", permissionModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getGroups(filter:any) {
    return this.http
      .post<any>(this.appUrl + "api/group/getgrouplists",filter)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  createGroup(group: any) {
    return this.http
      .post<any>(this.appUrl + "api/mastergroup/addupdate", group)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  createSubGroup(subGroup: any) {
    return this.http
      .post<any>(this.appUrl + "api/subGroup/add", subGroup)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  checkIfAdmin() {
    return this.http
      .get<any>(this.appUrl + "api/group/checkIfAdmin")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
