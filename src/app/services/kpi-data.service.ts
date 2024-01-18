import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class KPIDataService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }
  getKPIsByType(type: string, compId) {
    return this._http
      .get<any>(this.myAppUrl + "api/kpi/get/"+type+"/"+compId)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  GetKpiFormula(formulaModel:any) {
    return this._http
      .post<any>(this.myAppUrl +  "api/kpi-formula",formulaModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  UpdateFormulaByKPIId(formulaModel: any) {
    return this._http
      .put<any>(this.myAppUrl + "api/kpi/formula/update",formulaModel)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  errorHandler(error: any) {
    return throwError(error);
  }
}
