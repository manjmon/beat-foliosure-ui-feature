import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { CommonPCConstants } from "../common/constants";
import { AccountService } from "./account.service";
import { CryptoService } from "./crypto.service";
import { OidcAuthService } from "./oidc-auth.service";

@Injectable()
export class PermissionService {
  myAppUrl: string = "";
  constructor(
    private _http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private cryptoService:CryptoService,
    private ids:OidcAuthService,
    private accountService: AccountService,  router: Router
  ) {
    this.myAppUrl = baseUrl;
  }

  addGroup(group: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/add", group).pipe(
      map((response) => response),
      catchError(this.accountService.errorHandler)
    );
  }

  getGroupList(filter: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/get", filter).pipe(
      map((response) => response),
      catchError((error) => this.accountService.errorHandler(error))
    );
  }

  getGroupById(groupId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/group/getbyid", groupId)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }

  updateGroup(group: any) {
    return this._http.post<any>(this.myAppUrl + "api/group/add", group).pipe(
      map((response) => response),
      catchError(this.accountService.errorHandler)
    );
  }
  isFullAccess(groupId: any) {
    return this._http
      .get<any>(this.myAppUrl + `api/feature/isFullAccess/${groupId}`)
      .pipe(
        map((response) => response),
        catchError(this.accountService.errorHandler)
      );
  }
  getFeatureList(groupId: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/feature/get", groupId)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }

  getUserSubFeature(permissionModel: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/user/getuserpermission", permissionModel)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }
  getSubFeatureByGroup(permissionModel: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/access/subfeatures/get", permissionModel)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }
  getFeatures() {
    return this._http
      .get<any>(this.myAppUrl + "api/group/getFeatures")
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }
  updateUserSubFeature(permissionModel: any) {
    return this._http
      .post<any>(this.myAppUrl + "api/user/updateuserpermission", permissionModel)
      .pipe(
        map((response) => response),
        catchError((error) => this.accountService.errorHandler(error))
      );
  }

  checkUserPermission(subFeatureId: any, action: any, mappingId: any) {
    return true;
    var permission = this.cryptoService.getDecryptedValue(localStorage.getItem(`${this.ids.environment}_UserSubFeaturePermissions`));
    var permission = localStorage.getItem(`${this.ids.environment}_UserSubFeaturePermissions`);

    var permissionData = permission;
    if (
      permissionData != null &&
      permissionData != undefined &&
      permissionData != "[]"
    ) {
      let permissions = JSON.parse(permissionData + "");
      var isAllow = permissions.filter(function (val: any, key: any) {
        if (val.subFeatureID == subFeatureId && val[action] && val.encryptedFeatureMappingId == mappingId) {
          return true;
        }
        else{
        return false;
        }
      });
      return isAllow.length > 0 ? true : false;
    }
    return false;
  }

  checkPermission(feature: any) {
    let permissions;
    let permissionData = localStorage.getItem(`${this.ids.environment}_userPermissions`);
    if (
      permissionData != null &&
      permissionData != undefined &&
      permissionData != "[]"
    ) {
      permissions = JSON.parse(permissionData + "");
    }
    let isAllow = permissions.filter(function (val: any, key: any) {
      return val.featureID == feature;
    });
    return isAllow.length > 0 ? true : false;
  }
  isCheckTaabo()
  {
    return window.location.host == CommonPCConstants.TaaboHost;
  }
  exportGroupList(filter: any) {
    return this._http
      .post(this.myAppUrl + "api/group/export", filter, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(catchError((error) => this.accountService.errorHandler(error)));
  }
  getFeatureData(){
    return localStorage.getItem(`${this.ids.environment}_featurePermissions`)!=null ?localStorage.getItem(`${this.ids.environment}_featurePermissions`) : null;
  }
  checkFeaturePermission(permission: any) {
    let permissions: any[];
    let permissionData = localStorage.getItem(`${this.ids.environment}_userPermissions`)!=null ?localStorage.getItem(`${this.ids.environment}_userPermissions`) : null;
    if (
      permissionData != null &&
      permissionData != undefined &&
      permissionData != "[]"
    ) {
      permissions = JSON.parse(permissionData + "");
    }
    if (
      permissions != undefined &&
      permissions != null &&
      permission != undefined &&
      permission != null
    ) {
      let isAllow = permissions.filter(function (val: any, key: any) {
        if (val.featureID == permission.featureId) {
          if (permission.action != undefined) {
            switch (permission.action) {
              case "add":
                return val.canAdd == 1;
              case "view":
                return val.canView == 1;
              case "edit":
                return val.canEdit == 1;
              case "export":
                return val.canExport == 1;
              case "import":
                return val.canImport == 1;
              default:
                return false;
            }
          } else {
              return false;
          }
        }
        else
          return false;
      });
      return isAllow.length > 0 ? true : false;
    } else {
        return false;
    }
  }

  navigationItems: any = [
    {
      id: "1",
      label: "Firm",
      url: "/firm",
      parent: "",
      feature: { featureId: FeaturesEnum.Firm },
    },
    {
      id: "2",
      label: "Funds",
      url: "/fund-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Fund },
    },
    {
      id: "3",
      label: "Portfolio Company",
      url: "/portfolio-company",
      parent: "",
      feature: { featureId: FeaturesEnum.PortfolioCompany },
    },
    {
      id: "4",
      label: "Deal",
      url: "/deal-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Deal },
    },
    {
      id: "5",
      label: "Pipeline",
      url: "/pipeline-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Pipeline },
    },
    {
      id: "6",
      label: "Report",
      url: "",
      parent: "",
      feature: { featureId: FeaturesEnum.Report },
    },
    {
      id: "7",
      label: "Admin",
      url: "",
      parent: "",
      feature: { featureId: FeaturesEnum.Admin },
    },

    {
      id: "8",
      label: "Create Firm",
      url: "/add-firm",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "add" },
    },
    {
      id: "9",
      label: "Update Firm",
      url: "/add-firm/:id",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "edit" },
    },
    {
      id: "9",
      label: "Firm Details",
      url: "/firm-details/:id",
      parent: "1",
      feature: { featureId: FeaturesEnum.Firm, action: "view" },
    },

    {
      id: "10",
      label: "Create Fund",
      url: "/create-fund",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "add" },
    },
    {
      id: "11",
      label: "Update Fund",
      url: "/create-fund/:id",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "edit" },
    },
    {
      id: "12",
      label: "Fund Details",
      url: "/fund-details/:id",
      parent: "2",
      feature: { featureId: FeaturesEnum.Fund, action: "view" },
    },

    {
      id: "13",
      label: "Create Portfolio Company",
      url: "/add-portfolio-company",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "add" },
    },
    {
      id: "14",
      label: "Update Portfolio Company",
      url: "/add-portfolio-company/:id",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "edit" },
    },
    {
      id: "15",
      label: "Portfolio Company Details",
      url: "/portfolio-company-detail/:id",
      parent: "3",
      feature: { featureId: FeaturesEnum.PortfolioCompany, action: "view" },
    },

    {
      id: "16",
      label: "Create Deal",
      url: "/save-deal",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "add" },
    },
    {
      id: "17",
      label: "Update Deal",
      url: "/save-deal/:id",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "edit" },
    },
    {
      id: "18",
      label: "Deal Details",
      url: "/deal-details/:id",
      parent: "4",
      feature: { featureId: FeaturesEnum.Deal, action: "view" },
    },

    {
      id: "19",
      label: "Create Pipeline",
      url: "/pipeline",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "add" },
    },
    {
      id: "20",
      label: "Update Pipeline",
      url: "/pipeline/:id",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "edit" },
    },

    {
      id: "21",
      label: "Top Holdings",
      url: "/reports/Holdings",
      parent: "",
      feature: { featureId: FeaturesEnum.Holdings },
    },
    {
      id: "22",
      label: "Valuation Analysis",
      url: "/reports/ValuationCharts",
      parent: "",
      feature: { featureId: FeaturesEnum.ValuationCharts },
    },
    {
      id: "23",
      label: "Attribution Reports",
      url: "/reports/Attribution",
      parent: "",
      feature: { featureId: FeaturesEnum.Attribution },
    },

    {
      id: "24",
      label: "Group",
      url: "/groups",
      parent: "",
      feature: { featureId: FeaturesEnum.Group },
    },
    {
      id: "25",
      label: "User",
      url: "/user",
      parent: "",
      feature: { featureId: FeaturesEnum.User },
    },

    {
      id: "26",
      label: "Create Group",
      url: "/update-group",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "add" },
    },
    {
      id: "27",
      label: "Update Group",
      url: "/update-group/:id",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "edit" },
    },
    {
      id: "28",
      label: "Group Details",
      url: "/group-details/:id",
      parent: "24",
      feature: { featureId: FeaturesEnum.Group, action: "view" },
    },

    {
      id: "29",
      label: "Create User",
      url: "/register",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "add" },
    },
    {
      id: "30",
      label: "Update User",
      url: "/register/:id",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "edit" },
    },

    {
      id: "31",
      label: "Financial/Operational KPIs",
      url: "/reports/CompanyFinancials",
      parent: "",
      feature: { featureId: FeaturesEnum.CompanyFinancials },
    },
    {
      id: "32",
      label: "Dynamic Query",
      url: "/dynamic-queries",
      parent: "",
      feature: { featureId: FeaturesEnum.Admin },
    },

    {
      id: "33",
      label: "Create Query",
      url: "/create-update-queries",
      parent: "32",
      feature: { featureId: FeaturesEnum.Query, action: "add" },
    },
    {
      id: "34",
      label: "Update Query",
      url: "/create-update-queries/:id",
      parent: "32",
      feature: { featureId: FeaturesEnum.Query, action: "edit" },
    },

    {
      id: "35",
      label: "Bulk Upload",
      url: "/bulk-upload",
      parent: "",
      feature: { featureId: FeaturesEnum.BulkUpload },
    },
    {
      id: "36",
      label: "Fund Cashflow",
      url: "/cashflow-list",
      parent: "",
      feature: { featureId: FeaturesEnum.Cashflow },
    },
    {
      id: "37",
      label: "Cashflow Details",
      url: "/cashflow/:id",
      parent: "36",
      feature: { featureId: FeaturesEnum.Cashflow, action: "view" },
    },
    {
      id: "38",
      label: "Upload Cashflow",
      url: "/cashflow",
      parent: "36",
      feature: { featureId: FeaturesEnum.Cashflow, action: "import" },
    },
    {
      id: "39",
      label: "Pipeline Details",
      url: "/pipeline-details/:id",
      parent: "5",
      feature: { featureId: FeaturesEnum.Pipeline, action: "view" },
    },
    {
      id: "40",
      label: "User Details",
      url: "/user-details/:id",
      parent: "25",
      feature: { featureId: FeaturesEnum.User, action: "view" },
    },
    {
      id: "41",
      label: "Change Password",
      url: "/change-password/:id",
      parent: "",
      feature: { featureId: FeaturesEnum.ChangePassword },
    },
    {
      id: "42",
      label: "Financials",
      url: "/financials",
      parent: "",
      feature: { featureId: FeaturesEnum.Financials },
    },
    {
      id: "43",
      label: "Data Extraction",
      url: "/dataextraction",
      parent: "",
      feature: { featureId: FeaturesEnum.DataExtraction },
    },
    {
      id: "44",
      label: "Repository",
      url: "/repository",
      parent: "",
      feature: { featureId: FeaturesEnum.Repository },
    },
    { id: "45", label: "OpenDocument", url: "/open-document", parent: "44", feature: { featureId: FeaturesEnum.OpenDocument } },
    { id: "46", label: "Save KPI", url: "/save-kpi", parent: "", feature: { featureId: FeaturesEnum.KPI } },
    { id: "47", label: "KPI List", url: "/kpi-list", parent: "", feature: { featureId: FeaturesEnum.KPI } },
    { id: "48", label: "Audit Logs", url: "/audit-logs", parent: "3", feature: { featureId: FeaturesEnum.AuditLogs } },
    { id: "49", label: "Unauthorized Access", url: "/401", parent: "", feature: {} },
    { id: "50", label: "LP Report Configuration", url: "/lp-report-config", parent: "", feature: { featureId: FeaturesEnum.LpReportConfig } },
    {
      id: "51",
      label: "Report Template",
      url: "/report-template",
      parent: "",
      feature: { featureId: FeaturesEnum.BulkUpload },
    },
    {
      id: "52",
      label: "Currency Exchange Rates",
      url: "/fxrates",
      parent: "",
      feature: { featureId: FeaturesEnum.FxRates },
    },
    {
      id: "53",
      label: "LP Report Configuration",
      url: "/lp-report-configuration",
      parent: "51",
      feature: { featureId: FeaturesEnum.BulkUpload },
    },
    {
      id: "54",
      label: "Access & Workflow",
      url: "/workflow/group-access",
      parent: "",
      feature: { featureId: FeaturesEnum.AccessAndWorkflow },
    },
    {
      id: "55",
      label: "Fund Report Configuration",
      url: "/fund-report-configuration",
      parent: "51",
      feature: { featureId: FeaturesEnum.ReportTemplate },
    },
    {
      id: "56",
      label: "Page Configuration",
      url: "/page-config",
      parent: "51",
      feature: { featureId: FeaturesEnum.PageConfig },
    },
    {
      id: "57",
      label: "Investors",
      url: "/investorlist",
      parent: "",
      feature: { featureId: FeaturesEnum.Investors },
    },
    {
      id: "58",
      label: "Add Investor",
      url: "/addinvestor",
      parent: "57",
      feature: { featureId: FeaturesEnum.Investors, action: "add" },
    },
    {
      id: "59",
      label: "Investor Details",
      url: "/investor-details/:id",
      parent: "57",
      feature: { featureId: FeaturesEnum.Investors, action: "view" },
    },
    {
      id: "60",
      label: "Update Investor",
      url: "/addinvestor/:id",
      parent: "57",
      feature: { featureId: FeaturesEnum.Investors, action: "edit" },
    },
    {
      id: "61",
      label: "Client Reporting",
      url: "/client-reporting",
      parent: "",
      feature: { featureId: FeaturesEnum.ClientReporting},
    },
    {
      /* This is for breadcrump title not used in nav menus.Dont add this id in feature table */
      id: "1000",
      label: "Workflow",
      url: "/workflow/company-draft/:id",
      parent: "",
      feature: { featureId: FeaturesEnum.BulkUpload },
    },
    {
      id: "62",
      label: "Internal Report",
      url: "/internal-report-configuration",
      parent: "51",
      feature: { featureId: FeaturesEnum.ReportTemplate },
    },
    {
      id: "63",
      label: "Report Download",
      url: "/report-download",
      parent: "",
      feature: { featureId: FeaturesEnum.ReportDownload }
    },
    {
      id: "64",
      label: "Consolidated Report",
      url: "/consolidated-report-configuration",
      parent: "51",
      feature: { featureId: FeaturesEnum.ReportTemplate },
    },
    {
      id: "65",
      label: "Valuation Model",
      url: "/valuation-model",
      feature: { featureId: FeaturesEnum.ValuationModel },
    },
    {
      id: "66",
      label: "ESG Model",
      url: "/ESG",
      feature: { featureId: FeaturesEnum.EsgModel },
    },
    {
      id: "999",
      label: "Download",
      url: "/report-download-bg/:id",
      feature: { featureId: FeaturesEnum.ValuationModel },
    },
    {
      id: "1050",
      label: "File Upload ",
     // url: "/report-download-bg/:id",
      url: "/fileuploadstatus",
      feature: { featureId: FeaturesEnum.BulkUploadError },
    },
    {
      /* This is for breadcrump title not used in nav menus.Dont add this id in feature table */
      id: "1001",
      label: "Page-Not-Found",
      url: "/404",
      parent: "",
      feature: { featureId: FeaturesEnum.BulkUpload }
    }
  ];
  getUserPermission() {
    return localStorage.getItem(`${this.ids.environment}_userPermissions`)
  }
}




