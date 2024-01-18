import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Message } from "primeng/api/message";
import { CashflowService } from "../../services/cashflow.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { GeFundCashflowHeaders, GeFundPerformanceReportingHeaders, GeFundCashflowReportingCurrencyTableHeaders, GetFundcashflowTypes, FundCashflowConstants, GeFundPerformanceHeaders, NumberDecimalConst } from "src/app/common/constants";
@Component({
  selector: "cashflow",
  templateUrl: "./cashflow.component.html",
  styleUrls: ["./cashflow.component.scss"],
})
export class CashflowComponent {
  feature: typeof FeaturesEnum = FeaturesEnum;
  progress: number;
  message: string;
  msgTimeSpan: number;
  fileUploadSubscription: any;
  cashflowData: any = [];
  cashflowCalculationData: any = [];
  currentQuarter: string = "";
  realizeData: any = [];
  unRealizeData: any = [];
  realizeReportingCFData: any = [];
  unRealizeReportingCFData: any = [];
  othersReportingCFData: any = [];
  cashflowFileId: any;
  showUploadSection: boolean = true;
  msgs: Message[] = [];
  loading: boolean;
  totalRecords: number;
  cancel: boolean = false;
  enableSaveButton: any = true;
  messageClass: string = "bulkMessage";
  safeHtml: SafeHtml;
  uploadedFiles: any[] = [];
  value: number = 0;
  fundList: any[] = [];
  selectedFund: any;
  isOverwriteHoldings: boolean = false;
  fundHoldingUpdateDetails: any;
  fundName: any;
  frozenCols: any = [
    { field: FundCashflowConstants.Name, header: FundCashflowConstants.CompanyName }
  ];
  frozenRows: any = [];
  fundData: any = {};
  realizedColIndex = 0;
  unrealizedColIndex = 0;
  realizeList: any = [];
  unrealizedList: any = [];
  othersList: any = [];
  objCashFlowList: any = [];
  objReportingCashFlowList: any = [];
  tabList = [{ name: FundCashflowConstants.FundCurrency, active: true, field: FundCashflowConstants.FundCashflow },
  { name: FundCashflowConstants.ReportingCurrency, active: false, field: FundCashflowConstants.FundCashflow }];
  fundPerformancetabList = [{ name: FundCashflowConstants.FundCurrency, active: true, field: FundCashflowConstants.FundPerformance} ,
    { name: FundCashflowConstants.ReportingCurrency, active: false, field: FundCashflowConstants.FundPerformance },
  ];
  tabName = FundCashflowConstants.FundCurrency;
  tabNameFP = FundCashflowConstants.FundCurrency;
  FundCashflowData: any = [];
  FundReportingCashflowData: any = [];
  fundcashflowTypes = GetFundcashflowTypes();
  selectedFundcashflowType = { name: FundCashflowConstants.All };
  fundCashflowRecords: any = [];
  fundCurrency: string = "";
  reportingCurrency: string = "";
  isCfFundCurrency: boolean = true;
  isLoading: boolean = true;
  FcData: any;
  fundPerformanceData: any = [];
  fundPerformanceReportingData : any = [];
  fundPerformanceReportingCols : any = [];
  fcReportingData = [];
  fundPerformanceReportingTempData = [];
  NumberDecimalConst = NumberDecimalConst;
  pageConfigTransactionTypes=[];
  constructor(
    private _avRoute: ActivatedRoute,
    private miscService: MiscellaneousService,
    private cashflowService: CashflowService,
    private toastrService: ToastrService
  ) {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    if (this._avRoute.snapshot.params["id"]) {
      this.cashflowFileId = this._avRoute.snapshot.params["id"];
    }
  }

  checkIfValidDate(date: any) {
    return moment(date, "MM/DD/YYYY", true).isValid();
  }

  ngOnInit() {
    if (this.cashflowFileId != undefined) {
      let cashFlowByIdData = {
        cashFlowId: this.cashflowFileId,
        pageName: "List",
      };
      this.getData(cashFlowByIdData);
      this.getPageConfigTransactionTypes();
    }
  }
  getPageConfigTransactionTypes() {
    this.cashflowService.getCashFlowPageConfigTransactionTypes().subscribe((result) => {
      if (result.length > 0) {
        this.pageConfigTransactionTypes = result;
      } else {
        this.pageConfigTransactionTypes = [];
      }
    });
  }
  isFundPerformance:boolean=false;
  isFundCashFlow:boolean=false;
  CashflowDataExport(cols:any,results:any,selection:string,currency:string) {
    this.loading = true;
    let exportData = {
      exportCol: cols,
      exportVal: results,
      fundName: this.fundName,
      selection:selection,
      currency:currency
    };
    this.cashflowService.newExportCashflowData(exportData).subscribe({
      next:(response) => {
        this.miscService.downloadExcelFile(response);
        this.isFundPerformance = false;
        this.isFundCashFlow = false
      },
      error:(error) => {
        this.toastrService.error(error, "", { positionClass: "toast-center-center" });
        this.loading = false;
        this.isFundPerformance = false;
        this.isFundCashFlow = false
      }
  });
  }
 
