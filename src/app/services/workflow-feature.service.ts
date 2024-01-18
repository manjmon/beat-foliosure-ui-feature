import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable()
export class WorkflowFeatureService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  getFeaturesList(groupId: number) {
    return this._http
      .post<any>(this.myAppUrl + `api/access/features/get/${groupId}`,'')
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getCompanyList(feature: string) {
    return this._http
      .post<any>(this.myAppUrl + `api/access/company/get/${feature}`,'')
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }


  errorHandler(error: any) {
    return throwError(error);
  }

}

