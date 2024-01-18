import { Inject, Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { throwError, BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImpliedEvService {


  private copmValues : string;
  private headers = new BehaviorSubject<any>([]);
  private unSelectedRecords = new BehaviorSubject<any>([]);
  private rawDataTradingComp = new BehaviorSubject<any>([]);
  checkBox = {
    id: "",
    checked: true
  };

  private checkBoxStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public checkBoxState$ = this.checkBoxStateSubject.asObservable();
  kpiModel = {
    kpiName: "",
    kpiId: 0,
    kpiData: []
  }
  private selectedKpi = new BehaviorSubject<{}>(this.kpiModel);
  private ColumsWithoutSector = new BehaviorSubject<any>([])
  private tab: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private refreshValuationComponent = new BehaviorSubject<boolean>(false);
  private finalImpliedEvData:any = new BehaviorSubject<any>([])

  adjustment = {
    type: 100,
    value: 0
  }
  valuationModel = {
    id: 0,
    reportId: ""
  }
  private adjustmentType = new BehaviorSubject<{}>(this.adjustment);
  private valuationIds = new BehaviorSubject<{}>(this.valuationModel);
  private internalTabSelected = new BehaviorSubject<any>([]);
  private checkBoxListCleared = new BehaviorSubject<boolean>(false);
  private equityValuation: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  myAppUrl: string = "";
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }
  setCopmValues(copmValues: any) {
    this.copmValues = JSON.stringify(copmValues);
  }
  getCopmValues() {
    return JSON.parse(this.copmValues);
  }
  setHeaders(headers: any) {
    this.headers.next(headers);
  }
  setdropdownvalues(kpiName: string, kpiId: number) {
    this.kpiModel.kpiName = kpiName;
    this.kpiModel.kpiId = kpiId;
    this.selectedKpi.next(this.kpiModel);
  }

  setKpiData(kpiData: any) {
    this.kpiModel.kpiData = kpiData;
    this.selectedKpi.next(this.kpiModel);
  }
  setUpdatedFinalImpliedEvData(finalImpliedEvData:any) {
    this.finalImpliedEvData.next(finalImpliedEvData);
 }
  setColumsWithoutSector(ColumsWithoutSector: any) {
    this.ColumsWithoutSector.next(ColumsWithoutSector);
  }

  getHeaders() {
    return this.headers.asObservable();
  }
  getUpdatedFinalImpliedEvData() {
    return this.finalImpliedEvData.asObservable();
  }
  setCheckBoxStateSubject(value: boolean) {
    this.checkBoxStateSubject.next(value);
  }

  getdropdownValues() {
    return this.selectedKpi.asObservable();
  }
  getColumsWithoutSector() {
    return this.ColumsWithoutSector.asObservable();
  }

  setTransactionTabStateSubject(tab: any) {
    this.tab.next(tab);
  }

  getTransactionSelectedTab() {
    return this.tab.asObservable();
  }

  setValuationId(id: number, reportId: string) {
    this.valuationModel.id = id;
    this.valuationModel.reportId = reportId;
    this.valuationIds.next(this.valuationModel);
  }

  getValuationId() {
    return this.valuationIds.asObservable();
  }

  setUnselectedRecords(records: any) {
    this.unSelectedRecords.next(records);
  }

  getUnselectedRecords() {
    return this.unSelectedRecords.asObservable();
  }

  setRawDataTradingComps(raw: any) {
    this.rawDataTradingComp.next(raw);
  }

  getRawDataTradingComps() {
    return this.rawDataTradingComp.asObservable();
  }

  getRefreshValuationComponent() {
    return this.refreshValuationComponent.asObservable();
  }
  setRefreshValuationComponent(value: boolean) {
    return this.refreshValuationComponent.next(value);
  }
 
  errorHandler(error: any) {
    return throwError(error);
  }

  getEmpliedEvDetails(valuationId: number, valutionReportId: string, kpiId: number) {
    return this._http.get<any>(this.myAppUrl + "api/implied-ev/get?valuationId="+ valuationId + "&kpiId=" + kpiId + "&valuationReportId=" + valutionReportId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  saveImpliedEvValue(model: any) {
    return this._http.post<any>(this.myAppUrl + "api/implied-ev/save", model)
      .pipe(map((response) => response), catchError((error) => this.errorHandler(error))
    );
  }

  getTargetKpiValue(model: any) {
    return this._http.post<any>(this.myAppUrl + "api/implied-ev/get-target-kpi-calculated-value", model).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  setInternalSelectedTabName(selectedTab: any) {
    this.internalTabSelected.next(selectedTab);
  }
  getInternalSelectedTabName() {
    return this.internalTabSelected.asObservable();
  }

  setClearCheckBoxListFlag(flag: boolean) {
    this.checkBoxListCleared.next(flag);
  }
  getClearCheckBoxListFlag() {
    return this.checkBoxListCleared.asObservable();
  }

  setEquityValuation(equityValuation: any) {
    this.equityValuation.next(equityValuation);
  }
  getsEquityValuation() {
    return this.equityValuation.asObservable();
  }
  getEquityValue = (valuationId: number, kpiId: number) => {
    return this._http.get<any>(this.myAppUrl + "api/implied-ev/equity-value/get?valuationId="+ valuationId + "&kpiId=" + kpiId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getEquityCalculation = (valuationId: number) => {
    return this._http.get<any>(this.myAppUrl + "api/implied-ev/equity-calculation/get?valuationId="+ valuationId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getEquityValuation(model: any) {
    return this._http.post<any>(this.myAppUrl + "api/implied-ev/equity-valuation/save", model).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getCompanyEquityHeaders(valuationId:number) {
    return this._http.get<any>(this.myAppUrl + "api/companyequity-header/get?valuationId="+valuationId).pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  updateCompanyEquityHeaders(model: any) {
    return this._http.post<any>(this.myAppUrl + "api/update-companyequity-header", model)
      .pipe(map((response) => response), catchError((error) => this.errorHandler(error))
    );
  }

}