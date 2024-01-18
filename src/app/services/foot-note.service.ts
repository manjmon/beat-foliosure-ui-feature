import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Params, Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class FootNoteService {

  myAppUrl: string = "";

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string, private router: Router) {
    this.myAppUrl = baseUrl;
  }
  errorHandler(error: any) {
    return throwError(error);
  }

  getFootNote(moduleId:number,companyId:number) {
    return this.http.get<any>(this.myAppUrl + "api/get/foot-note/" + moduleId+"/"+companyId).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  addFootNote(footNote: any) {
    return this.http.post<any>(this.myAppUrl + "api/add/foot-note",footNote).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  updateFootNote(footNote: any) {
    return this.http.put<any>(this.myAppUrl + "api/update/foot-note",footNote).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  getEsgFootNote(parameters: any) {
    let queryParams: Params = {};
        if (parameters) {
            queryParams = parameters;
        }
    return this.http.get<any>(this.myAppUrl + "api/esg/get/foot-note", { params: queryParams }).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  addOrUpdateEsgFootNote(footNote: any) {
    return this.http.post<any>(this.myAppUrl + "api/esg/addOrUpdate/foot-note", footNote).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
}
