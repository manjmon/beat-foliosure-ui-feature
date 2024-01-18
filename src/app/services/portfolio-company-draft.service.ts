import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class PortfolioCompanyDraftService {
  myAppUrl: string = "";

  constructor(
    private _http: HttpClient, @Inject("BASE_URL") baseUrl: string, 
    private router: Router) {
    this.myAppUrl = baseUrl;
  }

  getPortfolioCompanyDraftList(event:any) {
    return this._http
      .post<any>(this.myAppUrl + "api/workflow/draft_list/get",event)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

}