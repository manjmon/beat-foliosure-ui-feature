import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
@Injectable()
export class FundReportService {
    myAppUrl: string = "";
    constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string, private router: Router) {
        this.myAppUrl = baseUrl;
    }
    errorHandler(error: any) {
        return throwError(error);
    }
    getFundReportTemplates() {
        return this.http
            .get<any>(
                this.myAppUrl + "api/reportTemplate/fund/templateList")
            .pipe(
                map((response) => response),
                catchError(this.errorHandler)
            );
    }
    fundtemplateConfig(templateObj: any) {
        return this.http
            .post<any>(this.myAppUrl + "api/reportTemplate/fund/configurationSettings", templateObj)
            .pipe(
                map((response) => response),
                catchError(this.errorHandler)
            );
    }
    saveFundTemplate(templateObj: any) {
        return this.http
            .post<any>(this.myAppUrl + "api/reportTemplate/fund/save", templateObj)
            .pipe(
                map((response) => response),
                catchError(this.errorHandler)
            );
    }
    getLoadFundReportTemplates(templateId) {
        return this.http
            .get<any>(
                this.myAppUrl + `api/reportTemplate/fund/fundTemplateDetails/${templateId}`)
            .pipe(
                map((response) => response),
                catchError(this.errorHandler)
            );
    }
    fundReportGraphs(fundId) {
        return this.http
            .get<any>(
                this.myAppUrl + `api/reportTemplate/fund/fundreportGraphDetails/${fundId}`)
            .pipe(
                map((response) => response),
                catchError(this.errorHandler)
            );
    }
}
