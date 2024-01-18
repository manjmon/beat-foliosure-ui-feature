import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DataAuditModel } from "./DataAuditModel";

@Injectable()
export class AuditService {
  myAppUrl: string = "";
  router: Router;
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }

  getDataLog(datalog: DataAuditModel): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/DataAudit/Log", datalog)
      .pipe(map((response) => response));
  }

  UpdateKPIData(dataauditlog:any):Observable<any>{
    return this.http
      .post<any>(this.myAppUrl + "api/DataAudit/ResetKPI", dataauditlog)
      .pipe(map((response) => response));
  }

  UpdateKPI(dataauditlog:any):Observable<any>{
    return this.http
      .post<any>(this.myAppUrl + "api/pc-kpis/update-kpi", dataauditlog)
      .pipe(map((response) => response));
  }

  ExportDataLog(datalog: DataAuditModel) {
    return this.http.post(
      this.myAppUrl + "api/DataAudit/Log?Export=true",
      datalog,
      { responseType: "blob", observe: "response" }
    );
  }

  getMasterKpiAuditLog(datalog: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/master-kpis/auditlog", datalog)
      .pipe(map((response) => response));
  }
  geFinancialKpiAuditLog(datalog: any): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/financials/audit", datalog)
      .pipe(map((response) => response));
  }

  revertMasterKpiData(dataauditlog:any):Observable<any>{
    return this.http
      .post<any>(this.myAppUrl + "api/master-kpi-values/update", dataauditlog)
      .pipe(map((response) => response));
  }
  revertFinancialKpiData(dataAuditlog:any):Observable<any>{
    return this.http
      .post<any>(this.myAppUrl + "api/financials/audit/update-value", dataAuditlog)
      .pipe(map((response) => response));
  }
  exportMasterKpiAuditLog(datalog: any) {
    return this.http.post(
      this.myAppUrl + "api/master-kpis/auditlog?Export=true",
      datalog,
      { responseType: "blob", observe: "response" }
    );
  }
  exportFinancialKpiAuditLog(datalog: any) {
    return this.http.post(
      this.myAppUrl + "api/financials/auditlog/export",
      datalog,
      { responseType: "blob", observe: "response" }
    );
  }

  getAuditLogData(datalog: DataAuditModel): Observable<any> {
    return this.http
      .post<any>(this.myAppUrl + "api/DataAudit/Log", datalog)
      .pipe(map((response) => response));
  }

  RevertKpiData(dataauditlog:any):Observable<any>{
    return this.http
      .post<any>(this.myAppUrl + "api/data-audit/revert", dataauditlog)
      .pipe(map((response) => response));
  }
}
