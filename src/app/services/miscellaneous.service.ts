import { HttpClient, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class MiscellaneousService {
  myAppUrl: string = "";
  router: Router;
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
  }
  downloadPDFFile(response: HttpResponse<Blob>) {
    let file = new Blob([response.body], { type: "application/pdf" });
    let header = response.headers.get("Content-Disposition");
    if (header != null) {
      let fileName = header
        .split(";")[1]
        .trim()
        .split("=")[1]
        .replace('"', "")
        .replace('"', "");
      saveAs(file, fileName);
    }
  }
  GetPriviousPageUrl() {
    return localStorage.getItem("previousURL") || "";
  }
  GetPaginatorEvent(elementRef){
    setTimeout(() => {
      if(elementRef.nativeElement.getElementsByClassName('p-paginator-page') != null && elementRef.nativeElement.getElementsByClassName('p-paginator-page').length != 0)
      elementRef.nativeElement.getElementsByClassName('p-paginator-page')[0].click(); 
    }, 100);
  }
  GetLocationListByCountryId(countryId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/master/GetLocationListByCountry", {
        value: "" + countryId + "",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetLocationListByStateId(stateId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/master/GetLocationListByState", {
        value: "" + stateId + "",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getCompanySubKpiList(portfolioCompanyId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/company-subkpi/get", {
        value: portfolioCompanyId,
      })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getFinancialKpiById(kpiId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/financial-kpi/by-id", { value: kpiId })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getOperationalKpiById(kpiId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/operational-kpi/by-id", { value: kpiId })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getSectorwiseKpiById(kpiId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/sectorwise-kpi/by-id", { value: kpiId })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getInvestmentKPI(filter: { paginationFilter: any }) {
    return this._http
      .post<any>(this.myAppUrl + "api/investment-kpis/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getImpactKPI(filter: { paginationFilter: any }) {
    return this._http
      .post<any>(this.myAppUrl + "api/impact-kpis/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getCompanyKpiById(kpiId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/company-kpi/by-id", { value: kpiId })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  saveKPI(kpiModel: any) {
    return this._http.post<any>(this.myAppUrl + "api/kpi/save", kpiModel).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }
  getFinancialKPIs(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/financial-kpis/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getOperationalKPIs() {
    return this._http
      .get<any>(this.myAppUrl + "api/operational-kpis/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getSectorwiseKPIs(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/sectorwise-kpis/get", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getCompanyKPIs() {
    return this._http
      .get<any>(this.myAppUrl + "api/company-kpis/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  exportFinancialKpiList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/financial-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  exportOperationalKpiList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/operational-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  exportSectorwiseKpiList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/sectorwise-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  exportCompanyKpiList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/company-kpi/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }
  getCountryListByRegionId(regionId: string) {
    return this._http
      .post<any>(this.myAppUrl + "api/master/GetCountryListByRegionId", {
        value: "" + regionId + "",
      })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getCountryListByRegionIds(regionIds: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/master/GetCountryListByRegionIds",
        regionIds
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getCountryList() {
    return this._http
      .get<any>(this.myAppUrl + "api/master/GetAllCountries")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getRegionList() {
    return this._http.get<any>(this.myAppUrl + "api/master/regionlist").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getSectorList() {
    return this._http.get<any>(this.myAppUrl + "api/master/GetAllSectors").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  getMethodologies() {
    return this._http.get<any>(this.myAppUrl + "api/get-methodology").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  /**
   * Retrieves the methodologies by group.
   * @returns An Observable that emits the response containing the methodologies grouped by module.
   */
  getMethodologiesByGroup() {
    return this._http.get<any>(this.myAppUrl + "api/kpi/module-group").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  getBulkModules() {
    return this._http.get<any>(this.myAppUrl + "api/get-bulkUpload-modules").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getSubSectorListBySectorId(sectorId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/master/subsectorbyid", {
        value: sectorId,
      })
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getDesignationList() {
    return this._http
      .get<any>(this.myAppUrl + "api/master/designations/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getDealBoardSeatList() {
    return this._http.get<any>(this.myAppUrl + "api/DealBoardSeat/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getDealExitMethodList() {
    return this._http.get<any>(this.myAppUrl + "api/DealExitMethod/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getDealInvestmentStageList() {
    return this._http
      .get<any>(this.myAppUrl + "api/DealInvestmentStage/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getDealSecurityTypeList() {
    return this._http.get<any>(this.myAppUrl + "api/DealSecurityType/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getDealSourcingList() {
    return this._http.get<any>(this.myAppUrl + "api/DealSourcing/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getDealTransactionRoleList() {
    return this._http
      .get<any>(this.myAppUrl + "api/DealTransactionRole/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getDealValuationMethodologyList() {
    return this._http
      .get<any>(this.myAppUrl + "api/DealValuationMethodology/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getStrategyList() {
    return this._http.get<any>(this.myAppUrl + "api/Strategies/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getStatusList() {
    return this._http.get<any>(this.myAppUrl + "api/pipeline-status/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  getGroupList() {
    return this._http.get<any>(this.myAppUrl + "api/master/groups/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getCurrencyList() {
    return this._http.get<any>(this.myAppUrl + "api/Currency/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getAccountTypeList() {
    return this._http.get<any>(this.myAppUrl + "api/AccountTypes/get").pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  getPortfolioCompanyEmployeesList() {
    return this._http
      .get<any>(this.myAppUrl + "api/PortfolioCompanyEmployees/get")
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  downloadExcelFile(response: HttpResponse<Blob>) {
    if (response.body != null) {
      let file = new Blob([response.body], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let header = response.headers.get("Content-Disposition");
      if (header != null) {
        let fileName = header
          .split(";")[1]
          .trim()
          .split("=")[1]
          .replace('"', "")
          .replace('"', "");
        saveAs(file, fileName);
      }
    }
  }
  downloadZIPFile(response: HttpResponse<Blob>) {
    let file = new Blob([response.body], { type: "application/zip" });
    let header = response.headers.get("Content-Disposition");
    if (header != null) {
      let fileName = header
        .split(";")[1]
        .trim()
        .split("=")[1]
        .replace('"', "")
        .replace('"', "");
      saveAs(file, fileName);
    }
  }

  GetCompanywiseOperationalKPIList(portFolioCompanyID: any) {
    return this._http
      .post<any>(
        this.myAppUrl +
          "api/master/GetCompanyWiseOperationalKPIList?portFolioCompanyID=" +
          portFolioCompanyID,
        ""
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetFinancialKPIList() {
    return this._http
      .get<any>(this.myAppUrl + "api/master/GetFinancialKPIList")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetCompanyOrInvestmentKPIList(KPIQueryModel: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/master/getKPIList-by-portfoliocompanyIds-kpiType",
        KPIQueryModel
      )
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  getMessageTimeSpan() {
    return 5000;
  }
  showAlertMessages(errorType: string, message: string) {
    let msgs = [];
    let errorTitle;
    switch (errorType) {
      case "error":
        errorTitle = "Error";
        break;
      case "success":
        errorTitle = "Success";
        break;
      case "info":
        errorTitle = "Information";
        break;
      case "warn":
        errorTitle = "Information";
        break;
      case "":
        errorTitle = "Success";
        break;
    }

    msgs.push({
      severity: errorType,
      summary: errorTitle,
      detail: message,
      life: 10000,
    });
    return msgs;
  }

  showInlineMessage(messageService: any, errorType: string, message: string) {
    let errorTitle;
    switch (errorType) {
      case "error":
        errorTitle = message == "" ? "Error" : "";
        break;
      case "success":
        errorTitle = "";
        break;
      case "info":
        errorTitle = "Information";
        break;
      case "warn":
        errorTitle = "Warning";
        break;
      case "":
        errorTitle = "Success";
        break;
    }
    messageService.clear();
    messageService.add({
      severity: errorType,
      summary: errorTitle,
      detail: message,
    });
  }

  showAlertMessagesNew(
    errorType: string,
    message: string,
    messageService: any
  ) {
    let errorTitle;
    switch (errorType) {
      case "error":
        errorTitle = "Error";
        break;
      case "success":
        errorTitle = "Success";
        break;
      case "info":
        errorTitle = "Information";
        break;
      case "warn":
        errorTitle = "Information";
        break;
      case "":
        errorTitle = "Success";
        break;
    }

    messageService.add({
      severity: errorType,
      summary: errorTitle,
      detail: message,
      life: 10000,
    });
    return messageService;
  }

  getPagerLength() {
    return [10, 25, 50, 100];
  }
  getSmallPagerLength() {
    return [10, 25, 50];
  }

  GetDynamicQueriesList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/query/dynamic-queries", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  getQueryById(DynamicQueryID: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/query/dynamic-queries", DynamicQueryID)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  AddUpdateQuery(QueryDetail: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/query/addQuery", QueryDetail)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  saveFundTrackRecord(fundTrackRecord: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/queries/SaveFundTrackRecord",
        fundTrackRecord
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  exportEditorQueryList(query: any) {
    return this._http
      .post(this.myAppUrl + "api/query/exportQueryData", query, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportQueries(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/query/exportQueries", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  getDynamicQueriesPreview(query: any): Observable<any> {
    return this._http
      .post<any>(this.myAppUrl + "api/query/querypreview", query)
      .pipe(
        map((response: any) => response),
        catchError(this.errorHandler)
      );
  }
  getJSON(file: any): Observable<any> {
    return this._http.get(file).pipe(
      map((response: any) => response),
      catchError(this.errorHandler)
    );
  }
  redirectToLogin(error: any) {
    if (error.status == 401 || error.status == 403) {
      this.router.navigate(["/login"]);
    }
  }

  bindYearList() {
    let years = [];
    let max = new Date().getFullYear();
    let min = max - 20;

    for (let y = max; y >= min; y--) {
      years.push({ value: y.toString(), text: y.toString() });
    }
    return years;
  }
  bindPrevAndNextYearList() {
    let years = [];
    let max = new Date().getFullYear() + 5;
    let min = new Date().getFullYear() - 20;

    for (let y = max; y >= min; y--) {
      years.push({ value: y.toString(), text: y.toString() });
    }
    return years;
  }
  formatDate(date: any) {  

    date = new Date(date);

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return ("0" + (monthIndex + 1)).slice(-2) + "/" + day + "/" + year;
  }

  _window(): any {
    return window;
  }

  get nativeWindow(): any {
    return this._window();
  }

  sortArray(array: any[], key: any) {
    try {
      return array.sort(function (a: any, b: any) {
        let val1 = a[key];
        if (val1 != null) {
          val1 = val1.toString().toLowerCase();
        }
        let val2 = b[key];
        if (val2 != null) {
          val2 = val2.toString().toLowerCase();
        }

        if (val1 < val2) return -1;
        if (val1 > val2) return 1;
        return 0;
      });
    } catch {
      return [];
    }
  }

  sortArrayDesc(array: any[], key: any) {
    return array.sort(function (a: any, b: any) {
      let val1 = a[key];
      if (val1 != null) {
        val1 = val1.toString().toLowerCase();
      }
      let val2 = b[key];
      if (val2 != null) {
        val2 = val2.toString().toLowerCase();
      }

      if (val1 < val2) return 1;
      if (val1 > val2) return -1;
      return 0;
    });
  }

  removeDuplicates(arr:any[]) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
  }

  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  checkIfStringIsIneger(num: string) {
    if (num != null) {
      if (String(num).match(/^-{0,1}\d+$/)) {
        return true;
      }
    }
    return false;
  }

  checkIfStringIsFloat(num: string) {
    if (num != null) {
      if (
        num.toString().trim().indexOf("-") > -1 &&
        num.toString().trim().indexOf("-") != 0
      ) {
        return false;
      }

      let parsedVal = parseFloat(num);
      if (!isNaN(parsedVal)) {
        return true;
      }
    }
    return false;
  }
  formatNumbertoString(num: string) {
    if (num != null) {
      if (this.checkIfStringIsIneger(num)) {
        num = parseInt(num).toLocaleString("en-us");
      } else if (this.checkIfStringIsFloat(num)) {
        let suffix = "";
        if (num.toString().endsWith("x")) {
          suffix = "x";
        }
        let value = Number(num);
        if (!Number.isNaN(value) && (value >= 1 || value <= 1) && value != 0) {
          num = parseFloat(num).toLocaleString("en-us", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          num = num + suffix;
        }
      }
    }
    return num;
  }
  formatNumber(num: string) {
    if (num != null) {
      if (this.checkIfStringIsIneger(num)) {
        num = parseInt(num).toLocaleString("en-us");
      } else if (this.checkIfStringIsFloat(num)) {
        let suffix = "";
        if (num.toString().endsWith("x")) {
          suffix = "x";
          num = parseFloat(num).toLocaleString("en-us", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          });
        }else{
          num = parseFloat(num).toLocaleString("en-us", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
          });
        }
        
        num = num + suffix;
      }
    }
    return num;
  }

  formatFloatNumber(num: string) {
    if (num != null) {
      if (this.checkIfStringIsFloat(num)) {
        if (String(num).match(/^[-+]?\d*\.?\d+$/)) {
          num = parseFloat(num).toLocaleString("en-us", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
        }
      }
    }
    return num;
  }

  getAlignmentClass(num: string) {
    if (num != null) {
      num = num.toString().trim();
      if (this.checkIfStringIsIneger(num)) {
        return "table-data-right";
      } else if (this.checkIfStringIsFloat(num)) {
        return "table-data-right";
      }
    }
    return "";
  }

  getMax(array: any[], maxBy: string) {
    const max = array.reduce(function (prev, current) {
      return prev[maxBy] > current[maxBy] ? prev : current;
    });
    return max;
  }

  getQuarter(date: Date) {
    return (date.getUTCMonth() + 3) / 3;
  }

  getQuarterLastDateByQuarter(quarter: any, year: any) {
   
    let endMonth = 0;
    let endDay = 31;

    switch (quarter) {
      case "Q1":
      
        endMonth = 3;
        break;

      case "Q2":
     
        endMonth = 6;
        endDay = 30;
        break;

      case "Q3":
      
        endMonth = 9;
        endDay = 30;
        break;

      case "Q4":
       
        endMonth = 12;
        break;
    }

    return new Date(year, endMonth - 1, endDay);
  }
  getQuarterList()
  {
    return  [
      { value: "Q1", text: "Q1", number: 1 },
      { value: "Q2", text: "Q2", number: 2 },
      { value: "Q3", text: "Q3", number: 3 },
      { value: "Q4", text: "Q4", number: 4 },
    ];
  }

  getQuarterLastDate(date: Date) {
    let quarter = "Q" + Math.floor(this.getQuarter(date));
    let year = date.getUTCFullYear();
    let endMonth = 0;
    let endDay = 31;

    switch (quarter) {
      case "Q1":
        endMonth = 3;
        break;

      case "Q2":
        endMonth = 6;
        endDay = 30;
        break;

      case "Q3":
        endMonth = 9;
        endDay = 30;
        break;

      case "Q4":
        endMonth = 12;
        break;
    }

    return new Date(year, endMonth - 1, endDay);
  }

  getDatePart(date: Date) {
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    return new Date(year, monthIndex, day);
  }
  getMonthName(monthValue: number) {
    let monthName: any;
    switch (monthValue) {
      case 1:
        monthName = "Jan";
        break;
      case 2:
        monthName = "Feb";
        break;
      case 3:
        monthName = "Mar";
        break;
      case 4:
        monthName = "Apr";
        break;
      case 5:
        monthName = "May";
        break;
      case 6:
        monthName = "Jun";
        break;
      case 7:
        monthName = "Jul";
        break;
      case 8:
        monthName = "Aug";
        break;
      case 9:
        monthName = "Sep";
        break;
      case 10:
        monthName = "Oct";
        break;
      case 11:
        monthName = "Nov";
        break;
      case 12:
        monthName = "Dec";
        break;
    }
    return monthName;
  }
  getMonthNumber(monthName: string) {
    let monthValue: any;
    switch (monthName) {
      case "Jan":
        monthValue = "1";
        break;
      case "Feb":
        monthValue = "2";
        break;
      case "Mar":
        monthValue = "3";
        break;
      case "Apr":
        monthValue = "4";
        break;
      case "May":
        monthValue = "5";
        break;
      case "Jun":
        monthValue = "6";
        break;
      case "Jul":
        monthValue = "7";
        break;
      case "Aug":
        monthValue = "8";
        break;
      case "Sep":
        monthValue = "9";
        break;
      case "Oct":
        monthValue = "10";
        break;
      case "Nov":
        monthValue = "11";
        break;
      case "Dec":
        monthValue = "12";
        break;
    }
    return monthValue;
  }
  getValuesPreferenceList()
  {
    return [
      {
        typeId: FinancialValueUnitsEnum.Absolute,
        unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
      },
      {
        typeId: FinancialValueUnitsEnum.Thousands,
        unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
      },
      {
        typeId: FinancialValueUnitsEnum.Millions,
        unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
      },
      {
        typeId: FinancialValueUnitsEnum.Billions,
        unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Billions],
      },
    ];
  }
  getPortfolioCompanyList(filter: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/portfolioCompany/getCompanyNames", filter)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  bindMonthList() {
    let months = [];

    months.push({ value: "Jan", text: "January", number: 1 });
    months.push({ value: "Feb", text: "February", number: 2 });
    months.push({ value: "Mar", text: "March", number: 3 });
    months.push({ value: "Apr", text: "April", number: 4 });
    months.push({ value: "May", text: "May", number: 5 });
    months.push({ value: "Jun", text: "June", number: 6 });
    months.push({ value: "Jul", text: "July", number: 7 });
    months.push({ value: "Aug", text: "August", number: 8 });
    months.push({ value: "Sep", text: "September", number: 9 });
    months.push({ value: "Oct", text: "October", number: 10 });
    months.push({ value: "Nov", text: "November", number: 11 });
    months.push({ value: "Dec", text: "December", number: 12 });
    return months;
  }
  getKPIListByPCIdsKPIType(model: any) {
    return this._http
      .post<any>(
        this.myAppUrl + "api/master/getKPIList-by-portfoliocompanyIds-kpiType",
        model
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getDateRangeForDataExtractionReport(model: any) {
    return this._http
      .post(
        this.myAppUrl + "api/report/getDateRangeForDataExtractionReport",
        model,
        { observe: "response" }
      )
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  exportFinancialReport(model: any) {
    return this._http
      .post(this.myAppUrl + "api/report/exportFinancialReport", model, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError(this.errorHandler));
  }

  exportBalanceSheetList() {
    return this._http
    .post<any>(this.myAppUrl + "api/balanceSheet-kpis/get", {})
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  exportProfitLossList() {
    return this._http
    .post<any>(this.myAppUrl + "api/profitLoss-kpis/get", {})
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

  exportCashflowList() {
    return this._http
    .post<any>(this.myAppUrl + "api/cashflow-kpis/get", {})
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  exportESGList(subPageId:number) {
    return this._http
    .get<any>(this.myAppUrl + "api/esg/get/"+subPageId, {})
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  exportMasterKPIList(id) {
    return this._http
    .post<any>(this.myAppUrl + `api/master-kpis/get/${id}`, {})
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  AddNewKpi(newKpi) {
    return this._http
    .post<any>(this.myAppUrl + "api/AddOrUpdateKPI", newKpi)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  AddNewESGKpi(newKpi) {
    return this._http
    .post<any>(this.myAppUrl + "api/esg/addupdate", newKpi)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }
  MasterAddNewKpi(newKpi) {
    return this._http
    .post<any>(this.myAppUrl + "api/AddUpdateKPI", newKpi)
    .pipe(
      map((response) => response),
      catchError((error) => this.errorHandler(error))
    );
  }

 /**
 * Soft delete KPI from DB.
 * @param object which contain KPIId, ModuleId and KpiType
 * @return - Custom Message from API
 */
  softDeleteKPI(deletKpi) {
    return this._http
      .post<any>(`${this.myAppUrl}api/kpi/delete`,deletKpi)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  getTitle(title:any){
    document.getElementById("HeaderNameID").textContent=title;
    document.getElementById("HeaderNameID").title=title;
  }
  getSideBarWidth()
  {
    let element = document.getElementById("mat-sidenav-id") as HTMLElement;
    return element.style.width;
  }
  
}
export enum ErrorMessage {
  SomethingWentWrong = "Something went wrong. Please try again.",
  KPINameExceed = "KPI Name should not exceed 200 character limit",
  DescriptionExceed = " KPI description should not exceed 1000 character limit",
  KPINameandDescriptionExceed = "KPI name and description should not exceed 200 and 1000 character limit respectively",
  PasswordChangeSuccessfully = "Your password has been changed. Please login again with new password.",
  IncorrectUserNamePassword = "Username or password is incorrect",
  SelectFund = "Please select fund",
  SelectCountry = "Please select country",
  SelectFileToUpload = "Error :- No file selected. Please select a file.",
  FileUploadSuccess = "File uploaded successfully",
  SeeErrorList = "Please see the error list",
  CommentHere = "Please Comment Here...",
  ValuationDateShouldBeGreaterThanInvestmentDate = "Valuation date should not be less than investment date.",
  ValuationDateShouldBeLessThanCurrentQtrLastDate = "Valuation date should not be greater than current quarter's last date.",
  SelectValidYearAndQtrLessThanInvestmentDate = "Please select valid year and quarter later than investment date.",
  YearAndQtrPairExistForDeal = "The year and quarter pair already exist for this deal",
  AreYouSureYouWantToDelete = "Are you sure that you want to delete this record?",
  SelectRequiredFields = "Please select the required fields",
  EmployeeWithSameEmailAlreadyAdded = "Employee with the same email id is already added in the list",
  SelectedQtrLessThanCurrentQtr = "Selected quarter should not be greater than current quarter",
  SelectedMnthLessThanCurrentMonth = "Selected month should not be greater than current month",
  HeadQtrAlreadySelectedForFirm = "You have already selected the headquarter location for the firm",
  SameLocationIsAlreadyAddedForFirm = "Same location is already added for the firm",
  SelectGeographicLocationForFirm = "Please select geographic location for the firm",
  SelectValidYearAndQtr = "Please select valid year and quarter",
  SelectValidYearAndMonth = "Please select valid year and month",
  YearAndQtrPairExistForFund = "The year and quarter pair already exist for this fund",
  AreYouSureYouWantToDeleteWithName = "Are you sure that you want to remove <b>[username]</b> from the group?",
  HeadQtrAlreadySelectedForCompany = "You have already selected the headquarter location for the portfolio company",
  SameLocationIsAlreadyAddedForCompany = "Same location is already added for the portfolio company",
  SelectGeographicLocationForCompany = "Please select geographic location for the portfolio company",
  AreYouSureYouWantToRemoveKpi = "Are you sure that you want to remove this KPI value for the selected month?",
  AreYouSureYouWantToRemoveCompanyKpi = "Are you sure that you want to remove Company KPI value for the selected month?",
  AreYouSureYouWantToRemoveImpactKpi = "Are you sure that you want to remove Impact KPI value?",
  AreYouSureYouWantToRemoveInvestmentKpi = "Are you sure that you want to remove Investment KPI value for the selected quarter?",
  AreYouSureYouWantToRemoveTradingRecord = "Are you sure that you want to remove Trading Record value for the selected year?",
  InBetweenEditingKPIValues = "You are in between editing a KPI value. So please complete editing that row then try again.",
  AddKPIForThisQtr = "Please click Add KPI value and then click Create",
  AddKPIForThisMonth = "Please add a KPI first",
  KPIValueExistForThisYearAndQtr = "The KPI values already exist for this year and quarter pair",
  KPIValueExistForThisYearAndMonth = "The KPI values already exist for this year and month pair",
  AnotherKPIValueRowOpenInEditMode = "There is another KPI value row in edit mode. So please complete editing that row then try again.",
  YearAndQtrPairExistForCompany = "The year and quarter pair already exist for this portfolio company",
  YearAndMonthPairExistForCompany = "The year and month pair already exist for this portfolio company",
  QueryAddedSuccessfully = "Query added successfully",
  SomethingWentWrongQuery = "Error :- Something went wrong. Please recheck the query and try again.",
  EditorShouldNotHaveMultipleQuery = " check editor should not have multiple queries.",
  EmptyQueryEditor = "Error :- Query editor is empty, please enter a query.",
  OnlySelectQueryCanbeExecuted = "Error :- Only select query can be executed, please enter a select query.",
  InvalidCharactersInQuery = "Error :- Query contain some invalid keywords, please check the query and try again.",
  DoYouWantToResetTheUserPassword = "Do you want to reset the password for <b>[username]</b> ?",
  ParentChildKPISame = "Parent KPI and child KPI can not be same",
  StartDateLessThanEndDate = "Start date should be smaller than end date",
  MandatoryMessage = "Fields are mandatory",
  NoRecordFoundMessage = "No data found",
  DuplicateHeadersNotAllowed = "Duplicate headers are not allowed. Data is already available for this period",
  SelectAtleastOneKpi = "Please select atleast one KPI from dropdown",
  NoDataAvailableForCompanyKPIType = "No data available for the selected portfolio company and KPI Type combo",
}
export enum FinancialValueUnitsEnum {
  Absolute = 0,
  Thousands = 1,
  Millions = 2,
  Billions = 3,
}
export enum ExportTypeEnum {
  Key = 1,
  Details = 2,
}
export enum OrderTypesEnum {
  LatestOnLeft = "Latest on Left",
  LatestOnRight = "Latest on Right",
}
export enum PeriodTypeQuarterEnum {
  Last1Year = "1 YR (Last 1 year)",
  CurrentQuarter = "Current Quarter",
  LastQuarter = "Last Quarter",
  DateRange = "Date Range",
}
export enum DecimalDigitEnum {
  Zero = "0",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
}
export enum PeriodTypeEnum {
  Last1Year = "1 YR (Last 1 year)",
  Last6Month = "6M (Last 6 months)",
  Last3Month = "3M (Last 3 months)",
  Last3Years = "3 YR (Last 3 years)",
  Last5Years = "5 YR (Last 5 years)",
  Last10Years = "10 YR (Last 10 years)",
  YearToDate = "YTD (Year to Date)",
  DateRange = "Date Range",
  Custom = "Custom",
}

export enum PeriodTypeFilterEnum {
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  SemiAnnual = "Semi Annual",
  YTD = "YTD (Year to Date)",
  Annual = "Yearly",
  LTM = "LTM (Last Twelve Months)",
}
export enum FxRates {
  SystemAPI = 0,
  BulkUpload = 1
 
}

export enum SubTabsDetails {
  Actual = "Actual",
  Budget = "Budget" 
}
export enum AdhocPeriodType{
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Annual = "Yearly"
}
export enum InvestorSections{
  InvestedFunds ="Invested Funds",
  InvestorFundDetails = "Investor Fund Details",
  CompanyPerformance = "Company Performance",
  InvestorCompanyDetails = "Investor Company Details",
  ValuationData = "Valuation Data"
}
export enum PeriodType {
  Monthly = 1000,
  Quarterly = 1001,
  Annually = 1002,
  YTD = 1003
}
export enum InvestorSectionsIds{
  InvestedFunds = 15,
  InvestorFundDetails = 9,
  CompanyPerformance = 17,
  InvestorCompanyDetails = 6,
  ValuationData = 18
}