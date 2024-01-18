import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem, LazyLoadEvent, MessageService } from "primeng/api";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { AccountService } from "../../services/account.service";
import {
  DecimalDigitEnum,
  ErrorMessage,
  ExportTypeEnum,
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeQuarterEnum,
} from "../../services/miscellaneous.service";
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../services/report.service";
import { SavePortfolioOperationalKPIComponent } from "./portfolioCompany-operationalKPI.component";
import { SavePortfolioProfitabilityComponent } from "./portfolioCompany-profitability.component";
import { UpdateInfoSectionComponent } from "./update-info-section.component";
import { ToastrService } from "ngx-toastr";
import { KpitablefiltersComponent } from '../kpitablefilters/kpitablefilters.component';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Subject } from 'rxjs';
import { CompanyStaticModel } from "./models/pc-static.model";
import { CompanyPageSectionConstants, CompanyInformationConstants, CommonPCConstants, M_Datatypes, NumberDecimalConst, KpiTypes } from "../../common/constants";
import { PageConfigurationSubFeature } from "../../common/enums";

const DEFAULT_DURATION = 300;
@Component({
  selector: "portfolio-company-detail",
  templateUrl: "./portfolioCompany-detail.component.html",
  styleUrls: ['./portfolioCompany-detail.component.scss'],
  providers: [
    SavePortfolioProfitabilityComponent,
    SavePortfolioOperationalKPIComponent,
    MessageService,
  ],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class PortfolioCompanyDetailComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  @ViewChild(KpitablefiltersComponent) filtercomp: KpitablefiltersComponent;
  istrade = true;
  collapsed = true;
  id: any;
  searchFilterkpi: any = null;
  modelProfitabilitykpi: any = {};
  portfolioCompanyID: any;
  portfolioYear: any
  portfolioQuater: any;
  editorPlaceholder: string = 'Enter Note here…';
  YearQuarter = null;
  year = null;
  quarter = null;
  disableConfirm = false;
  uploadedfiles = [];
  portfolioProfitabilityModel: any = {};
  portfolioOperationalKPIModel: any = {};
  geographicLocation: any = { isHeadquarter: false };
  sectorWiseOperationalKPIs: any[];
  financialKPIs: any[];
  showConfirModel = false;
  investmentKPIs: any[];
  companyKPIs: any[];
  reportType: typeof ReportType = ReportType;
  reportCategory: typeof ReportCategory = ReportCategory;
  reportData: any = [];
  model: any = {
    geographicLocations: [],
    pcEmployees: [],
  };
  items: MenuItem[];
  ddlModel: any = {
    operationalKPIList: [],
    selectedOperationalKPI: "",
    financialKPIList: [],
    selectedFinancialKPI: "",
    investmentKPIList: [],
    selectedInvestmentKPI: {
      displayName: '',
      kpiid: 0
    },
    companyKPIList: [],
    selectedCompanyKPI: ""
  };
  reportModel: any = {
    sectorwiseOperationalKPIs: [],
    portfolioCompany: null,
    selectedReportTypes: [
      this.reportType.CompanyFinancialKPIReport,
      this.reportType.CompanyOperationalKPIGrowth,
    ],
    chartMetadetaList: [
      {
        chartName: "Financial KPI",
        chartType: "LineMarkers",
        colNameX: "Quarter",
        colNameY: "% Change In Revenue",
      },
      {
        chartName: "Financial KPI",
        chartType: "ColumnClustered",
        colNameX: "Quarter",
        colNameY: "Revenue",
      },
    ],
  };
  headquarterLocation: any;

  msgTimeSpan: number;
  loading = false;
  blockedProfitabilityTable: boolean = false;
  portfolioProfitabilityList: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];
  totalProfitabilityRecords: number = 0;
  portfolioCompanyOperationalKPIValuesList: any[];
  portfolioCompanyOperationalKPIValuesDataTable: any[];
  portfolioCompanyOperationalKPIValuesListCol: any[];
  totalCompanyOperationalKPIValuesRecords: number;
  blockedCompanyOperationalKPIValuesTable: boolean = false;
  expandedOperationalKPIs: any[] = [];
  pagerLength: any;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  profitabilityValueUnit: any;
  investmentKpiValueUnit: any;
  impactKpiValueUnit: any;
  companyKpiValueUnit: any;
  showProfitabilityValueDecimals: boolean = true;
  profitabilityMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  operationalKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  unitTypeList = [
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

  exportItems: MenuItem[];
  exportLoading: boolean = false;
  exportInvestmentKPILoading: boolean = false;
  exportCompanyKPILoading: boolean = false;
  exportImpactKPILoading: boolean = false;

  CompanyKPIOrginalData: any[] = [];
  CompanyKPIChartData: any[] = [];
  CompanyKPIChartCol: any = [];

  InvestmentKPIOrginalData: any[] = [];
  tabName: string = "";
  tabList: ITab[] = [];
  eventsSubject: Subject<void> = new Subject<void>();
  isCompanyInfo: boolean = true;
  isOperationalKPI: boolean = true;
  isCompanyKPI: boolean = true;
  isInvestmentKPI: boolean = true;
  isImpactKPI: boolean = true;
  isCreditKPI: boolean = true;
  isFinancials: boolean = true;
  isTradingRecord: boolean = true;
  CIFieldExclude: any[] = [CompanyInformationConstants.CompanyLogo, CompanyInformationConstants.BusinessDescription];
  fieldValueList: any = [];
  subPageList: any = [];
  businessModel: CompanyStaticModel;
  companyLogoModel: CompanyStaticModel;
  companyStatusModel: CompanyStaticModel;
  companyPageSectionConstants = CompanyPageSectionConstants;
  companyInformationConstants = CompanyInformationConstants;
  commentFieldList: any[];
  CustomCommentryValues: any[];
  _commentFieldList: any[];
  investmentProfessionFieldList: any[];
  geographicLocationFieldList: any[];
  isCommentarySection: boolean = true;
  isTaabo: boolean = false;
  isLarissa: boolean = false;
  isExeter: boolean = false;
  isEnableTradingBeta: boolean = false;
  fundDetail: any = null;
  dealDetail: any = null;
  mDataTypes = M_Datatypes;
  NumberDecimalConst = NumberDecimalConst;
  encryptedCommentaryID: any = null;
   commentaryModelIdx : any;
   isFinancialsBeta:boolean = false;
   subSectionFields=[{kpiConfigurationData:[],hasChart:false,kpiType:""}];
  constructor(
    private reportService: ReportService,
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private modalService: NgbModal,
    private _avRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private permissionService: PermissionService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    if (!this.permissionService.checkUserPermission(this.subFeature.Company, ActionsEnum[ActionsEnum.canView], this.id)) {
      this.accountService.redirectToUnauthorized();
    }
    this.pagerLength = this.miscService.getSmallPagerLength();
    this.items = [
      {
        label: "Export",
        items: [
          {
            label: "Key Values",
            icon: "fa fa-file-excel-o",
            command: (_event) => {
              this.exportProfitabilityKeyValues();
            },
          },
          {
            label: "Income Statement",
            icon: "fa fa-file-excel-o",
            command: (_event) => {
              this.exportProfitabilityDetails();
            },
          },
        ],
      },
    ];
    this.exportItems = [
      {
        label: "LP Report",
        icon: "fa fa-file-pdf-o",
        command: () => {
          this.LPReport();
        },
      },
    ];
    this.modelInvestmentKpi.periodType = {
      type: PeriodTypeQuarterEnum.Last1Year,
    };
    this.modelInvestmentKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelInvestmentKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.modelCompanyKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelCompanyKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelCompanyKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.modelImpactKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelImpactKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelImpactKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.modelProfitabilitykpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };

    this.modelProfitabilitykpi.orderType = { type: OrderTypesEnum.LatestOnRight };

    this.modelProfitabilitykpi.decimalPlaces = {

      type: DecimalDigitEnum.Zero,

      value: "1.0-0",

    };
    this.profitabilityValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.investmentKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.impactKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    this.companyKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
    let emptyStaticObj = <CompanyStaticModel>({
      Name: "",
      DisplayName: "",
      Value: "",
      IsActive: false
    });
    this.businessModel = emptyStaticObj;
    this.companyStatusModel = emptyStaticObj;
    this.companyLogoModel = emptyStaticObj;
  }
  sourceURL: any;
  ngOnInit() {
    this.GetUserPermission();
    localStorage.setItem("searchFilter", null);
    this.getGetKPIPageConfigData();
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getPortfolioCompanies();
    this.getCompanyCustomList(this.id);
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.checkHost();
  }
  checkHost() {
    if (window.location.host == CommonPCConstants.TaaboHost) {
      this.isTaabo = true;
      this.isCommentarySection = false;
    }
    if (window.location.host == CommonPCConstants.LarissaHost) {
      this.isLarissa = true;
      this.isCommentarySection = true;
    }
    if (window.location.host == CommonPCConstants.ExeterHost) {
      this.isExeter = true;
      this.isEnableTradingBeta = true;
      this.isCommentarySection = true;
    }
    if (window.location.host == CommonPCConstants.TrialHost) {
      this.isEnableTradingBeta = true;
    } 
    if (window.location.host == "monmouth.beatfoliosure.com") {
      this.isCommentarySection = false;
    }
    if (window.location.host =="dev.beatapps.net"||window.location.host == "localhost:4200" || window.location.host == "uat.beatapps.net" || window.location.host == "test.beatapps.net") {
      this.isFinancialsBeta = true;
    }
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  kpiTable_GlobalFilter(event) {
    this.searchFilterkpi = event;
    this.eventsSubject.next(event);
  }
  significantEventsSection: any;
  assessmentSection: any;
  exitPlansSection: any;
  impactSection: any;
  footNoteInvestmentSection: any;
  footNoteTradingSection: any;
  portfolioCompanyCommentaryDetails: any;

  getStaticFieldDisplayName(items: any, sectionName: string) {
    let result = items.find(x => x.name == sectionName);
    return (result && result.displayName) || "";
  }
  isFieldActive(items: any[], sectionName: string): boolean {
    let result = items.find(x => x.name == sectionName);
    return ((result && result.isActive) || false);

  }
  transform(value: string): string {
    let first = value?.substr(0, 1).toUpperCase();
    return first + value?.substr(1);
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      let x = a[key]; let y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  customPortfolioGroupList = [];
  getCompanyCustomList = (pcId: any) => {
    if (pcId != undefined) {
      this.portfolioCompanyService.getCompanyCustomListTypeDetails(pcId)
        .subscribe({
          next:(result: any) => {
            if (result != null && result.length > 0) {
              this.customPortfolioGroupList = result;
            } else
              this.customPortfolioGroupList = [];
          }, error:(_error) => {
            this.customPortfolioGroupList = [];
          }});
    } else
      this.customPortfolioGroupList = [];
  }
  
  getPortfolioCompanies() {
    if (this.id != undefined) {

      this.loading = true;
      //get portfolio company details by id
      this.portfolioCompanyService
        .getPortfolioCompanyById({ Value: this.id })
        .subscribe({
          next:(result) => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
              this.subPageList = resp.subPageList;
              this.CustomCommentryValues = resp.customcommentary;
              this.fieldValueList = resp?.fieldValueList?.filter(x => x.subPageID == PageConfigurationSubFeature.StaticInformation && !(this.CIFieldExclude.indexOf(x.name) > -1));
              let _businessModel = resp?.fieldValueList?.find(x => x.name == CompanyInformationConstants.BusinessDescription);
              this.commentFieldList = resp?.fieldValueList?.filter(x => x.subPageID == PageConfigurationSubFeature.Commentary);
              this.commentFieldList.forEach(function (value, key) {
                value.isEdit = false;
                value.activeAccordion = key == 0 ? true : false;
              });
              this.investmentProfessionFieldList = this.sortByKey(resp.fieldValueList, "sequence")?.filter(x => x.subPageID == PageConfigurationSubFeature.InvestmentProfessionals);
              this.geographicLocationFieldList = this.sortByKey(resp.fieldValueList, "sequence").filter(x => x.subPageID == PageConfigurationSubFeature.GeographicLocations);
              if (_businessModel) {
                this.businessModel = {
                  Name: _businessModel?.name,
                  DisplayName: _businessModel?.displayName,
                  Value: _businessModel?.value,
                  IsActive: _businessModel?.isActive || false
                };

              }
              let _companyLogo = resp.fieldValueList.find(x => x.name == CompanyInformationConstants.CompanyLogo);
              if (_companyLogo) {
                this.companyLogoModel = {
                  Name: _companyLogo?.name,
                  DisplayName: _companyLogo?.displayName,
                  Value: _companyLogo?.value,
                  IsActive: _companyLogo?.isActive || false
                }
              }
              let _companyStatus = resp.fieldValueList.find(x => x.name == CompanyInformationConstants.CompanyStatus);
              if (_companyStatus) {
                this.companyStatusModel = {
                  Name: _companyStatus?.name,
                  DisplayName: _companyStatus?.displayName,
                  Value: this.transform(_companyStatus?.value),
                  IsActive: _companyStatus?.isActive || false
                }
              }
              this.model = resp.companyDetails;
              this.fundDetail = resp?.companyDetails?.fundDetail;
              this.dealDetail = resp?.companyDetails?.dealDetail;
              this.model.moduleId = this.tabList[0]!=undefined ? this.tabList[0].moduleId : 0;
              localStorage.setItem("headerName", this.model.companyName);
              if (document.getElementById("HeaderNameID")) {
                this.miscService.getTitle(this.model?.companyName);
              }
              this.model.status = this.transform(this.model.status);
              this.portfolioCompanyCommentaryDetails = this.model
              this.significantEventsSection =
                this.portfolioCompanyCommentaryDetails
                  .significantEventsSectionData != null
                  ? this.portfolioCompanyCommentaryDetails
                    .significantEventsSectionData.item4
                  : "";
              this.exitPlansSection =
                this.portfolioCompanyCommentaryDetails.exitPlansSectionData !=
                  null
                  ? this.portfolioCompanyCommentaryDetails.exitPlansSectionData
                    .item4
                  : "";
              this.assessmentSection =
                this.portfolioCompanyCommentaryDetails.assessmentSectionData !=
                  null
                  ? this.portfolioCompanyCommentaryDetails.assessmentSectionData
                    .item4
                  : "";
              this.impactSection =
                this.portfolioCompanyCommentaryDetails.impactSectionData != null
                  ? this.portfolioCompanyCommentaryDetails.impactSectionData
                    .item4
                  : "";
              this.portfolioInfoSectionModel.encryptedPortfolioCompanyId = this.model.encryptedPortfolioCompanyId;
              this.portfolioInfoSectionModel.portfolioCompanyID = this.model.portfolioCompanyID;

              this.headquarterLocation = this.model.geographicLocations.filter(
                function (element: any, _index: any) {
                  return element.isHeadquarter;
                }
              )[0];
              this.reportModel.portfolioCompany = resp;
              this.portfolioProfitabilityModel.portfolioCompanyID = this.model.portfolioCompanyID;
              this.portfolioOperationalKPIModel.portfolioCompanyID = this.model.portfolioCompanyID;
              this.portfolioCompanyID = this.model.portfolioCompanyID;
              this.portfolioYear = this.portfolioCompanyCommentaryDetails.impactSectionData != null ? this.portfolioCompanyCommentaryDetails.impactSectionData.item2 : "";
              this.portfolioQuater = this.portfolioCompanyCommentaryDetails.impactSectionData != null ? this.portfolioCompanyCommentaryDetails.impactSectionData.item3 : "";
              this.getCompanyWiseOperationalKPIs();
              this.getFinancialKPIs();
              this.getInvestmentKPIs();
            } else {
              if (resp.status != null && resp.status.message != "") {
                this.message = this.miscService.showAlertMessages(
                  "error",
                  resp.status.message
                );
              }
            }
            this.portfolioCompanyService
              .getPortfolioCompanyCommentarySections({
                encryptedPortfolioCompanyId: this.id,
                quarter: "",
                year: 0,  
              })
              .subscribe({
                next:(result) => {
                  let resp = result;
                  if (resp != null) {
                    this.portfolioCompanyCommentaryDetails = resp.result;
                    this.CustomCommentryValues=resp?.customcommentary||[];
                     let today = new Date();
                     let  quarterName = "Q" + Math.floor((today.getMonth() + 3) / 3) ;
                     let year = today.getFullYear();
                     if(this.portfolioCompanyCommentaryDetails == null)
                    {
                      year =  this.CustomCommentryValues.length>0 ? this.CustomCommentryValues[0].year:year;
                      quarterName =  this.CustomCommentryValues.length>0 ? this.CustomCommentryValues[0].quarter:quarterName;
                    }
                    else{
                      year = this.portfolioCompanyCommentaryDetails.year;
                      quarterName =  this.portfolioCompanyCommentaryDetails.quarter;
                    }
                    this.YearQuarter = `${quarterName} ${year}`;
                    let temp = (this.commentFieldList || []).map(x => {
                      x.value = '';
                      if (x.name == CompanyInformationConstants.SignificantEvents) {
                        x.value = (this.portfolioCompanyCommentaryDetails?.significantEventsSection || '');
                      }
                      if (x.name == CompanyInformationConstants.AssessmentPlan) {
                        x.value = (this.portfolioCompanyCommentaryDetails?.assessmentSection || '');
                      }
                      if (x.name == CompanyInformationConstants.ExitPlan) {
                        x.value = (this.portfolioCompanyCommentaryDetails?.exitPlansSection || '');
                      }
                      if (x.name == CompanyInformationConstants.ImpactHighlights) {
                        x.value = (this.portfolioCompanyCommentaryDetails?.impactSection || '');
                      }
                      if (x.name == CompanyInformationConstants.Customfield) {
                           const customValue = this.CustomCommentryValues.filter(y => y.fieldID == x.fieldID).map(obj => obj.value);               
                            x.value = customValue.length > 0 ? customValue[0] :'';
                         }
                      return x;
                    });
                    this.commentFieldList = [...temp];
                    this._commentFieldList = JSON.parse(JSON.stringify(temp));
                  } else {
                    this.portfolioCompanyCommentaryDetails = null;
                  }
                },
                error:(error) => {
                }
          });
            this.loading = false;
          },
          error:(_error) => {
            this.loading = false;
          }
    });
    }
  }
  getuploadedfiles() {
    this.uploadedfiles = [];
    let path2 = this.portfolioCompanyID + "&" + this.portfolioYear + "&" + this.portfolioQuater;
    this.portfolioCompanyService.getfinaluploadfiles(path2).subscribe((Response: any) => {
      if ((Response.length || []) > 0) {
        Response.forEach(element => {
          let obj = <any>{}
          obj.key = element.key;
          obj.value = element.value;
          this.uploadedfiles.push(obj);
        });
      }

    });
  }
  getFYEnd(value) {
    if (value != null && value.split(' ').length > 3) {
      return value.split(' ')[3];
    } else
      return value;
  }
  getCompanyWiseOperationalKPIs() {
    this.miscService
      .GetCompanywiseOperationalKPIList(this.model.portfolioCompanyID)
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK" && resp.length != 0) {
            this.sectorWiseOperationalKPIs = resp;
            let OperationalKPI = this.sectorWiseOperationalKPIs;
            this.ddlModel.operationalKPIList = OperationalKPI;
            this.ddlModel.selectedOperationalKPI = OperationalKPI[0];
            OperationalKPI[0].sector = null;
            this.reportModel.sectorwiseOperationalKPIs = [OperationalKPI[0]];
          } else {
            if (result.message != "" && result.message != null) {
              this.message = this.miscService.showAlertMessages(
                "error",
                result.message
              );
            }
          }
          this.loading = false;
        },
        error:(_error) => {
          this.loading = false;
        }
  });
  }

  getFinancialKPIs() {
    ;
    this.miscService.GetFinancialKPIList().subscribe({
      next:(result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.financialKPIs = resp;
          let financialKPI = this.financialKPIs;
          (this.ddlModel.financialKPIList = financialKPI);
          (this.ddlModel.selectedFinancialKPI = financialKPI[0]);
        } else {
          if (result.message != null && result.message != "") {
            this.message = this.miscService.showAlertMessages(
              "error",
              resp.message
            );
          }
        }
        this.loading = false;
      },
      error:(_error) => {
        this.loading = false;
      }
  });
  }

  getInvestmentKPIs() {
    let KPIQueryModel = {
      portfolioCompanyIds: this.model.portfolioCompanyID?.toString(),
      kpiType: "Investment",
    };
    this.miscService.GetCompanyOrInvestmentKPIList(KPIQueryModel).subscribe({
      next:(result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.investmentKPIs = resp;
          let investmentKPIs = this.investmentKPIs;
          this.ddlModel.investmentKPIList = investmentKPIs;
          this.ddlModel.selectedInvestmentKPI = investmentKPIs[0];
        } else {
          if (result.message != null && result.message != "") {
            this.message = this.miscService.showAlertMessages(
              "error",
              resp.message
            );
          }
        }
        this.loading = false;
      },
      error:(_error) => {
        this.loading = false;
      }
  });
  }


  onFinancialKPIChange() {
  }




  CheckIfNoDataInReport() {
    if (this.reportData != null && this.reportData.length > 0) {
      let availableDataReports = this.reportData.filter(function (data: any) {
        return data.Results != null && data.Results.length > 0;
      });
      if (availableDataReports.length == 0) {
        this.reportService.setDataAvailabilityInReport(false);
      } else {
        this.reportService.setDataAvailabilityInReport(true);
      }
    } else {
      this.reportService.setDataAvailabilityInReport(false);
    }
  }

  getPortfolioProfitabilityRecords(event: any) {

    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.profitabilityMultiSortMeta,
        sortOrder: -1,
      };
    }

    this.blockedProfitabilityTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyProfitabilityList({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: this.searchFilterkpi,
      })
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.portfolioProfitabilityList =
              resp.portfolioCompanyProfitabilityList;
            this.portfolioCompanyProfitabilityClone = JSON.parse(
              JSON.stringify(this.portfolioProfitabilityList)
            );
            this.totalProfitabilityRecords = resp.totalRecords;
          }
          this.blockedProfitabilityTable = false;
        },
        error:(_error) => {
          this.blockedProfitabilityTable = false;
        }
  });
  }

  convertProfitabilityValueUnits() {
    setTimeout(
      function (local: any) {
        local.portfolioProfitabilityList = [];
        local.portfolioCompanyProfitabilityClone.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          switch (local.profitabilityValueUnit.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              valueClone.ebitda = (valueClone.ebitda / 1000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Millions:
              valueClone.ebitda = (valueClone.ebitda / 1000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Billions:
              valueClone.ebitda = (valueClone.ebitda / 1000000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000000).toFixed(2);
              break;
          }
          local.portfolioProfitabilityList.push(valueClone);
        });
      },
      10,
      this
    );
  }

  colsOperationalKPI: any[] = [
    { field: "fullQuarter", header: "Quarter", sortField: "year-quarter" },
  ];
  getPortfolioCompanyOperationalKPIValues(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.operationalKPIMultiSortMeta,
        sortOrder: -1,
      };
    }

    this.blockedCompanyOperationalKPIValuesTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyOperationalKPIValuesTranpose({
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
      })
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            //TODO: need to work ds
            this.LoadPortfolioCompanyOperationalKPIValuesData(resp);
            this.totalCompanyOperationalKPIValuesRecords = resp.totalRecords;
          }
          this.blockedCompanyOperationalKPIValuesTable = false;
        },
        error:(_error) => {
          this.blockedCompanyOperationalKPIValuesTable = false;
        }
  });
  }

  LoadPortfolioCompanyOperationalKPIValuesData(response: any) {
    let arrData: any[];
    this.portfolioCompanyOperationalKPIValuesDataTable = [];

    this.portfolioCompanyOperationalKPIValuesList =
      response.portfolioCompanyOperationalKPIQuarterList;
    arrData = response.portfolioCompanyOperationalKPIQuarterDataTable;
    if (response.totalRecords > 0) {
      let colKey: any[] = Object.keys(arrData[0]);
      this.portfolioCompanyOperationalKPIValuesListCol = [];
      for (let index = 0; index < colKey.length; index++) {
        if (String(colKey[index]).toLowerCase() != "kpi info") {
          let styleClass = "";
          let strType = "";
          if (String(colKey[index]).toLowerCase().indexOf("kpi") >= 0) {
            styleClass = "table-data-left opKpiTable";
            strType = "string";
          } else {
            styleClass = "table-data-right";
            strType = "number";
          }
          this.portfolioCompanyOperationalKPIValuesListCol.push({
            field: colKey[index],
            header: String(colKey[index]).toUpperCase(),
            styleClass: styleClass,
            type: strType,
          });
        }
      }
      this.portfolioCompanyOperationalKPIValuesDataTable = arrData;
    }
  }

  loadOperationalKPILazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyOperationalKPIValues(event);
  }

  loadProfitabilityLazy(event: LazyLoadEvent) {
    ;
    this.getPortfolioProfitabilityRecords(event);
  }
  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  open(profitabilityModel: any) {
    ;
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    let copy = JSON.parse(JSON.stringify(profitabilityModel));
    this.currentModelRef = this.modalService.open(
      SavePortfolioProfitabilityComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.profitabilityList = this.portfolioProfitabilityList;
    this.currentModelRef.componentInstance.masterModel = this.portfolioProfitabilityModel;
    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {

      this.close(status);
    });
  }

  close(status: any) {
    this.getPortfolioProfitabilityRecords(null);
    this.currentModelRef.close();

    this.message = this.miscService.showAlertMessages(
      "success",
      status.message
    );
  }

  openKPIDialog(dr: any, bNew: boolean) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;

    let kpiModel: any = {};
    if (bNew) {
      //New one
      kpiModel = dr;
    } else {
      for (
        let index = 0;
        index < this.portfolioCompanyOperationalKPIValuesList.length;
        index++
      ) {
        let tempKPIValue: any[] = this.portfolioCompanyOperationalKPIValuesList[
          index
        ]["portfolioCompanyOperationalKPIValues"];
        for (let index1 = 0; index1 < tempKPIValue.length; index1++) {
          let tempSector: any =
            tempKPIValue[index1]["sectorwiseOperationalKPI"];
          if (tempSector["kpi"] == dr["kpi"]) {
            kpiModel = this.portfolioCompanyOperationalKPIValuesList[index];
          }
        }
      }
    }
    let copy = JSON.parse(JSON.stringify(kpiModel));
    this.currentModelRef = this.modalService.open(
      SavePortfolioOperationalKPIComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.sectorwiseOperationalKPIList = this.sectorWiseOperationalKPIs;
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.companyOperationalKPIList = this.portfolioCompanyOperationalKPIValuesList;

    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.closeKPIDialog(status);
    });
  }

  closeKPIDialog(status: any) {
    this.getPortfolioCompanyOperationalKPIValues(null);
    this.currentModelRef.close();

    this.message = this.miscService.showAlertMessages(
      "success",
      status.message
    );
  }

  globalFilter: string = "";
  exportProfitabilityKeyValues() {
    let event = {
      first: 0,
      rows: 10,
      globalFilter: this.globalFilter,
      sortField: "year-quarter",
      multiSortMeta: this.profitabilityMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportProfitabilityList({
        exportType: "key",
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
      })
      .subscribe({
        next:(response) => {
          this.miscService.downloadExcelFile(response);
        },
        error:(_error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
        );
        }
  });
  }
  exportProfitabilityDetails() {
    let event = {
      first: 0,
      rows: 10,
      globalFilter: this.globalFilter,
      sortField: "year-quarter",
      multiSortMeta: this.profitabilityMultiSortMeta,
      sortOrder: -1,
    };

    this.portfolioCompanyService
      .exportProfitabilityList({
        exportType: "details",
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
      })
      .subscribe({
        next:(response) => {
          this.miscService.downloadExcelFile(response);
        },
        error:(_error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
  });
  }

  /***************Investment KPI*************[Start]******************/
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  objInvestmentKPIList: any = [];
  investmentKPICols: any = [];
  modelInvestmentKpi: any = {};
  portfolioCompanyInvestmentKPIValuesList: any[];
  portfolioCompanyInvestmentKPIValuesListClone: any[];
  financialKpiSearchFilter: any;
  expandedInvestmentKPIs: any[] = [];
  totalCompanyInvestmentKPIValuesRecords: number;
  financialPeriodErrorMessage: string = "";

  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  loadFinancialKPILazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyInvestmentKPIValues(event, null);
  }
  convertInvestmentKPIValueUnits() {
    let financialValueUnitTable = this.investmentKpiValueUnit;
    let portfolioCompanyInvestmentKPIValuesListlocal = [];
    this.portfolioCompanyInvestmentKPIValuesList = [];
    this.portfolioCompanyInvestmentKPIValuesListClone?.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiActualValue != "" &&
        valueClone.kpiActualValue != null
      ) {
        switch (Number(financialValueUnitTable.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000
                : valueClone.kpiActualValue;
            break;
          case FinancialValueUnitsEnum.Millions:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000000
                : valueClone.kpiActualValue;
            break;
          case FinancialValueUnitsEnum.Billions:
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue))
                ? valueClone.kpiActualValue / 1000000000
                : valueClone.kpiActualValue;
            break;
        }
      }
      portfolioCompanyInvestmentKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyInvestmentKPIValuesList = portfolioCompanyInvestmentKPIValuesListlocal;
    this.createInvestmentKPILayOut(
      this.portfolioCompanyInvestmentKPIValuesList
    );
    this.portfolioCompanyInvestmentKPIValuesList.forEach(function (item) {
      item.fullMonth = item.quarter + " " + item.year;
    });
  }
  getPortfolioCompanyInvestmentKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "FinancialKPI.KPI",
        multiSortMeta: this.financialKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelInvestmentKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
            { field: "year", order: 1 },
            { field: "quarter", order: 1 },
          ]
          : [
            { field: "year", order: -1 },
            { field: "quarter", order: -1 },
          ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelInvestmentKpi.periodType.type,
      };

      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.startPeriod.getFullYear(),
            this.modelInvestmentKpi.startPeriod.getMonth(),
            this.modelInvestmentKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.endPeriod.getFullYear(),
            this.modelInvestmentKpi.endPeriod.getMonth(),
            this.modelInvestmentKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.financialKpiSearchFilter = searchFilter;

    this.portfolioCompanyService
      .getPortfolioCompanyInvestmentKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe({
        next:(result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyInvestmentKPIValuesList =
              resp.body.pcInvestmentKPIQuarterlyValueList;

            this.portfolioCompanyInvestmentKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyInvestmentKPIValuesList)
            );
            this.convertInvestmentKPIValueUnits();

            this.expandedInvestmentKPIs = [];
            if (this.portfolioCompanyInvestmentKPIValuesList.length > 0) {
              this.expandedInvestmentKPIs.push(
                this.portfolioCompanyInvestmentKPIValuesList[0]
              );
            }
            this.totalCompanyInvestmentKPIValuesRecords =
              resp.body.totalRecords;
          } else {
            this.portfolioCompanyInvestmentKPIValuesList = [];
            this.totalCompanyInvestmentKPIValuesRecords = 0;
            this.createInvestmentKPILayOut(
              this.portfolioCompanyInvestmentKPIValuesList
            );
          }
        },
        error:(_error) => {
        }
  });
  }
  createInvestmentKPILayOut(kpiModel: any) {
    this.objInvestmentKPIList = [];
    this.objInvestmentKPIList.cols = [];
    this.objInvestmentKPIList.Results = [];
    let local = this;
    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let quarter = data.quarter;
      if (local.objInvestmentKPIList.cols.length == 0) {
        local.objInvestmentKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      let kpiIndex = -1;
      local.objInvestmentKPIList.Results.every(function (
        elem: any,
        index: any
      ) {
        let kpiName = data.investmentKPI.kpi;
        let kpiNameWithInfo = data.investmentKPI.kpi;
        if (data.kpiInfo != null && data.kpiInfo != "") {
          kpiNameWithInfo = kpiName + " (" + data.kpiInfo + ")";
        }
        if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
          kpiIndex = index;
          return false;
        }
        return true;
      });

      if (kpiIndex == -1) {
        if (data.kpiInfo != null && data.kpiInfo != "") {
          objKPI["KPI"] = data.investmentKPI.kpi; 
          objKPI["KPIWithInfo"] =
            data.investmentKPI.kpi + " (" + data.kpiInfo + ")";
        } else {
          objKPI["KPI"] = data.investmentKPI.kpi;
          objKPI["KPIWithInfo"] = data.investmentKPI.kpi;
        }
        objKPI["KpiId"] = data.investmentKPI.investmentKPIId;
        objKPI["KpiInfo"] = data.kpiInfo;
      }
      let list = local.objInvestmentKPIList.cols.filter(function (val: any) {
        return val.field == quarter + " " + data.year;
      });
      if (list == null || list.length == 0) {
        local.objInvestmentKPIList.cols.push({
          field: quarter + " " + data.year,
          header: quarter + " " + data.year,
        });
      }
      if (kpiIndex >= 0) {
        local.objInvestmentKPIList.Results[kpiIndex][
          quarter + " " + data.year
        ] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
              ? data.kpiActualValue
              : data.kpiActualValue / 100; //add % symbol for percnatge value
      } else {
        objKPI[quarter + " " + data.year] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
              ? data.kpiActualValue
              : data.kpiActualValue / 100; //add % symbol for percnatge value
        local.objInvestmentKPIList.Results.push(objKPI);
      }
    });

    this.objInvestmentKPIList.cols.splice(0, 1);
    this.investmentKPICols.push.apply(this.investmentKPICols, this.frozenCols);
    this.investmentKPICols.push.apply(
      this.investmentKPICols,
      this.objInvestmentKPIList.cols
    );
  }

  /***************Investment KPI*************[End]******************/
  /***************Company KPI*************[Start]******************/

  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelCompanyKpi: any = {};
  portfolioCompanyCompanyKPIValuesList: any[];
  portfolioCompanyCompanyKPIValuesListClone: any[];
  companyValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  companyKpiSearchFilter: any;
  expandedCompanyKPIs: any[] = [];
  totalCompanyCompanyKPIValuesRecords: number;
  companyPeriodErrorMessage: string = "";

  companywiseKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  convertCompanyKPIValueUnits() {
    let companyValueUnitTable = this.companyKpiValueUnit;
    let portfolioCompanyKPIValuesListlocal = [];
    this.portfolioCompanyCompanyKPIValuesList = [];
    this.portfolioCompanyCompanyKPIValuesListClone?.forEach(function (
      value: any
    ) {
      let childPCCompanyKPIMonthlyValueListLocal = [];
      let valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcCompanyKPIMonthlyValueModel != null) {
        if (
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "%" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "x" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "#" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != null
        ) {
          switch (Number(companyValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
          }
        }
      }
      portfolioCompanyKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyCompanyKPIValuesList = portfolioCompanyKPIValuesListlocal;
    this.createCompanyKPILayOut(this.portfolioCompanyCompanyKPIValuesList);
    this.portfolioCompanyCompanyKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item.pcCompanyKPIMonthlyValueModel.month +
        " " +
        item.pcCompanyKPIMonthlyValueModel.year;
    });
  }
  getPCCompanyKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "CompanywiseKPI.KPI",
        multiSortMeta: this.companywiseKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelCompanyKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
            { field: "year", order: 1 },
            { field: "month", order: 1 },
          ]
          : [
            { field: "year", order: -1 },
            { field: "month", order: -1 },
          ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelCompanyKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.startPeriod.getFullYear(),
            this.modelCompanyKpi.startPeriod.getMonth(),
            this.modelCompanyKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.endPeriod.getFullYear(),
            this.modelCompanyKpi.endPeriod.getMonth(),
            this.modelCompanyKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.companyKpiSearchFilter = searchFilter;
    this.portfolioCompanyService
      .getPCCompanyKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe({
        next:(result) => {
          let resp = result; 
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyCompanyKPIValuesList = resp.body;
            this.portfolioCompanyCompanyKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyCompanyKPIValuesList)
            );
            this.convertCompanyKPIValueUnits();
            this.expandedCompanyKPIs = [];
            if (this.portfolioCompanyCompanyKPIValuesList.length > 0) {
              this.expandedCompanyKPIs.push(
                this.portfolioCompanyCompanyKPIValuesList[0]
              );
            }
            this.totalCompanyCompanyKPIValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyCompanyKPIValuesList = [];
            this.totalCompanyCompanyKPIValuesRecords = 0;
            this.createCompanyKPILayOut(
              this.portfolioCompanyCompanyKPIValuesList
            );
          }
        },
        error:(_error) => {
        }
  });
  }
  createCompanyKPILayOut(kpiModel: any) {
    this.objCompanyKPIList = [];
    this.objCompanyKPIList.cols = [];
    this.objCompanyKPIList.Results = [];

    let local = this;
    //to check the headers for CAB only
    if (this.model.portfolioCompanyID != 2) {
      kpiModel.forEach(function (ele: any) {
        if (ele.pcCompanyKPIMonthlyValueModel.portfolioCompanyID != 2) {
          ele.pcCompanyKPIMonthlyValueModel.segmentType = "";
        }
      });
    }
    let noSegmentKPIModel = kpiModel.filter(function (data: any) {
      return (
        data.pcCompanyKPIMonthlyValueModel.segmentType == "" ||
        data.pcCompanyKPIMonthlyValueModel.segmentType == undefined
      );
    });

    // This function is created to get all the month and years for the column name
    //without making any changes in old logic
    this.createColumnForCompanyKPI(noSegmentKPIModel);

    noSegmentKPIModel.forEach(function (data: any) {
      let objKPI: any = {};
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let child = data.childPCCompanyKPIMonthlyValueList;
      let dataKPIInfo =
        parent.kpiInfo === "$"
          ? local.model.reportingCurrencyDetail.currencyCode
          : parent.kpiInfo;
      //for parent
      if (parent.kpi != "") {
        let month = local.miscService.getMonthName(parent.month);

        let kpiIndex = -1;
        local.objCompanyKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.kpi;
          let kpiNameWithInfo = parent.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiNameWithInfo = kpiName + " (" + dataKPIInfo + ")";
          }
          if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.kpi; 
            objKPI["KPIWithInfo"] = parent.kpi + " (" + dataKPIInfo + ")";
          } else {
            objKPI["KPI"] = parent.kpi;
            objKPI["KPIWithInfo"] = parent.kpi;
          }
          objKPI["KpiId"] = parent.companyKPIID;
        }
        if (month != undefined) {
          let list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objCompanyKPIList.Results[kpiIndex][
              month + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                  ? parent.kpiActualValue / 100
                  : parent.kpiActualValue; //add % symbol for percnatge value
            local.objCompanyKPIList.Results[kpiIndex][
              "(Budget) " + month + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiBudgetValue
                : parent.kpiBudgetValue != null
                  ? parent.kpiBudgetValue / 100
                  : parent.kpiBudgetValue;
          } else {
            objKPI[month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                  ? parent.kpiActualValue / 100
                  : parent.kpiActualValue; //add % symbol for percnatge value
            objKPI["(Budget) " + month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiBudgetValue
                : parent.kpiBudgetValue != null
                  ? parent.kpiBudgetValue / 100
                  : parent.kpiBudgetValue;
            local.objCompanyKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objCompanyKPIList.Results.push(objKPI);
          }
        }
      }
      //child
      if (child.length > 0) {
        child.forEach(function (childData: any) {
          let month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          let childKpiIndex = -1;
          let childDataKpiInfo =
            childData.kpiInfo === "$"
              ? local.model.reportingCurrencyDetail.currencyCode
              : childData.kpiInfo;
          local.objCompanyKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.kpi;
            let kpiNameWithInfo = childData.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiName = "  - " + kpiName; 
              kpiNameWithInfo =
                "  - " + kpiName + " (" + childDataKpiInfo + ")";
            } else {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo = "  - " + kpiName;
            }
            if (
              elem.KPI == kpiName &&
              elem.ParentKPI == childData.parentKPIID &&
              elem.KPIWithInfo === kpiNameWithInfo
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "  - " + childData.kpi;     
              objKPI["KPIWithInfo"] =
                "  - " + childData.kpi + " (" + childDataKpiInfo + ")";
            } else {
              objKPI["KPI"] = "  - " + childData.kpi;
              objKPI["KPIWithInfo"] = "  - " + childData.kpi;
            }
            objKPI["ParentKPI"] = childData.parentKPIID;
            objKPI["KpiId"] = childData.companyKPIID;
          }
          let list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objCompanyKPIList.Results[childKpiIndex][
              month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                  ? childData.kpiActualValue / 100
                  : childData.kpiActualValue; //add % symbol for percnatge value//childData.kpiValue;
            local.objCompanyKPIList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                  ? childData.kpiBudgetValue / 100
                  : childData.kpiBudgetValue;
          } else {
            objKPI[month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                  ? childData.kpiActualValue / 100
                  : childData.kpiActualValue; //add % symbol for percnatge value//childData.kpiValue;
            objKPI["(Budget) " + month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                  ? childData.kpiBudgetValue / 100
                  : childData.kpiBudgetValue;
            local.objCompanyKPIList.Results.push(objKPI);
          }
        });
      }
    });

    local.objCompanyKPIList.cols = local.objCompanyKPIList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    noSegmentKPIModel.forEach(function (data: any) {
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let month = local.miscService.getMonthName(parent.month);
      let list = local.objCompanyKPIList.cols.filter(function (val: any) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objCompanyKPIList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year,
        });
      }
    });

    this.objCompanyKPIList.cols.splice(0, 1);
    this.companyKPICols.push.apply(this.companyKPICols, this.frozenCols);
    this.companyKPICols.push.apply(
      this.companyKPICols,
      this.objCompanyKPIList.cols
    );
  }
  createColumnForCompanyKPI(kpiModel: any) {
    let local = this;
    kpiModel.forEach(function (data: any) {
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let month = local.miscService.getMonthName(parent.month);
      if (local.objCompanyKPIList.cols.length == 0) {
        local.objCompanyKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (month != undefined) {
        let list = local.objCompanyKPIList.cols.filter(function (val: any) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objCompanyKPIList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year,
          });
          local.objCompanyKPIList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year,
          });
        }
      }
    });
  }

  /***************Company KPI*************[End]******************/
  /***************Impact KPI*************[Start]******************/

  objImpactKPIList: any = [];
  impactKPICols: any = [];
  modelImpactKpi: any = {};
  portfolioCompanyImpactKPIValuesList: any[];
  portfolioCompanyImpactKPIValuesListClone: any[];
  impactValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  impactKpiSearchFilter: any;
  expandedImpactKPIs: any[] = [];
  totalCompanyImpactKPIValuesRecords: number;

  impactKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  convertImpactKPIValueUnits() {
    let impactValueUnitTable = this.impactKpiValueUnit;
    let portfolioCompanyImpactKPIValuesListlocal = [];

    this.portfolioCompanyImpactKPIValuesList = [];
    this.portfolioCompanyImpactKPIValuesListClone?.forEach(function (
      value: any
    ) {
      let childPCImpactKPIQuarterlyValueModelListLocal = [];
      let valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcImpactKPIQuarterlyValueModel != null) {
        if (
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "%" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "x" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "#" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != null
        ) {
          switch (Number(impactValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
          }
        }
      }
      portfolioCompanyImpactKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyImpactKPIValuesList = portfolioCompanyImpactKPIValuesListlocal;
    this.createImpactKPILayOut(this.portfolioCompanyImpactKPIValuesList);
    this.portfolioCompanyImpactKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item.pcImpactKPIQuarterlyValueModel.quarter +
        " " +
        item.pcImpactKPIQuarterlyValueModel.year;
    });
  }

  getPortfolioCompanyImpactKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "ImpactKPI.KPI",
        multiSortMeta: this.impactKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelImpactKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
            { field: "year", order: 1 },
            { field: "quarter", order: 1 },
          ]
          : [
            { field: "year", order: -1 },
            { field: "quarter", order: -1 },
          ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelImpactKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.startPeriod.getFullYear(),
            this.modelImpactKpi.startPeriod.getMonth(),
            this.modelImpactKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.endPeriod.getFullYear(),
            this.modelImpactKpi.endPeriod.getMonth(),
            this.modelImpactKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.impactKpiSearchFilter = searchFilter;
    this.portfolioCompanyService
      .getPortfolioCompanyImpactKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe({
        next:(result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyImpactKPIValuesList = resp.body;
            this.portfolioCompanyImpactKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyImpactKPIValuesList)
            );
            this.convertImpactKPIValueUnits();

            this.expandedImpactKPIs = [];
            if (this.portfolioCompanyImpactKPIValuesList.length > 0) {
              this.expandedImpactKPIs.push(
                this.portfolioCompanyImpactKPIValuesList[0]
              );
            }
            this.totalCompanyImpactKPIValuesRecords = resp.body.totalRecords;
          } else {
            this.portfolioCompanyImpactKPIValuesList = [];
            this.totalCompanyImpactKPIValuesRecords = 0;
            this.createImpactKPILayOut(
              this.portfolioCompanyImpactKPIValuesList
            );
          }
        },
        error:(_error) => {
        }
  });
  }
  createImpactKPILayOut(kpiModel: any) {
    this.objImpactKPIList = [];
    this.objImpactKPIList.cols = [];
    this.objImpactKPIList.Results = [];
    let local = this;
    // This function is created to get all the month and years for the column name
    //without making any changes in old logic
    this.createColumnForImpactKPI(kpiModel);
    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let parent = data.pcImpactKPIQuarterlyValueModel;
      let child = data.childPCImpactKPIQuarterlyValueModelList;
      //for parent
      if (parent.impactKPI.kpi != "") {
        let quarter = parent.quarter;

        let kpiIndex = -1;
        local.objImpactKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.impactKPI.kpi;
          let kpiNameWithInfo = parent.impactKPI.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiNameWithInfo = kpiName + " (" + parent.kpiInfo + ")";
          }
          if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.impactKPI.kpi;
            objKPI["KPIWithInfo"] =
              parent.impactKPI.kpi + " (" + parent.kpiInfo + ")";
          } else {
            objKPI["KPI"] = parent.impactKPI.kpi;
            objKPI["KPIWithInfo"] = parent.impactKPI.kpi;
          }
          objKPI["KpiId"] = parent.impactKPI.impactKPIId;
          objKPI["IsParent"] = parent.impactKPI.isParent;
        }
        if (quarter != undefined) {
          let list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + parent.year,
              header: quarter + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objImpactKPIList.Results[kpiIndex][
              quarter + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100; //add % symbol for percnatge value
            // local.objImpactKPIList.Results[kpiIndex]["(Budget) " + quarter + " " + parent.year] = parent.kpiInfo != "%" ? parent.kpiBudgetValue : parent.kpiBudgetValue / 100;
          } else {
            objKPI[quarter + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100; //add % symbol for percnatge value
            //objKPI["(Budget) " + quarter + " " + parent.year] = parent.kpiInfo != "%" ? parent.kpiBudgetValue : parent.kpiBudgetValue / 100;
            local.objImpactKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objImpactKPIList.Results.push(objKPI);
          }
        }
      }
      //child
      if (child.length > 0) {
        let childCounter = 1;
        child.forEach(function (childData: any) {
          let quarter = childData.quarter;
          objKPI = {};
          let childKpiIndex = -1;
          let parentKPIIndex = -1;
          local.objImpactKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.impactKPI.kpi;
            let kpiNameWithInfo = childData.impactKPI.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo =
                "  - " + kpiNameWithInfo + " (" + childData.kpiInfo + ")";
            } else {
              kpiName = "  - " + kpiName;
              kpiNameWithInfo = "  - " + kpiNameWithInfo;
            }
            if (
              elem.KPI == kpiName &&
              elem.ParentKPI == childData.impactKPI.parentId &&
              elem.KPIWithInfo == kpiNameWithInfo
            ) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "  - " + childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] =
                "  - " +
                childData.impactKPI.kpi +
                " (" +
                childData.kpiInfo +
                ")";
            } else {
              objKPI["KPI"] = "  - " + childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] = "  - " + childData.impactKPI.kpi;
            }
            objKPI["ParentKPI"] = childData.impactKPI.parentId;
            objKPI["KpiId"] = childData.impactKPIID;
            objKPI["IsParent"] = childData.impactKPI.isParent;
          }
          let list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + childData.year,
              header: quarter + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objImpactKPIList.Results[childKpiIndex][
              quarter + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100; //add % symbol for percnatge value//childData.kpiValue;
            //local.objImpactKPIList.Results[childKpiIndex]["(Budget) " + quarter + " " + childData.year] = childData.kpiInfo != "%" ? childData.kpiBudgetValue : childData.kpiBudgetValue / 100;
          } else {
            objKPI[quarter + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100; //add % symbol for percnatge value//childData.kpiValue;
            //objKPI["(Budget) " + quarter + " " + childData.year] = childData.kpiInfo != "%" ? childData.kpiBudgetValue : childData.kpiBudgetValue / 100;

            local.objImpactKPIList.Results.forEach(function (
              elem: any,
              index: any
            ) {
              if (objKPI.ParentKPI == elem.KpiId) {
                parentKPIIndex = index;
              }
            });
            if (parentKPIIndex > -1) {
              local.objImpactKPIList.Results.splice(
                parentKPIIndex + childCounter,
                0,
                objKPI
              );
              childCounter++;
            } else {
              local.objImpactKPIList.Results.push(objKPI);
            }
          }
        });
      }
    });

    this.objImpactKPIList.cols.splice(0, 1);
    this.objImpactKPIList.cols.sort(this.sortByQuarterYear);
    this.impactKPICols.push.apply(this.impactKPICols, this.frozenCols);
    this.impactKPICols.push.apply(
      this.impactKPICols,
      this.objImpactKPIList.cols
    );
  }
  sortByQuarterYear(lhs: any, rhs: any) {
    let quarterToMonthMap = {
      Q1: 0,
      Q2: 3,
      Q3: 6,
      Q4: 9,
    };
    let lhsQuarterYear = lhs.field.split(" ");
    let rhsQuarterYear = rhs.field.split(" ");
    let lMonth = quarterToMonthMap[lhsQuarterYear[0]];
    let rMonth = quarterToMonthMap[rhsQuarterYear[0]];
    let lhsDate = new Date(lhsQuarterYear[1], lMonth);
    let rhsDate = new Date(rhsQuarterYear[1], rMonth);
    return lhsDate.getTime() - rhsDate.getTime();
  }
  // This function is created to get all the quarter and years for the column name
  createColumnForImpactKPI(kpiModel: any) {
    let local = this;
    kpiModel.forEach(function (data: any) {
      let parent = data.pcImpactKPIQuarterlyValueModel;
      let quarter = parent.quarter;
      if (local.objImpactKPIList.cols.length == 0) {
        local.objImpactKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (quarter != undefined) {
        let list = local.objImpactKPIList.cols.filter(function (val: any) {
          return val.field == quarter + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objImpactKPIList.cols.push({
            field: quarter + " " + parent.year,
            header: quarter + " " + parent.year,
          });
        }
      }
    });
  }
  /***************Impact KPI*************[End]******************/
  LPReport() {
    this.exportLoading = true;
    this.portfolioCompanyService.pdfExport({ Value: this.id }).subscribe({
      next:(results) => {
        this.miscService.downloadPDFFile(results);
        this.exportLoading = false;
      },
      error:(error) => {
        this.exportLoading = false;
        this.miscService.redirectToLogin(error);
      }
  });
  }

  exportImpactKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "ImpactKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail?.currency,
      decimaPlace: this.modelImpactKpi.decimalPlaces?.type,
      valueType: this.impactKpiValueUnit?.typeId,
    };
    this.exportImpactKPILoading = true;
    this.portfolioCompanyService
      .exportImpactKPIList({
        portfolioCompanyDetail: { companyName: this.model.companyName },
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.impactKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe({
        next:(response) => {
          this.miscService.downloadExcelFile(response);
          this.exportImpactKPILoading = false;
        },
        error:(_error) => {
          this.exportImpactKPILoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
  });
  }

  exportCompanyKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "CompanywiseKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail?.currency,
      decimaPlace: this.modelCompanyKpi.decimalPlaces?.type,
      valueType: this.companyKpiValueUnit?.typeId,
    };
    this.exportCompanyKPILoading = true;
    this.portfolioCompanyService
      .exportCompanywiseKPIList({
        portfolioCompanyDetail: this.model,
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.companyKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe({
        next:(response) => {
          this.exportCompanyKPILoading = false;
          this.miscService.downloadExcelFile(response);
        },
        error:(_error) => {
          this.exportCompanyKPILoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
  });
  }

  portfolioInfoSectionModel: any = {};
  openInfoSectionDialog(portfolioInfoSectionModel: any, sectionName: any) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    portfolioInfoSectionModel.sectionName = sectionName;
    let copy = JSON.parse(JSON.stringify(portfolioInfoSectionModel));
    this.currentModelRef = this.modalService.open(
      UpdateInfoSectionComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.sectionName = sectionName;
    this.currentModelRef.componentInstance.portfolioCompanyCommentaryDetails = this.portfolioCompanyCommentaryDetails;
    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.closeInfoSectionDialog(status);
    });
    this.currentModelRef.componentInstance.onCancel.subscribe((_status: any) => {
      this.getuploadedfiles();
    });

  }
  closeInfoSectionDialog(status: any) {
    this.getPortfolioCompanies();
    this.currentModelRef.close();
    this.toastrService.success(status.message, "", { positionClass: "toast-center-center" });
  }
  getTabList() {
    this.portfolioCompanyService.getMasterKPITabs("Portfolio").subscribe(x => {
      let tabData = x?.body?.kpiListModel;
      tabData = this.CheckIfKpiTypeHasData(tabData,KpiTypes.Company.type);
      tabData = this.CheckIfKpiTypeHasData(tabData,KpiTypes.TradingRecordsBeta.type);
      tabData = this.CheckIfKpiTypeHasData(tabData,KpiTypes.OperationalBeta.type);
      this.tabList = tabData;
   
      if ((window.location.host == "dev.beatapps.net" ||window.location.host == "localhost:4200" || window.location.host == "uat.beatapps.net" || window.location.host == "test.beatapps.net")) 
      {
        let tabList = tabData;
        if(tabData.find(x => x.name == KpiTypes.TradingRecords.name) != undefined){
          // Create a new tab object.
          const anyObj = {
            active: false,
            isFinacials: false,
            moduleId: 1,
            name: "Trading Records Beta",
            order: 100,
            tabAliasName: "Trading Records Beta",
          };
          this.tabList = [...tabList, anyObj];
  
          this.tabList = this.CheckIfKpiTypeHasData(this.tabList,KpiTypes.TradingRecordsBeta.type);
        }

        if(this.tabList.find(x => x.name == KpiTypes.Operational.name) != undefined){
        // Create a new tab object.
        const opKpi = {
          active: false,
          isFinacials: false,
          moduleId: 3,
          name: "Operational KPI Beta",
          order: 100,
          tabAliasName: "Operational KPI Beta",
        };
        this.tabList.push(opKpi);

        this.tabList = this.CheckIfKpiTypeHasData(this.tabList,KpiTypes.OperationalBeta.type);
        }

      } else{
        this.tabList=tabData;
      }
      if (this.tabList?.length > 0) {
        this.tabList[0].active = true;
        this.tabName = this.tabList[0].name;
        this.model.moduleId = this.tabList[0].moduleId;
      }
    });

  }


  private CheckIfKpiTypeHasData(tabData: any,kpiType : string) {
    let response = this.subSectionFields?.find(x => x.kpiType == kpiType);
    if (response?.kpiConfigurationData.length == 0) {
      switch(kpiType){
        case KpiTypes.Company.type:
          tabData = tabData.filter(x => x.name !== KpiTypes.Company.name);
          break;
      case KpiTypes.TradingRecordsBeta.type:
          tabData = tabData.filter(x => x.name !== KpiTypes.TradingRecordsBeta.name);
          break;
          case KpiTypes.OperationalBeta.type:
            tabData = tabData.filter(x => x.name !== KpiTypes.OperationalBeta.name);
            break;
      }
    }
    return tabData;
  }

  GetUserPermission() {
    this.isCompanyInfo = this.permissionService.checkUserPermission(this.subFeature.StaticDataBusinessDesciptionInvestmentProfessional, this.actions[this.actions.canView], this.id);
    this.isOperationalKPI = this.permissionService.checkUserPermission(this.subFeature.OperationalKPIs, this.actions[this.actions.canView], this.id);
    this.isInvestmentKPI = this.permissionService.checkUserPermission(this.subFeature.InvestmentKPIs, this.actions[this.actions.canView], this.id);
    this.isCompanyKPI = this.permissionService.checkUserPermission(this.subFeature.CompanyKPIs, this.actions[this.actions.canView], this.id);
    this.isTradingRecord = this.permissionService.checkUserPermission(this.subFeature.TradingRecords, this.actions[this.actions.canView], this.id);
    this.isCreditKPI = this.permissionService.checkUserPermission(this.subFeature.CreditKPI, this.actions[this.actions.canView], this.id);
    this.isFinancials = this.permissionService.checkUserPermission(this.subFeature.Financials, this.actions[this.actions.canView], this.id);
    this.isImpactKPI = this.permissionService.checkUserPermission(this.subFeature.ImpactKPIs, this.actions[this.actions.canView], this.id);
  }
  onTabClick(tab: ITab) {
    this.eventsSubject.next(this.searchFilterkpi);
    if (tab != null || tab != undefined) {
      this.tabName = tab.name;
    }
    this.istrade = true;
    if (this.filtercomp != undefined)
      this.filtercomp.setobjectperiodtype(this.tabName);
    if (this.tabName == "Trading Records")
      this.istrade = false;
  }
  collapsedchange(event) {
    this.collapsed = event;
  }
  selectTab(tab: ITab) {
    // deactivate all tabs
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.tabName = tab.name;
    this.model.moduleId = tab.moduleId;
  }

  QuarterYear(event: any) {
    this.YearQuarter = event.quarter + ' ' + event.year;
    this.year = event.year;
    this.quarter = event.quarter;
    this.disableConfirm = false;
    this.getPortfolioCompanyCommentarySections(this.id, this.quarter, this.year);
  }

  editCommentry($event: MouseEvent, index) {
    this.showConfirModel = false;
    $event.stopPropagation();
    this.commentFieldList[index].isEdit = true;
    this.commentFieldList[index].activeAccordion = true;
  }
 
  cancelCommentry($event: MouseEvent, index) {
    this.showConfirModel = true;
    this.commentaryModelIdx = index;
    $event.stopPropagation();
  }
  NoOnCancel($event: MouseEvent, index) {
    this.showConfirModel = false;
   
    $event.stopPropagation();
  }
  YesOn($event: MouseEvent) {   
  let index =  this.commentaryModelIdx;
   let model = this._commentFieldList[index];
   this.commentFieldList[index].value= model.value;
    this.commentFieldList[index].isEdit = false;   
    this.showConfirModel = false;
    $event.stopPropagation();
  }
  successToaster() {
    this.toastrService.success("Portfolio company commentary details entry updated Successfully", "", { positionClass: "toast-center-center" });
  }
  errorToaster() {
    this.toastrService.error("Portfolio company commentary details entry updated failed", "", { positionClass: "toast-center-center" });
  }
  saveCommentry($event: MouseEvent, index) {
    $event.stopPropagation();
    let commentSection = this.commentFieldList[index];
    commentSection.isEdit = false;
    commentSection.activeAccordion = true;
    const customValueid = this.CustomCommentryValues.filter(y => y.fieldID == commentSection.fieldID).map(obj => obj.id);
    let getData: any = {
      pageFeatureEntityId: this.model.portfolioCompanyID,
      year: this.YearQuarter.split(' ')[1],
      quarter: this.YearQuarter.split(' ')[0],
      displayName: commentSection.displayName,
      id:customValueid.length>0?customValueid[0]:0,
      name: commentSection.name,
      fieldID: commentSection.fieldID,
      Value: commentSection.value
     }
    let reqData: any = {
      portfolioCompanyId: this.model.portfolioCompanyID,
      encryptedCommentaryID: this.portfolioCompanyCommentaryDetails?.encryptedCommentaryID,
      year: this.YearQuarter.split(' ')[1],
      quarter: this.YearQuarter.split(' ')[0],
      sectionName: ""
    };
    if (commentSection.name == CompanyInformationConstants.SignificantEvents) {
      reqData = Object.assign(reqData, {
        sectionName: "SignificantEventsSection",
        significantEventsSection: commentSection.value
      });
    }
    if (commentSection.name == CompanyInformationConstants.AssessmentPlan) {
      reqData = Object.assign(reqData, {
        sectionName: "AssessmentSection",
        assessmentSection: commentSection.value
      });
    }
    if (commentSection.name == CompanyInformationConstants.ExitPlan) {
      reqData = Object.assign(reqData, {
        sectionName: "ExitPlansSection",
        exitPlansSection: commentSection.value
      });
    }
    if (commentSection.name == CompanyInformationConstants.ImpactHighlights) {
      reqData = Object.assign(reqData, {
        sectionName: "ImpactSection",
        impactSection: commentSection.value
      });
    }
    if (commentSection.name == CompanyInformationConstants.Customfield){
      reqData = Object.assign(reqData, {
        sectionName: "Customfield",
        customfield: commentSection.value 
      });
      this.portfolioCompanyService
         .saveCustomCommentary(getData)
         .subscribe(
          (data) =>{
          this.getPortfolioCompanyCommentarySections(undefined, reqData.quarter, reqData.year);
          if (data.message != null) {
            this.successToaster();
          } else {
            this.errorToaster();
          }
          this.loading = false;
        },
         )
    }
    else{
    this.portfolioCompanyService
      .saveCompanyCommentaryDetails(reqData)
      .subscribe({
        next:(data) => {
          this.getPortfolioCompanyCommentarySections(undefined, reqData.quarter, reqData.year);
          if (data.message != null) {
            this.successToaster();
          } else {
            this.errorToaster();
          }
          this.loading = false;
        },
        error:(_error) => {
          this.toastrService.error("error",
            ErrorMessage.SomethingWentWrong,
            { positionClass: "toast-center-center" });
        }
    });
      }
  }
  getPortfolioCompanyCommentarySections(
    companyId: any = undefined,
    quarterName: any = undefined,
    year: any = undefined
  ) 
  {
    companyId = companyId == undefined ? this.id : companyId;
    let today = new Date();
    quarterName = quarterName == undefined ? "Q" + Math.floor((today.getMonth() + 3) / 3) : quarterName;
    year = year == undefined ? today.getFullYear() : year;
    this.YearQuarter = `${quarterName} ${year}`;

    this.portfolioCompanyService
      .getPortfolioCompanyCommentarySections({
        encryptedPortfolioCompanyId: companyId.toString(),
        quarter: quarterName,
        year: year,
      })
      .subscribe({
        next:(result) => {
          let resp = result;
          if (resp != null) {
            this.portfolioCompanyCommentaryDetails = resp.result;
           this.CustomCommentryValues=resp?.customcommentary||[];
            let temp = (this.commentFieldList || []).map(x => {
              x.value = '';
              if (x.name == CompanyInformationConstants.SignificantEvents) {
                x.value = (this.portfolioCompanyCommentaryDetails.significantEventsSection || '');
              }
              if (x.name == CompanyInformationConstants.AssessmentPlan) {
                x.value = (this.portfolioCompanyCommentaryDetails.assessmentSection || '');
              }
              if (x.name == CompanyInformationConstants.ExitPlan) {
                x.value = (this.portfolioCompanyCommentaryDetails.exitPlansSection || '');
              }
              if (x.name == CompanyInformationConstants.ImpactHighlights) {
                x.value = (this.portfolioCompanyCommentaryDetails.impactSection || '');
              }
              if (x.name == CompanyInformationConstants.Customfield) {
                const customValue = this.CustomCommentryValues.filter(y => y.fieldID == x.fieldID).map(obj => obj.value);               
                x.value = customValue.length > 0 ? customValue[0] :'';
              }
              return x;
            });
            this.commentFieldList = [...temp];
            this._commentFieldList = JSON.parse(JSON.stringify(temp));
          } else {
            this.portfolioCompanyCommentaryDetails = null;
          }
        },
        error:(error) => {
        }
  });
  }
  onOpenAccordion(e) {
    this.commentFieldList[e.index].isEdit = false;
    this.commentFieldList[e.index].activeAccordion = true;
  }
  onCloseAccordion(e) {
    this.commentFieldList[e.index].isEdit = false;
    this.commentFieldList[e.index].activeAccordion = false;
  }

  getGetKPIPageConfigData(){
    this.portfolioCompanyService.getPageConfigSubSectionField()
      .subscribe(
        (result) => {
          this.subSectionFields = result;
          this.getTabList();
        }
      );
  }
}
