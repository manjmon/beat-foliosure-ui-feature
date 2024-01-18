import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { saveAs } from "file-saver";
@Injectable()
export class FundService {
  myAppUrl: string = "";
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }
  GetPortfolioCompanyFundHolding(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/fund/track-record/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  getFundsList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFunds", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundsData(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/fund/get/all", "")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundsListQuery(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFundData() {
    return this._http
      .post<any>(this.myAppUrl + "api/Fund/get", "")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundNamesList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFundNames", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundTrackRecordList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetTrackRecordList", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getFundById(fundId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/GetFunds", fundId)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  createFund(fundDetail: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/CreateFund", fundDetail)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updateFund(fundDetail: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/CreateFund", fundDetail)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  saveFundTrackRecord(fundTrackRecord: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/Funds/SaveFundTrackRecord",
        fundTrackRecord
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  
  getFundTrackRecordConfiguration(fundTrackRecord: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/fund/get-fundtrackrecord-configuration",
        fundTrackRecord
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getMasterFundModel() {
    return this._http.get<any>(this.myAppUrl + "api/Funds/master-model").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  
  getInvestors() {
    return this._http
      .post<any>(
        this.myAppUrl + "getAll/investor",""
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getFundInvestors(id:number) {
    const url = `${this.myAppUrl}get/investor/${id}`;
    return this._http
      .post<any>(
        url,""
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  exportFundList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/Funds/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  downloadFile(filter: any) {
    let headers = new Headers();
    headers.append("responseType", "arraybuffer");

    return this._http
      .post(this.myAppUrl + "api/Funds/Export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .subscribe(
        (response) => {
          if (response.body != null) {
            let file = new Blob([response.body], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            let header = response.headers.get("Content-Disposition");
            if (header != null) {
              let fileName = header.split(";")[1].trim().split("=")[1];
              saveAs(file, fileName);
            }
          }
        },
        (err) => this.errorHandler(err)
      );
  }
  getFundExcelDownload(model: any) {
    return this._http
      .post(this.myAppUrl + "api/bulk-upload/fund/template", model, {
        responseType: "blob",
        observe: "response"
      })
      .pipe(catchError(this.errorHandler));
  }

  getFundsListData(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/Funds/getFundList", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}
