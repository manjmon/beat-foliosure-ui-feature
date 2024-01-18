
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { throwError, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ValuationModelService {

  private redirectStatus : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public unsavedChanges$ = this.redirectStatus.asObservable();


  myAppUrl: string = "";
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getFundList() {
    return this._http
      .get<any>(this.myAppUrl + "api/Valuation/valuation-model/fund_list/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  SaveImpliedEvValue(){
    return this._http
    .get<any>(this.myAppUrl + "api/Valuation/valuation-model/ImpliedEv")
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );

  }
  getCompanyList(fund: string) {
    return this._http
      .get<any>(this.myAppUrl + `api/Valuation/valuation-model/company_list/get?fund=${fund}`)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  downloadValuationTemplate(model: any) {
    return this._http
      .post(this.myAppUrl + "api/valuation/export/template", model, {
        responseType: "blob",
        observe: "response"
      })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }



  importValuationBulkData(formData : FormData) {
    return this._http.post<any>(this.myAppUrl + 'api/valuation/bulk-upload/import', formData).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  } 

  errorHandler(error: any) {
    return throwError(error);
  }
  
  getValuationModel(request) {
    return this._http.post<any>(this.myAppUrl + 'api/Valuation/valuation-model-list/get',request)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error.value.message))
    );
  }
    
  // This function is used to set redirection status
  setRedirectionStatus(value: boolean){
    return this.redirectStatus.next(value);
  }
}