export enum FeaturesEnum {
  User = 1,
  Group = 5,
  Firm = 9,
  Fund = 13,
  PortfolioCompany = 14,
  Deal = 15,
  Pipeline = 16,
  Report = 17,
  Holdings = 18,
  Attribution = 19,
  ValuationCharts = 20,
  Cashflow = 21,
  Admin = 22,
  CompanyFinancials = 23,
  Query = 24,
  BulkUpload = 25,
  ChangePassword = 26,
  Financials = 27,
  Repository = 29,
  OpenDocument = 30,
  KPI = 31,
  AuditLogs = 32,
  LpReportConfig = 33,
  FxRates = 34,
  AccessAndWorkflow = 35,
  Dashboard = 36,
  KPIsMapping = 37,
  ReportTemplate = 38,
  LPReportConfiguration = 39,
  DataExtraction = 40,
  PageConfig = 41,
  Investors = 42,
  ClientReporting = 43,
  ReportDownload = 44,
  ValuationModel = 45,
  BulkUploadError = 46,
  EsgModel = 47,
  General = 50,
  Common = 51,
  MyDashboard = 52,
  ExcelPlugin = 53,
  FEATURE_1,
  CREATE_USER,
}
export enum FeaturesImageEnum {
  User = "",
  Group = "",
  Firm = "Firms.svg",
  Fund = "Funds.svg",
  PortfolioCompany = "Porfolio Company.svg",
  Deal = "Deals.svg",
  Pipeline = "Pipelines.svg",
  Report = "Reports.svg",
  Holdings = "",
  Attribution = "",
  ValuationCharts = "",
  Cashflow = "Funds Cashflow.svg",
  Admin = "Admin.svg",
  CompanyFinancials = "",
  Query = "",
  BulkUpload = "",
  ChangePassword = "",
  Financials = "",
  Repository = "Repository.svg",
  OpenDocument = "",
  KPI = "",
  AuditLogs = "",
  LpReportConfig = "",
  FxRates="fxrates9206.svg",
  AccessAndWorkflow="",
  Dashboard="Dashboard.svg",
  KPIsMapping="",
  ReportTemplate="",
  LPReportConfiguration="",
  DataExtraction="",
  Investors="Investors.svg",
  ClientReporting ="",
  ValuationModel = "ValuationModel.svg",
  ESG ="EsgModel.svg"
}
export enum UserSubFeaturesEnum {
  Company = 1,
  StaticDataBusinessDesciptionInvestmentProfessional = 2,
  TradingRecords = 3,
  OperationalKPIs = 4,
  InvestmentKPIs = 5,
  CompanyKPIs = 6,
  ImpactKPIs = 7,
  Financials = 8,
  Commentary = 9,
  CreditKPI =10
}

export enum ActionsEnum {
  canAdd = 1,
  canEdit = 2,
  canView = 3,
  canExport = 4,
  canImport = 5
}
export enum KPIModulesEnum {
  TradingRecords = 1,
  CreditKPI = 2,
  Operational = 3,
  Investment = 4,
  Company = 5,
  Impact = 6,
  ProfitAndLoss = 7,
  BalanceSheet = 8,
  CashFlow = 9,
  ESG=10
}