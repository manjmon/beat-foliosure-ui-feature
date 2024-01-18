import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class FileUploadService {
  myAppUrl: string = "";
  message: string="";
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string, private router: Router) {
    this.myAppUrl = baseUrl;
  }

  private _subject = new Subject<any>();
  subjetcValue: any = { progress: 0, message: "" };
  statuscValue: any = { code: "", message: "" };
  changeFileUploadProgress(value: any) {
    this._subject.next(value);
  }
  get events$() {
    return this._subject.asObservable();
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  importBulkData(formData: any, strAPIURL: string) {
    return this._http.post<any>(this.myAppUrl + strAPIURL, formData).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  importFoFBulkData(formData: any) {
    return this._http.post<any>(this.myAppUrl + "api/fund-of-fund/import", formData).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  importCashflowDetails(formData: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/cashflow/import", formData)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  exportTemplates(model: any) {
    let url = this.myAppUrl + "api/bulk-upload/import/template";

    if (model.moduleType == "ESG"){
      url = this.myAppUrl + "api/esg/import/template"
    }
    return this._http
      .post(url, model, {
        responseType: "blob",
        observe: "response"
      })
      .pipe(catchError(this.errorHandler));
  }
  foFExportTemplates(model: any) {
    return this._http
      .post(this.myAppUrl + "api/fof/import/template", model, {
        responseType: "blob",
        observe: "response"
      })
      .pipe(catchError(this.errorHandler));
  }

  UploadESG(formData : FormData) {
    return this._http.post<any>(this.myAppUrl + 'api/esg/upload/template', formData).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
}

