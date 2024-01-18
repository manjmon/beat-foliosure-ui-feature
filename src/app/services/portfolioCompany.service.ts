import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class PortfolioCompanyService {
  myAppUrl: string = "";

  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string,private router: Router) {
    this.myAppUrl = baseUrl;
  }

  pdfExport(formData: any) {
    return this._http
      .post(this.myAppUrl + "api/company/pdf", formData, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  addPortfolioCompany(portfoliocompany: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfolio-company/add", portfoliocompany)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  updatePortfolioCompany(portfoliocompany: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfolio-company/add", portfoliocompany)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getPortfolioCompanyList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompany() {
    return this._http
      .post<any>(this.myAppUrl + "api/company/get",'')
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyByGroup(event:any) {
    return this._http
      .post<any>(this.myAppUrl + "api/companies/get",event)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getReportsType() {
    return this._http
      .get<any>(this.myAppUrl + "api/workflow/reporttypes/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  } 
  getWorkflowMappingStatusByUserId() {
    return this._http
      .get<any>(this.myAppUrl + "api/workflow/mappingstatusbyuserid/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getLpReportConfiguration(fundId: any) {
    return this._http
      .get<any>(this.myAppUrl + `api/getLpReportConfiguration/${fundId}`)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  updateLpReportConfiguration(fundId:string, model: any) {
    return this._http
      .post<any>(this.myAppUrl + `api/updateLPReportConfig/${fundId}`, model)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  createDraft(model: any) {
    return this._http
      .post<any>(this.myAppUrl + 'api/workflow/draft', model)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyProfitabilityList(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getProfitability",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyById(id: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/getbyid", id)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyDraftById(companyId: any, workflowRequestId: any) {
   let getCompanyDraftendPoint = `${this.myAppUrl}api/portfoliocompany/draft/getbyid/${companyId}/${workflowRequestId}`;
    return this._http
      .post<any>(getCompanyDraftendPoint, "")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getMasterPCModel() {
    return this._http
      .get<any>(this.myAppUrl + "api/portfolio-company/master-model/get")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  savePortfolioProfitability(portfolioProfitability: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/saveprofitability",
        portfolioProfitability
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  exportPortfolioCompanyList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportPortfolioCompanyKPIDataList() {
    return this._http
      .get(this.myAppUrl + "api/portfolio-company/kpi-data/export", {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportProfitabilityList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/profitability/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  getPortfolioCompanyOperationalKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getoperationalKPIValues",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getPortfolioCompanyOperationalKPIValuesTranpose(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfoliocompany/getoperationalKPIValuesTranpose",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCOperationalKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/get/operational-kpi-values",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportPCOperationalKPIList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/operational-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  getCompanyKpiValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/get/company-kpi-values",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  SavePortfolioCompanyOperationalKPIValue(model: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolioCompany/SaveOperationalKPIValue",
        model
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetOperationalKPIList(portfolioCompanyId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfoliocompany/getoperationalKPI ", {
        value: portfolioCompanyId,
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  redirectToLogin(error: any) {
    if (error.status == 401) {
      this.router.navigate(["/login"]);
    }
  }

  getPCBalanceSheetValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/balance-sheet-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCProfitAndLossValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/profit-loss-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCCashFlowValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/cashflow-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getSegmentTypeForFinancialsByCompanyID(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/getSegmentTypeForFinancialsByCompanyId",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportCompanyBalanceSheet(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/balance-sheet/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportCompanyProfitAndLoss(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/profit-loss/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }

  exportCompanyCashFlow(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/cashflow/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  getPortfolioCompanyInvestmentKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/investment-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCInvestmentKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/get/investment/investment-kpi-values",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPCCompanyKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/company-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyImpactKPIValues(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/impact-kpi-value/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportInvestmentKPIList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/investment-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportMasterKPIList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/portfolio-company/master-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportMasterKPIListdraft(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/workflow/master-kpi-draft-values/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportOperationalKPIListdraft(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/workflow/operational-kpi/values/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportToExcel(filter: any[], fileName: string){
   this._http.post("api/excel",filter, {responseType: 'blob'})
   .subscribe(response =>{
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
   });
  }
  exportInvestmentKPIData(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/workflow/investment-kpi/export",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportImpactKPIList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/portfolio-company/impact-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  exportCompanywiseKPIList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/pc-kpis/company-kpi/download",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  exportTradingRecordsList(filter: any) {
    return this._http
      .post(
        this.myAppUrl + "api/pc-kpis/trading-records/download",
        filter,
        { responseType: "blob", observe: "response" }
      )
      .pipe(catchError(this.errorHandler));
  }
  saveCompanyCommentaryDetails(portfolioCompanyCommentaryDetailsModel: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary/save",
        portfolioCompanyCommentaryDetailsModel
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  saveCustomCommentary(portfolioCompanyCommentaryDetailsModel: any){
    return this._http
       .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary/save/custom",
        portfolioCompanyCommentaryDetailsModel
       )
       .pipe(
        map((response) => response),
        catchError(this.errorHandler)
       );
  }
  getPortfolioCompanyCommentarySections(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary-section/get",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getPortfolioCompanyCommentarySections1(filter: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/portfolio-company/commentary-section/get/custom",
        filter
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getKPIMappingList(Id: string, type: string,moduleID:number) {
    return this._http
      .get<any>(this.myAppUrl + `api/KPI/${Id}/${type}/${moduleID}`)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getKPIUnMappingList(id: string, type: string,moduleID:number) {
    return this._http
      .get<any>(this.myAppUrl + `api/un-mapped-kpi/${id}/${type}/${moduleID}`)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  updateKPIMappingList(KpiList: any,Id: string, type: string,moduleID:number) {
    return this._http
      .post<any>(this.myAppUrl +`api/KPI/${Id}/${type}/${moduleID}`, KpiList)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }


  
  createDuplicateKPI(kpiModel:any) {
    return this._http
      .post<any>(this.myAppUrl +`api/kpi/create/duplicate`, kpiModel)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  impactsaveuploadlogs(path:any) {
    return this._http
      .post<any>(this.myAppUrl +`api/update/folder`,path)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getfiles(year:any,quater:any,company:any) {
    return this._http
      .get<any>(this.myAppUrl +`api/impactfilefiles/${company}/${year}/${quater}/0`)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
   
  }
  finalfilesuploaded(year:any,quater:any,company:any) {
    return this._http
    .get<any>(this.myAppUrl +`api/impactfilefiles/${company}/${year}/${quater}/1`)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  uploadlogos(formData:any,path:string){
    return this._http
    .post<any>(
      this.myAppUrl + "api/upload/logo",
      formData
    )
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  ondeletefinal(path:string) {
    return this._http
    .get<any>(this.myAppUrl +`api/finalremoveimpactfile/${path}`)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  onDeleteTempFiles(path:any) {
    return this._http
    .post<any>(this.myAppUrl +`api/delete/file`,path)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
 getuploadfiles(path:string){
  return this._http
  .get<any>(this.myAppUrl +`api/impactfilefiles/${path}/0`)
  .pipe(
    map((response) => response),
    catchError((error) => this.errorHandler(error))
  );
 }
 getfinaluploadfiles(path:string){
  return this._http
  .get<any>(this.myAppUrl +`api/impactfilefiles/${path}/1`)
  .pipe(
    map((response) => response),
    catchError((error) => this.errorHandler(error))
  );
 }
getfinancialsvalueTypes(){  
  return this._http
  .get<any>(this.myAppUrl +`api/portfolio-company/finacialvaluetypes`)
  .pipe(
    map((response) => response),
    catchError((error) => this.errorHandler(error))
  );
 }

 getMasterKPITabs(section:string){  
  return this._http
  .get<any>(this.myAppUrl +`api/KPITabsList/${section}`)
  .pipe(
    map((response) => response),
    catchError((error) => this.errorHandler(error))
  );
 }
 getWorkflowStatus(featureId,requestId){  
  return this._http
  .get<any>(this.myAppUrl +`api/workflowrequest/get/${featureId}/${requestId}`)
  .pipe(
    map((response) => response),
    catchError((error) => this.errorHandler(error))
  );
 }
 lpReportGraphs(companyId){    
  return this._http
    .get<any>(
      this.myAppUrl + `api/LPReportGraphData/${companyId}`)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getPortfolioCompaniesByFundId(fundIds: any[]) {
  return this._http
    .post<any>(
      this.myAppUrl + "api/portfolioCompany/getByFundId",
      {FundIds : fundIds}
    )
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
get_RegionCountrys_ByFundId(fundIds: any[]) {
  return this._http
    .post<any>(
      this.myAppUrl + "api/master/getRegionsCountrysByFundId",
      fundIds
    )
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
addCompanyGroup(group: any) {
  return this._http
    .post<any>(this.myAppUrl + "api/add/group-list", group)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
updateCompanyGroup(group: any) {
  return this._http
    .put<any>(this.myAppUrl + "api/update/group-list", group)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
updateDisplayOrder(groupList: any) {
  return this._http
    .put<any>(this.myAppUrl + "api/update/group-order", groupList)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getCompanyGroup(featureId: number) {
  return this._http
    .get<any>(this.myAppUrl + "api/get/groups/"+featureId)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
deleteCompanyGroup(groupId: number) {
  return this._http
    .delete<any>(this.myAppUrl + "api/delete/group-list/"+groupId)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getCompanyCustomList(featureId: number,fieldId:number) {
  return this._http
    .get<any>(this.myAppUrl + `api/get/pcCustomList/${featureId}/${fieldId}`)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getCompanyCustomListTypeDetails(featureId: any) {
  return this._http
    .get<any>(this.myAppUrl + `api/portfolioCompany/portfolioCompanyTypeList/${featureId}`)
    .pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
}
getCompanyKpiData(filter: any) {
  return this._http
    .post<any>(
      this.myAppUrl + "api/pc-kpis/company-kpi",
      filter
    )
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
}
getPageConfigSubSectionField() {
  return this._http
    .get<any>(
      this.myAppUrl + "api/pc-kpis/page-config"
    )
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
}
getChartsKpiData(filter: any) {
  return this._http
    .post<any>(
      this.myAppUrl + "api/portfolio-company/kpis/chart",
      filter
    )
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
}
getOperationalKpiData(filter: any) {
  return this._http
    .post<any>(
      this.myAppUrl + "api/pc-kpis/operational-kpi",
      filter
    )
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
}
exportOperationalKPIList(filter: any) {
  return this._http
    .post(
      this.myAppUrl + "api/pc-kpis/operational-kpi/download",
      filter,
      { responseType: "blob", observe: "response" }
    )
    .pipe(catchError(this.errorHandler));
}
}