  getData(fileId: any) {
    let expenseTotal = 0;
    this.cashflowService.getCashFlowDeatils(fileId).subscribe({
      next:(result) => {
        let resp = result["body"];
        let local = this;
        let objCashFlowRealizeList: any = [];
        let objCashFlowUnRealizeList: any = [];
        objCashFlowRealizeList.Results = [];
        objCashFlowUnRealizeList.Results = [];
        if (resp != null && result.code == "OK") {
          this.FcData = resp;
          //Load fund cashflow table
          this.getFundCashflowDetails(fileId);
          //Load fund performance table
          this.getFundPerformanceDetails(fileId);
          this.cashflowData = resp.cashflowDateWiseSummary;
          this.fundName = resp.fund.fundName;
          localStorage.setItem("headerName", this.fundName); 

          objCashFlowRealizeList.cols = [];
          objCashFlowUnRealizeList.cols = [];

          this.cashflowData.forEach(function (data: any, index: any) {
            let objCashFlowRealize: any = {};
            let objCashFlowUnRealize: any = {};

            objCashFlowRealize[FundCashflowConstants.Date] = objCashFlowUnRealize[
              FundCashflowConstants.Date
            ] = local.miscService.formatDate(data.transactionDate);
            objCashFlowRealize[FundCashflowConstants.TransactionType] = data.transactionType;

            data.cashFlowCompanyList.forEach(function (comp: any) {
              if (comp.isRealizedValue) {
                objCashFlowRealize[comp.portfolioCompanyName] =
                  comp.transactionValue;
                let list = objCashFlowRealizeList.cols.filter(function (
                  val: any
                ) {
                  return val.field == comp.portfolioCompanyName;
                });
                if (list == null || list.length == 0) {
                  objCashFlowRealizeList.cols.push({
                    field: comp.portfolioCompanyName,
                    header: comp.portfolioCompanyName,
                  });
                }
              }

              if (!comp.isRealizedValue) {
                let blankHeader = null;
                if (objCashFlowRealizeList.cols.length > 0) {
                  blankHeader = objCashFlowRealizeList.cols.filter(function (
                    colValue: any
                  ) {
                    return colValue.field == "";
                  });
                }
                if (blankHeader == null || blankHeader.length == 0) {
                  objCashFlowRealizeList.cols.push({ field: "", header: "" });
                }

                if (
                  objCashFlowRealize[comp.portfolioCompanyName + " "] ==
                  undefined
                ) {
                  objCashFlowRealize[comp.portfolioCompanyName + " "] =
                    comp.transactionValue;
                };
                let list = objCashFlowRealizeList.cols.filter(function (
                  val: any
                ) {
                  return val.field == comp.portfolioCompanyName + " ";
                });
                if (list == null || list.length == 0) {
                  objCashFlowRealizeList.cols.push({
                    field: comp.portfolioCompanyName + " ",
                    header: comp.portfolioCompanyName + " ",
                  });
                }
              }
            });

            objCashFlowRealize["Total Realized"] = data.totalRealizeValue;
            objCashFlowRealize["Total Unrealized"] = data.totalUnrealizeValue;
            objCashFlowRealize["Total"] = data.totalRealizeUnrealizeValue;
            objCashFlowRealize["Total Fees / Expenses"] = data.totalFundFees;
            if(data.totalFundFees != null){
              let val = data.totalFundFees < 0 ? (data.totalFundFees) * (-1) : data.totalFundFees;
              expenseTotal = expenseTotal + parseFloat(val);
            }
            objCashFlowRealize["Total Less Fund Expenses/Fees"] =
              data.totalRealizeUnrealizeAndFundFeesValue;

            objCashFlowRealizeList.Results.push(objCashFlowRealize);
          });

          let separatorIndex = -1;
          objCashFlowRealizeList.cols.forEach(function (val: any, i: any) {
            if (val.field == "") {
              separatorIndex = i;
            }
          });
          if (separatorIndex == -1) {
            objCashFlowRealizeList.cols.splice(
              objCashFlowRealizeList.cols.length,
              0,
              { field: "Total Realized", header: "Total Realized" }
            );
          } else if (separatorIndex > 1) {
            objCashFlowRealizeList.cols.splice(separatorIndex, 0, {
              field: "Total Realized",
              header: "Total Realized",
            });
          }
          if (separatorIndex > -1) {
            objCashFlowRealizeList.cols.push({
              field: "Total Unrealized",
              header: "Total Unrealized",
            });
          }
          objCashFlowRealizeList.cols.push({ field: "", header: "" });
          objCashFlowRealizeList.cols.push({ field: "Total", header: "Total" });
          objCashFlowRealizeList.cols.push({
            field: "Total Fees / Expenses",
            header: "Total Fees / Expenses",
          });
          objCashFlowRealizeList.cols.push({
            field: "Total Less Fund Expenses/Fees",
            header: "Total Less Fund Expenses/Fees",
          });

          let calulationModel = resp.cashflowCalculationDetails;
          let objCashFlowCapitalInvested: any = {};
          let objCashFlowRealized: any = {};
          let objCashFlowUnrealized: any = {};
          let objCashFlowTotal: any = {};
          let objCashFlowIRR: any = {};
          let objCashFlowMultiple: any = {};

          calulationModel.forEach(function (value: any) {
            objCashFlowCapitalInvested[FundCashflowConstants.Date] = FundCashflowConstants.CapitalInvested;

            if (value.isRealizedValue) {
              objCashFlowCapitalInvested[value.portfolioCompanyName] =
                value.capitalInvested;
            } else {
              objCashFlowCapitalInvested[value.portfolioCompanyName + " "] =
                value.capitalInvested;
            }

            objCashFlowRealized[FundCashflowConstants.Date] = "Realized Value";

            if (value.isRealizedValue) {
              objCashFlowRealized[value.portfolioCompanyName] =
                value.realizedValue;
            } else {
              objCashFlowRealized[value.portfolioCompanyName + " "] =
                value.realizedValue;
            }

            objCashFlowUnrealized[FundCashflowConstants.Date] = "Unrealized Value";

            if (value.isRealizedValue) {
              objCashFlowUnrealized[value.portfolioCompanyName] =
                value.unrealizedValue;
            } else {
              objCashFlowUnrealized[value.portfolioCompanyName + " "] =
                value.unrealizedValue;
            }

            objCashFlowTotal[FundCashflowConstants.Date] = "Total Value";

            if (value.isRealizedValue) {
              objCashFlowTotal[value.portfolioCompanyName] = value.totalValue;
            } else {
              objCashFlowTotal[value.portfolioCompanyName + " "] =
                value.totalValue;
            }

            objCashFlowIRR[FundCashflowConstants.Date] = FundCashflowConstants.IRR;

            if (value.isRealizedValue) {
              objCashFlowIRR[value.portfolioCompanyName] =
              local.miscService.formatFloatNumber(value.irr) + "%"; 
            } else {
              objCashFlowIRR[value.portfolioCompanyName + " "] =
              local.miscService.formatFloatNumber(value.irr) + "%";
            }

            objCashFlowMultiple[FundCashflowConstants.Date] = FundCashflowConstants.TVPI;

            if (value.isRealizedValue) {
              objCashFlowMultiple[value.portfolioCompanyName] = value.multiple;
            } else {
              objCashFlowMultiple[value.portfolioCompanyName + " "] =
                value.multiple;
            }
          });

          let totalCalulationModel = resp.totalCalculationDetails;

          objCashFlowRealized["Total Realized"] = 0;

          objCashFlowRealized["Total Unrealized"] = 0;

          objCashFlowUnrealized["Total Realized"] = 0;

          objCashFlowUnrealized["Total Unrealized"] = 0;

          objCashFlowTotal["Total Realized"] = 0;

          objCashFlowTotal["Total Unrealized"] = 0;

          objCashFlowIRR["Total Realized"] = 0;

          objCashFlowIRR["Total Unrealized"] = 0;

          objCashFlowMultiple["Total Realized"] = 0;

          objCashFlowMultiple["Total Unrealized"] = 0;

          objCashFlowRealizeList.Results.push(objCashFlowCapitalInvested);
          objCashFlowRealizeList.Results.push(objCashFlowRealized);
          objCashFlowRealizeList.Results.push(objCashFlowUnrealized);
          objCashFlowRealizeList.Results.push(objCashFlowTotal);
          objCashFlowRealizeList.Results.push(objCashFlowIRR);
          objCashFlowRealizeList.Results.push(objCashFlowMultiple);

          objCashFlowRealizeList.Results.forEach(function (result: any) {
            if (
              result.Date == FundCashflowConstants.CapitalInvested ||
              result.Date == "Realized Value" ||
              result.Date == "Unrealized Value" ||
              result.Date == "Total Value" ||
              result.Date == FundCashflowConstants.IRR ||
              result.Date == FundCashflowConstants.TVPI
            ) {
              totalCalulationModel.forEach(function (totalData: any) {
                if (result.Date == FundCashflowConstants.CapitalInvested) {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] = totalData.totalCapitalInvested;
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] = totalData.totalCapitalInvested;
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] = totalData.totalCapitalInvested;
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                      totalData.totalCapitalInvested;
                  }
                }
                if (result.Date == "Realized Value") {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] = totalData.totalRealizedValue;
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] = totalData.totalRealizedValue;
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] = totalData.totalRealizedValue;
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                      totalData.totalRealizedValue;
                  }
                }
                if (result.Date == "Unrealized Value") {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] = totalData.totalUnrealizedValue;
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] = totalData.totalUnrealizedValue;
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] = totalData.totalUnrealizedValue;
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                      totalData.totalUnrealizedValue;
                  }
                }
                if (result.Date == "Total Value") {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] = totalData.totalofTotalValue;
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] = totalData.totalofTotalValue;
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] = totalData.totalofTotalValue;
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                      totalData.totalofTotalValue;
                  }
                }
                if (result.Date == FundCashflowConstants.IRR) {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] =
                    local.miscService.formatFloatNumber(totalData.totalIRR) + "%";
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] =
                    local.miscService.formatFloatNumber(totalData.totalIRR) + "%";
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] =
                    local.miscService.formatFloatNumber(totalData.totalIRR) + "%";
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                    local.miscService.formatFloatNumber(totalData.totalIRR) + "%";
                  }
                }
                if (result.Date == FundCashflowConstants.TVPI) {
                  if (totalData.calculationType == "Realize") {
                    result["Total Realized"] = totalData.totalMultiple;
                  } else if (totalData.calculationType == "Unrealize") {
                    result["Total Unrealized"] = totalData.totalMultiple;
                  } else if (
                    totalData.calculationType == "TotalRealizeUnrealize"
                  ) {
                    result["Total"] = totalData.totalMultiple;
                  } else if (
                    totalData.calculationType == "TotalLessFundExpensesFees"
                  ) {
                    result["Total Less Fund Expenses/Fees"] =
                      totalData.totalMultiple;
                  }
                }
              });
            }
          });

          if (objCashFlowRealizeList.Results.length == 0) {
            objCashFlowRealizeList.cols = [];
          }

          objCashFlowRealizeList.cols.filter(function (v: any, k: any) {
            if (v.field == "Total Realized") {
              local.realizedColIndex = k;
            }
            if (v.field == "Total Unrealized") {
              local.unrealizedColIndex = k;
            }
          });
          this.realizeData = objCashFlowRealizeList;
          this.getFundData(this.realizeData.Results, expenseTotal);
        } else {
          this.cashflowData = [];
          this.totalRecords = 0;
        }
      },
      error:(error) => {
        this.enableSaveButton = true;
      }
  });
  }

  getFundPerformanceDetails(fileId: any) {
    let resp = this.FcData;
    let local = this;
    let FundPerformanceList: any = [];
    let FundPerformanceReportingList: any = [];
    FundPerformanceList.Results = [];
    let realizeList: any = [];
    let unrealizedList: any = [];
    let othersList: any = [];
    let totalothersList: any = [];
    let totalRealizeothersList: any = [];
    let totalUnrealizeothersList: any = [];
    this.cashflowData = resp.cashflowDateWiseSummary;
    FundPerformanceList.cols = GeFundPerformanceHeaders();
    let calulationModel = resp.cashflowCalculationDetails;
    this.cashflowData.forEach(function (data: any, index: any) {
      data.cashFlowCompanyList.forEach(function (comp: any) {
        let realiseobj = realizeList.find(x => x[FundCashflowConstants.Name] === comp.portfolioCompanyName);
        let unrealiseobj = unrealizedList.find(x => x[FundCashflowConstants.Name] === comp.portfolioCompanyName);
        if (realiseobj === undefined && unrealiseobj === undefined) {
          let objCashFlowRealize: any = {};
          let objCashFlowUnRealize: any = {};
          objCashFlowRealize[FundCashflowConstants.Date] = objCashFlowUnRealize[FundCashflowConstants.Date
          ] = local.miscService.formatDate(data.transactionDate);
          objCashFlowRealize[FundCashflowConstants.IsRealizedValue] = comp.isRealizedValue;
          objCashFlowRealize[FundCashflowConstants.PortfolioCompanyId] = comp.portfolioCompanyId;
          let value = calulationModel.find(x => x.portfolioCompanyName === comp.portfolioCompanyName);
          if (comp.isRealizedValue) {
            objCashFlowRealize[FundCashflowConstants.Value] = comp.transactionValue;
            objCashFlowRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
            objCashFlowRealize[FundCashflowConstants.CapitalInvested] = local.miscService.formatFloatNumber(value.capitalInvested.toString().replace('-', ''));
            objCashFlowRealize[FundCashflowConstants.RealizedValue] = local.miscService.formatFloatNumber(value.realizedValue.toString().replace('-', ''));
            objCashFlowRealize[FundCashflowConstants.UnrealizedValue] = local.miscService.formatFloatNumber(value.unrealizedValue.toString().replace('-', ''));
            objCashFlowRealize[FundCashflowConstants.TotalValue] = local.miscService.formatFloatNumber(value.totalValue.toString().replace('-', ''));
            objCashFlowRealize[FundCashflowConstants.IRR] = local.miscService.formatFloatNumber(value.irr)+ "%";
            objCashFlowRealize[FundCashflowConstants.TVPI] = local.miscService.formatFloatNumber(value.multiple.toString().replace('-', ''));
            objCashFlowRealize[FundCashflowConstants.Currency] = comp.reportingCurrency;
            objCashFlowRealize["FundCurrency"] = local.fundCurrency;
            objCashFlowRealize["capitalInvested"] = local.miscService.formatFloatNumber(value.capitalInvested.toString().replace('-', ''));
            objCashFlowRealize["realizedValue"] = local.miscService.formatFloatNumber(value.realizedValue.toString().replace('-', ''));
            objCashFlowRealize["unrealizedValue"] = local.miscService.formatFloatNumber(value.unrealizedValue.toString().replace('-', ''));
            objCashFlowRealize["totalValue"] = local.miscService.formatFloatNumber(value.totalValue.toString().replace('-', ''));
            realizeList.push(objCashFlowRealize);
          } else {
            objCashFlowUnRealize[FundCashflowConstants.Value] = comp.transactionValue;
            objCashFlowUnRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
            objCashFlowUnRealize[FundCashflowConstants.CapitalInvested] = local.miscService.formatFloatNumber(value.capitalInvested.toString().replace('-', ''));
            objCashFlowUnRealize[FundCashflowConstants.RealizedValue] = local.miscService.formatFloatNumber(value.realizedValue.toString().replace('-', ''));
            objCashFlowUnRealize[FundCashflowConstants.UnrealizedValue] = local.miscService.formatFloatNumber(value.unrealizedValue.toString().replace('-', ''));
            objCashFlowUnRealize[FundCashflowConstants.TotalValue] = local.miscService.formatFloatNumber(value.totalValue.toString().replace('-', ''));
            objCashFlowUnRealize[FundCashflowConstants.IRR] = local.miscService.formatFloatNumber(value.irr) + "%";
            objCashFlowUnRealize[FundCashflowConstants.TVPI] = local.miscService.formatFloatNumber(value.multiple.toString().replace('-', ''));
            objCashFlowUnRealize[FundCashflowConstants.Currency] = comp.reportingCurrency;
            objCashFlowUnRealize["FundCurrency"] = local.fundCurrency;
            objCashFlowUnRealize["capitalInvested"] = local.miscService.formatFloatNumber(value.capitalInvested.toString().replace('-', ''));
            objCashFlowUnRealize["realizedValue"] = local.miscService.formatFloatNumber(value.realizedValue.toString().replace('-', ''));
            objCashFlowUnRealize["unrealizedValue"] = local.miscService.formatFloatNumber(value.unrealizedValue.toString().replace('-', ''));
            objCashFlowUnRealize["totalValue"] = local.miscService.formatFloatNumber(value.totalValue.toString().replace('-', ''));
            unrealizedList.push(objCashFlowUnRealize);
          }
        }
      });
    });

    let totalCalulationModel = resp.totalCalculationDetails;
    totalCalulationModel.forEach(function (TotalCapitialInvested: any) {
      let objOthers: any = {};
      if (TotalCapitialInvested.calculationType === 'TotalRealizeUnrealize') {
        objOthers["capitalInvested"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalCapitalInvested.toString().replace('-', ''));
        objOthers["realizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalRealizedValue.toString().replace('-', ''));
        objOthers["unrealizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalUnrealizedValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.IRR] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalIRR) + "%";
        objOthers[FundCashflowConstants.TVPI] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalMultiple.toString().replace('-', ''));
        objOthers["totalValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalofTotalValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.IsExpense] = true;
        objOthers[FundCashflowConstants.IsTotal] = true;
        objOthers[FundCashflowConstants.Name] = FundCashflowConstants.Total;
        totalothersList.push(objOthers);
      }
      else if (TotalCapitialInvested.calculationType === 'Unrealize') {
        objOthers["capitalInvested"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalCapitalInvested.toString().replace('-', ''));
        objOthers["realizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalRealizedValue.toString().replace('-', ''));
        objOthers["unrealizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalUnrealizedValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.IRR] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalIRR) + "%";
        objOthers[FundCashflowConstants.TVPI] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalMultiple.toString().replace('-', ''));
        objOthers["totalValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalofTotalValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.Name] = FundCashflowConstants.TotalUnRealized;
        totalUnrealizeothersList.push(objOthers);
      }
      else if (TotalCapitialInvested.calculationType === 'Realize') {
        objOthers["capitalInvested"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalCapitalInvested.toString().replace('-', ''));
        objOthers["realizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalRealizedValue.toString().replace('-', ''));
        objOthers["unrealizedValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalUnrealizedValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.IRR] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalIRR) + "%";
        objOthers[FundCashflowConstants.TVPI] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalMultiple.toString().replace('-', ''));
        objOthers["totalValue"] = local.miscService.formatFloatNumber(TotalCapitialInvested.totalofTotalValue.toString().replace('-', ''));
        objOthers[FundCashflowConstants.Name] = FundCashflowConstants.TotalRealized;
        totalRealizeothersList.push(objOthers);
      }
    });

    othersList.push(...totalRealizeothersList);
    othersList.push(...totalUnrealizeothersList);
    othersList.push(...totalothersList);
    realizeList = realizeList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
    unrealizedList = unrealizedList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
    FundPerformanceList.Results.push(...realizeList);
    FundPerformanceReportingList.push(...realizeList);
    FundPerformanceList.Results.push(...unrealizedList);
    FundPerformanceReportingList.push(...unrealizedList);
    FundPerformanceList.Results.push(...othersList);
    this.fundPerformanceData = FundPerformanceList;
    this.fundPerformanceReportingCols = GeFundPerformanceReportingHeaders();
    this.fundPerformanceReportingTempData = FundPerformanceReportingList;
    this.isLoading = false;
  }

  getFPReportingData(){
    if(this.fcReportingData.length < 1){
      this.getFundCashflowReportingDetails();
    } else{
      this.getFpData();
    }

  }

  getFpData(){
    let fundData = {FpConversionModels:this.fundPerformanceReportingTempData,TransactionValues:this.fcReportingData}
    this.cashflowService.GetReportngCurrencyValuesForFundPerformance(fundData).subscribe({
      next:(result) => {
        if (result.length > 0) {
          this.fundPerformanceReportingData = result;
        }
        this.isLoading = false;
      },
      error:(error) => {
        this.isLoading = false;
      }
  });
  }

  getFundData(cashfloData: any , expenseTotal) {
    let local = this;
    let capitalInvested = 0;
    let totalValue = 0;
    cashfloData.forEach(function (val: any) {
      if (val.Date == FundCashflowConstants.CapitalInvested) {
        capitalInvested = val.Total < 0 ? val.Total* -1 : val.Total;
        local.fundData[FundCashflowConstants.CapitalInvested] = local.miscService.formatFloatNumber(val.Total.toString().replace('-', ''));
      }
      if (val.Date == FundCashflowConstants.RealizedValue) {
        local.fundData[FundCashflowConstants.RealizedValue] = local.miscService.formatFloatNumber(val.Total.toString().replace('-', ''));
      }
      if (val.Date == FundCashflowConstants.UnrealizedValue) {
        local.fundData[FundCashflowConstants.UnrealizedValue] = local.miscService.formatFloatNumber(val.Total.toString().replace('-', ''));
      }
      if (val.Date == FundCashflowConstants.TotalValue) {
        totalValue = val.Total < 0 ? val.Total* -1 : val.Total;
        local.fundData[FundCashflowConstants.TotalValue] = local.miscService.formatFloatNumber(val.Total.toString().replace('-', ''));
      }
      if (val.Date == FundCashflowConstants.TVPI) {        
        let nettvpi = totalValue/(expenseTotal + capitalInvested);
        local.fundData["Gross TVPI"] = local.miscService.formatFloatNumber(val.Total.toString().replace('-', ''));
        local.fundData["Net TVPI"] = nettvpi.toString().replace('-', '');
      }
      if (val.Date == FundCashflowConstants.IRR) {
        local.fundData["Gross IRR"] = val.Total;
        local.fundData["Net IRR"] = val["Total Less Fund Expenses/Fees"];
      }

      /***********Frozen Rows***************/
    });
  }

  selectTab(tab) {
    
    if (tab.field === FundCashflowConstants.FundCashflow) {
      this.tabList.forEach(t => t.active = false);
      tab.active = true;
      this.tabName = tab.name;
      this.selectTabPartial();
    } else {
      this.fundPerformancetabList.forEach(t => t.active = false);
      tab.active = true;
      this.tabNameFP = tab.name;
      if (this.tabNameFP == FundCashflowConstants.ReportingCurrency) {
        if (this.fundPerformanceReportingData == undefined || this.fundPerformanceReportingData?.length == 0)
          this.getFPReportingData();
      }
    }
  }
  selectTabPartial(){
    if (this.tabName == FundCashflowConstants.ReportingCurrency) {
      this.isCfFundCurrency = false;
      let fundReportingCashflowDataResults = this.FundReportingCashflowData.Results;
      let selectedFundCashflowType = this.selectedFundcashflowType.name;
      if (fundReportingCashflowDataResults == undefined || fundReportingCashflowDataResults?.length == 0) {
        this.getFundCashflowReportingDetails();
      } else {
        if (selectedFundCashflowType == FundCashflowConstants.Realised) {
          this.FundReportingCashflowData = this.realizeReportingCFData;
        } else if (selectedFundCashflowType == FundCashflowConstants.Unrealised) {
          this.FundReportingCashflowData = this.unRealizeReportingCFData;
        } else {
          this.FundReportingCashflowData = this.objReportingCashFlowList;
        }
      }
    }
    else {
      this.selectTabSubPartial(); 
    }
  } 
  selectTabSubPartial(){
    this.isCfFundCurrency = true;
    let cashFlowByIdData = {
      cashFlowId: this.cashflowFileId,
      pageName: "List",
    };
    let selectedFundCashflowType = this.selectedFundcashflowType.name;
    let FundCashflowDataResults = this.FundCashflowData.Results;
    if (FundCashflowDataResults == undefined || FundCashflowDataResults?.length == 0) {
      this.getFundCashflowDetails(cashFlowByIdData);
    } else {
      if (selectedFundCashflowType == FundCashflowConstants.Realised) {
        this.FundCashflowData = this.realizeList;
      } else if (selectedFundCashflowType == FundCashflowConstants.Unrealised) {
        this.FundCashflowData = this.unrealizedList;
      } else if (selectedFundCashflowType == "Others") {
        this.FundCashflowData = this.othersList;
      } else {
        this.FundCashflowData = this.objCashFlowList;
      }
    }
  }
  getFundCashflowDetails(fileId: any) {
    this.isCfFundCurrency = true;
    this.isLoading = true;
    let resp = this.FcData;
    let local = this;
    let FundCashFlowList: any = [];
    let FundCashFlowRealisedList: any = [];
    let FundCashFlowUnrealisedList: any = [];
    let FundCashFlowOthersList: any = [];
    FundCashFlowList.Results = [];
    FundCashFlowRealisedList.Results = [];
    FundCashFlowUnrealisedList.Results = [];
    FundCashFlowOthersList.Results = [];
    let realizeList: any = [];
    let unrealizedList: any = [];
    let othersList: any = [];
    this.fundCurrency = resp?.currency?.currencyCode;
    this.cashflowData = resp.cashflowDateWiseSummary;
    this.fundName = resp.fund.fundName;
    localStorage.setItem("headerName", this.fundName); 
    FundCashFlowList.cols = GeFundCashflowHeaders();
    FundCashFlowRealisedList.cols = GeFundCashflowHeaders();
    FundCashFlowUnrealisedList.cols = GeFundCashflowHeaders();
    FundCashFlowOthersList.cols = GeFundCashflowHeaders();
    this.getFundCashflowReportingDetails();
    this.cashflowData.forEach(function (data: any, index: any) {
      let objOthers: any = {};
      objOthers[FundCashflowConstants.Date] = local.miscService.formatDate(data.transactionDate);
      objOthers[FundCashflowConstants.TransactionType] = FundCashflowConstants.Fees;
      objOthers[FundCashflowConstants.PortfolioCompanyId] = 0;
      objOthers[FundCashflowConstants.Value] = data.totalFundFees;
      objOthers[FundCashflowConstants.IsExpense] = true;
      objOthers[FundCashflowConstants.Name] = FundCashflowConstants.FeesOrExpense;
      if (data.totalFundFees != null){
        othersList.push(objOthers);
      }
      data.cashFlowCompanyList.forEach(function (comp: any) {
        let objCashFlowRealize: any = {};
        let objCashFlowUnRealize: any = {};
        objCashFlowRealize[FundCashflowConstants.Date] = objCashFlowUnRealize[
          FundCashflowConstants.Date
        ] = local.miscService.formatDate(data.transactionDate);
        objCashFlowRealize[FundCashflowConstants.TransactionType] = comp.transactionType;
        objCashFlowUnRealize[FundCashflowConstants.TransactionType] = comp.transactionType;
        objCashFlowRealize[FundCashflowConstants.IsRealizedValue] = comp.isRealizedValue;
        objCashFlowRealize[FundCashflowConstants.PortfolioCompanyId] = comp.portfolioCompanyId;
        objCashFlowUnRealize[FundCashflowConstants.PortfolioCompanyId] = comp.portfolioCompanyId;
        if (comp.isRealizedValue) {
          objCashFlowRealize[FundCashflowConstants.Value] = comp.transactionValue;
          objCashFlowRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
          realizeList.push(objCashFlowRealize);
        } else {
          objCashFlowUnRealize[FundCashflowConstants.Value] = comp.transactionValue;
          objCashFlowUnRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
          unrealizedList.push(objCashFlowUnRealize);
        }
      });
    });
    realizeList = realizeList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
    unrealizedList = unrealizedList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
    FundCashFlowList.Results.push(...realizeList);
    FundCashFlowRealisedList.Results.push(...realizeList);
    FundCashFlowList.Results.push(...unrealizedList);
    FundCashFlowUnrealisedList.Results.push(...unrealizedList);
    FundCashFlowList.Results.push(...othersList);
    FundCashFlowOthersList.Results.push(...othersList);
    this.objCashFlowList = FundCashFlowList;
    this.realizeList = FundCashFlowRealisedList;
    this.unrealizedList = FundCashFlowUnrealisedList;
    this.othersList = FundCashFlowOthersList;
    this.FundCashflowData = this.selectedFundcashflowType.name == FundCashflowConstants.Realised ? this.realizeList : this.selectedFundcashflowType.name == FundCashflowConstants.Unrealised ? this.unrealizedList : this.selectedFundcashflowType.name == "Others" ? this.othersList : FundCashFlowList;
    this.isLoading = false;
  }
  onSelectfundcashflowTypes(event) {
    
    this.selectedFundcashflowType = { name: event.item }
    switch (event.item) {
      case FundCashflowConstants.Realised: {
        if (this.isCfFundCurrency)
          this.FundCashflowData = this.realizeList;
        else
          this.FundReportingCashflowData = this.realizeReportingCFData;
        break;
      }
      case FundCashflowConstants.Unrealised: {
        if (this.isCfFundCurrency)
          this.FundCashflowData = this.unrealizedList;
        else
          this.FundReportingCashflowData = this.unRealizeReportingCFData;
        break;
      }
      case FundCashflowConstants.Others: {
        if (this.isCfFundCurrency)
          this.FundCashflowData = this.othersList;
        else
          this.FundReportingCashflowData = this.objReportingCashFlowList;
        break;
      }
      default: {
        if (this.isCfFundCurrency)
          this.FundCashflowData = this.objCashFlowList;
        else
          this.FundReportingCashflowData = this.objReportingCashFlowList;
        break;
      }
    }
  }
  getFundCashflowReportingDetails() {
    this.isLoading = true;
    let FundCashFlowList: any = [];
      let FundCashFlowRealisedList: any = [];
      let FundCashFlowUnrealisedList: any = [];
    if (this.cashflowData.length > 0) {

      let local = this;
      let realizeList: any = [];
      let unrealizedList: any = [];
      
      FundCashFlowList.Results = [];
      FundCashFlowRealisedList.Results = [];
      FundCashFlowUnrealisedList.Results = [];
      FundCashFlowList.cols = GeFundCashflowReportingCurrencyTableHeaders();
      FundCashFlowRealisedList.cols = GeFundCashflowReportingCurrencyTableHeaders();
      FundCashFlowUnrealisedList.cols = GeFundCashflowReportingCurrencyTableHeaders();
      this.cashflowData.forEach(function (data: any, index: any) {
        data.cashFlowCompanyList.forEach(function (comp: any) {
          let objCashFlowRealize: any = {};
          let objCashFlowUnRealize: any = {};
          objCashFlowRealize[FundCashflowConstants.Date] = objCashFlowUnRealize[
            FundCashflowConstants.Date
          ] = local.miscService.formatDate(data.transactionDate);
          if (comp.isRealizedValue) {
            objCashFlowRealize[FundCashflowConstants.Value] = comp.transactionValue;
            objCashFlowRealize[FundCashflowConstants.Currency] = comp.reportingCurrency;
            objCashFlowRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
            objCashFlowRealize["TransactionType"] = comp.transactionType != null ? comp.transactionType : data.transactionType;
            objCashFlowRealize[FundCashflowConstants.PortfolioCompanyId] = objCashFlowRealize[FundCashflowConstants.PortfolioCompanyId] = comp.portfolioCompanyId;
            objCashFlowRealize[FundCashflowConstants.IsRealizedValue] = comp.isRealizedValue;
            objCashFlowRealize["FundCurrency"] = local.fundCurrency;
            realizeList.push(objCashFlowRealize);
          } else {
            objCashFlowUnRealize[FundCashflowConstants.Value] = comp.transactionValue;
            objCashFlowUnRealize[FundCashflowConstants.Currency] = comp.reportingCurrency;
            objCashFlowUnRealize["FundCurrency"] = local.fundCurrency;
            objCashFlowUnRealize[FundCashflowConstants.Name] = comp.portfolioCompanyName;
            objCashFlowUnRealize["TransactionType"] = comp.transactionType != null ? comp.transactionType : data.transactionType;
            objCashFlowUnRealize[FundCashflowConstants.PortfolioCompanyId] = comp.portfolioCompanyId;
            objCashFlowUnRealize[FundCashflowConstants.IsRealizedValue] = comp.isRealizedValue;
            unrealizedList.push(objCashFlowUnRealize);
          }
        });
      });
      realizeList = realizeList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
      unrealizedList = unrealizedList.sort((a, b) => a.portfolioCompanyId - b.portfolioCompanyId);
      FundCashFlowList.Results.push(...realizeList);
      FundCashFlowList.Results.push(...unrealizedList);
    }
    this.cashflowService.getCashFlowFxRates(FundCashFlowList.Results).subscribe({
      next:(result) => {
        if (result.length > 0) {
          FundCashFlowList.Results = result;
          this.fcReportingData = result;
          this.getFpData();
          this.objReportingCashFlowList = FundCashFlowList;
          FundCashFlowRealisedList.Results = result.filter(x => x.isRealizedValue);
          FundCashFlowUnrealisedList.Results = result.filter(x => !x.isRealizedValue);
          this.realizeReportingCFData = FundCashFlowRealisedList;
          this.unRealizeReportingCFData = FundCashFlowUnrealisedList;
          this.FundReportingCashflowData = this.selectedFundcashflowType.name == FundCashflowConstants.Realised ? this.realizeReportingCFData : this.selectedFundcashflowType.name == FundCashflowConstants.Unrealised ? this.unRealizeReportingCFData : FundCashFlowList;
        }
        this.isLoading = false;
      },
      error:(error) => {
        this.isLoading = false;
      }
  });
  }

}
