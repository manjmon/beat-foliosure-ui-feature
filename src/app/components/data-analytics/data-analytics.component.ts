import {
  AfterViewInit,
  OnInit,
  Component,
  ElementRef,
  ViewChild,
  Inject,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  SimpleChanges,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService } from "primeng/api";
import { DataAnalyticsService } from "src/app/services/data-analytics.service";
import { OidcAuthService } from "src/app/services/oidc-auth.service";
import {
  PermissionService,
  KPIModulesEnum,
  FeaturesEnum,
} from "src/app/services/permission.service";
import { DataAnalyticsConstants } from "src/app/common/constants";
import {
  InvestorSections,
  MiscellaneousService,
  InvestorSectionsIds
} from "src/app/services/miscellaneous.service";
import { DatePipe } from "@angular/common";
declare let $: any;
@Component({
  selector: "app-data-analytics",
  templateUrl: "./data-analytics.component.html",
  styleUrls: ["./data-analytics.component.scss"],
})
export class DataAnalyticsComponent implements OnInit, AfterViewInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  @ViewChild("revealView", { static: false }) el!: ElementRef;
  private revealView: any;
  collapsed = true;
  myAppUrl: string = "";
  model: any = {};
  excelFile: File;
  isLoader: boolean = false;
  accessToken: string = null;
  analyticsList = [];
  width: number = 0;
  analyticsName: string = null;
  userDetails = "User";
  DashboardId = "DashboardId";
  userPermissions: any = [];
  currentModelRef: any;
  displayModal = false;
  sideNavBaseClass: string;
  @Input() dataAnalyticsModel: any;
  @Input() dataAnalyticsUploadModel: any;
  @Input() triggerApplyEvent: boolean = false;
  defaultSelectedTab: any;
  @Output() onSaveDashboardEvent = new EventEmitter<any>();
  @ViewChild("panel", { read: ElementRef }) public panel: ElementRef<any>;
  @Input() filterAnalyticsList: any;
  enableRight: boolean = false;
  enableLeft: boolean = false;
  showLeftScroll: boolean = false;
  showRightScroll: boolean = true;
  userId: any;
  enabledtab: boolean = false;
  currentTabId: any = 0;
  @Input() tabType: null;
  revealSource: any;
  revealArgs: any;
  description: string = null;
  isPersonal: boolean = true;
  isSave: boolean = false;
  @Input() isCreateDashboard: boolean = false;
  @Input() isFileUpload: boolean = false;
  dealStaticList: any = [];
  fundStaticList: any = [];
  investorStaticList: any = [];
  fixedStaticList: any = [];
  deletePopub: boolean = false;
  deleteModalBody: string;
  primaryDeleteButtonName: string;
  secondaryDeleteButtonName: string;
  deleteModalTitle: string;
  deleteButtonEnabled: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private miscService: MiscellaneousService,
    private identityService: OidcAuthService,
    @Inject("BASE_URL") baseUrl: string,
    private authService: OidcAuthService,
    private dataAnalyticService: DataAnalyticsService,
    private confirmationService: ConfirmationService,
    private permission: PermissionService,
    private alertService: ToastrService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.model = this.dataAnalyticsModel;
    let config = this.identityService.getEnvironmentConfig();
    if (
      document.location.hostname.toLowerCase() != "localhost" &&
      config.redirect_uri != ""
    ) {
      this.myAppUrl = config.redirect_uri.split("/app")[0] + "/services";
    } else {
      this.myAppUrl = "https://localhost:5001";
    }
    localStorage.setItem("headerName", "Data Analytics");
    this.accessToken = authService.getToken();
    this.userPermissions = JSON.parse(permission.getUserPermission());
    if (this.userPermissions.length > 0) {
      this.userId = this.userPermissions[0].userID;
    }
  }
  ngOnInit(): void {
    this.deleteModalBody = DataAnalyticsConstants.deleteModalBody;
    this.primaryDeleteButtonName = DataAnalyticsConstants.primaryDeleteButtonName;
    this.secondaryDeleteButtonName = DataAnalyticsConstants.secondaryDeleteButtonName;
    this.deleteModalTitle = DataAnalyticsConstants.deleteModalTitle;
    this.getDataAnalytics();
    this.setPersonal();
  }
  setPersonal() {
    if (this.tabType == DataAnalyticsConstants.MyDashboardTabName) this.isPersonal = true;
    else this.isPersonal = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes[DataAnalyticsConstants.isCreateDashboard] && this.isCreateDashboard) {
      this.filterAnalyticsList = [];
      this.defaultSelectedTab = null;
      this.loadDashBoard(null);
    }
    if (changes[DataAnalyticsConstants.tabType]) {
      this.isCreateDashboard = false;
      this.defaultSelectedTab = null;
      this.getDataAnalytics();
      this.setPersonal();
      this.loadDashBoard(this.defaultSelectedTab?.dataSetName);
    }
    if (changes["triggerApplyEvent"]) {
      this.getStaticFieldConfiguration();
      this.loadDashBoard(this.defaultSelectedTab?.dataSetName);
      this.getFixedStaticFieldConfiguration();
    }
    if (
      this.model == undefined &&
      (this.triggerApplyEvent || changes[DataAnalyticsConstants.dataAnalyticsUploadModel])
    ) {
      this.model = this.dataAnalyticsModel;
      this.getDataSources();
    }
    if (
      (this.triggerApplyEvent && this.model !== this.dataAnalyticsModel) ||
      (this.dataAnalyticsUploadModel &&
        this.dataAnalyticsUploadModel?.length > 0)
    ) {
      this.model = this.dataAnalyticsModel;
      this.getDataSources();
    }
  }
  getDataAnalytics = () => {
    this.isLoader = true;
    this.enabledtab = false;
    this.dataAnalyticService
      .getDataAnalyticsList(this.tabType == DataAnalyticsConstants.CommonTabName? false : true)
      .subscribe((response) => {
        if (response?.length > 0) {
          this.analyticsList = response;
          this.filterAnalyticsList = [];
          if (this.analyticsList.length > 0) {
            this.filterAnalyticsList = this.analyticsList;
            this.enabledtab = true;
            if (this.filterAnalyticsList.length > 0) {
              this.filterAnalyticsListFunction();
            }
          }
          this.isLoader = false;
        } else {
          this.isLoader = false;
          this.analyticsList = [];
          this.filterAnalyticsList = [];
          this.loadDashboardByTabs();
        }
      });
  };
  isExistDashboard() {
    this.dataAnalyticService.isExistDashboard(this.analyticsName).subscribe({
      next: (response) => {
        if (response) {
          this.alertService.error(
            "A dashboard with name: " + this.analyticsName + " already exists.",
            "",
            {
              positionClass: "toast-center-center",
            }
          );
          this.isLoader = false;
        } else {
          this.displayModal = false;
          this.serializeDashboard(this.revealSource, this.revealArgs, false);
        }
      },
      error: (error) => {
        this.alertService.error(DataAnalyticsConstants.SomethingWentWrong, "", {
          positionClass: "toast-center-center",
        });
      },
    });
  }
  isExistDashboardType(args: any, isOverride: boolean) {
    this.dataAnalyticService.isExistDashboard(this.analyticsName).subscribe({
      next: (response) => {
        if (response) {
          this.alertService.error(
            "A dashboard with name: " + this.analyticsName + " already exists.",
            "",
            {
              positionClass: "toast-center-center",
            }
          );
          this.isLoader = false;
        } else {
          this.saveDashboardByName(args, isOverride);
        }
      },
      error: (error) => {
        this.alertService.error(DataAnalyticsConstants.SomethingWentWrong, "", {
          positionClass: "toast-center-center",
        });
        this.isLoader = false;
      },
    });
  }
  filterAnalyticsListFunction() {
    this.filterAnalyticsList.forEach((element: { isActive: boolean; }) => {
      element.isActive = false;
    });
    let currentTab = this.filterAnalyticsList.filter(
      (x: { id: any; }) => x.id == this.currentTabId
    );
    if (currentTab.length > 0) {
      this.defaultSelectedTab = currentTab[0];
      this.defaultSelectedTab.isActive = true;
    } else {
      this.defaultSelectedTab = this.filterAnalyticsList[0];
      this.defaultSelectedTab.isActive = true;
    }
    this.loadDashBoard(this.defaultSelectedTab.dataSetName);
  }
  loadDashBoard = (dataSetName: any) => {
    this.isLoader = true;
    if (dataSetName != undefined && dataSetName != null) {
      this.setExportSaveAsOptions();
      if (this.triggerApplyEvent && !this.isSave) {
        this.setEditMode();
      } else {
        this.revealView.canEdit = true;
        this.disableEditMode();
      }
      this.setDashboard(dataSetName);
    } else {
      this.isLoader = false;
      this.setExportSaveAsOptions();
      if (this.revealView != undefined && this.revealView != null) {
        this.revealView.dashboard = new $.ig.RVDashboard();
        if (this.triggerApplyEvent) {
          this.setEditMode();
        } else {
          this.disableEditMode();
        }
      }
    }
  };
  disableEditMode() {
    this.setEditModeByUserId();
    this.revealView.startInEditMode = false;
    if (this.triggerApplyEvent) this.revealView.canAddVisualization = true;
    else this.revealView.canAddVisualization = false;
  }
  setEditMode() {
    this.setEditModeByUserId();
    if (this.permission.checkFeaturePermission({featureId:this.tabType == DataAnalyticsConstants.CommonTabName? this.feature.Common: this.feature.MyDashboard,action: DataAnalyticsConstants.edit,})) {
      this.revealView.startInEditMode = true;
      this.revealView.canAddVisualization = true;
    } else {
      this.revealView.startInEditMode = false;
      this.revealView.canAddVisualization = false;
    }
  }
  setDashboard(dataSetName: any) {
    $.ig.RVDashboard.loadDashboard(dataSetName)
    .then((dashboard) => {
      this.revealView.dashboard = dashboard;
      this.isLoader = false;
    })
    .catch((error) => {
      this.isLoader = false;
      this.revealView.dashboard = null;
    });
  }
  reset() {
    this.analyticsName = null;
    this.description = null;
    this.isPersonal = false;
  }
  save() {
    this.isExistDashboard();
  }
  ngAfterViewInit(): void {
    this.loadDashboardByTabs();
  }
  setExportSaveAsOptions() {
    this.setDeleteButtonEnabled();
    if (!this.revealView) return;
    this.revealView.onMenuOpening = (visualization, args) => {
      const featureId =
        this.tabType === DataAnalyticsConstants.CommonTabName? this.feature.Common : this.feature.MyDashboard;
      const exportPermissionCheck = this.permission.checkFeaturePermission({
        featureId,
        action: "export",
      });
      const saveAsPermissionCheck = this.permission.checkFeaturePermission({
        featureId,
        action: "edit",
      });
      args?.menuItems.forEach((item) => {
        if ((item.title === "Export" || item.title === "Export Image" || item.title === "Export Excel") && !exportPermissionCheck) {
          item.isHidden = true;
        }
        if (( item.title === "Save As" || item.title === "Copy") && !saveAsPermissionCheck) {
          item.isHidden = true;
        }
      });
    };
  }
  setDeleteButtonEnabled() {
    this.deleteButtonEnabled = false;
    if (this.permission.checkFeaturePermission({featureId:this.tabType == DataAnalyticsConstants.CommonTabName? this.feature.Common: this.feature.MyDashboard,action: DataAnalyticsConstants.edit})) {
      this.deleteButtonEnabled = true;
    } 
  }
  loadDashboardByTabs() {
    this.isLoader = true;
    this.revealView = new $.ig.RevealView(this.el.nativeElement);
    $.ig.RevealSdkSettings.setBaseUrl(this.myAppUrl);
    $.ig.RevealSdkSettings.enableNewCharts = true;
    $.ig.RevealSdkSettings.serverSideSave = false;
    $.ig.RevealSdkSettings.setAdditionalHeadersProvider((url: string) => {
      let headers: Record<string, any> = {};
      headers["Authorization"] = this.accessToken;
      headers[this.userDetails] = this.userPermissions[0].userID;
      return headers;
    });
    this.revealView.showFilters = true;
    this.revealView.singleVisualizationMode = false;
    this.revealView.onFieldsInitializing = function(args: { useCustomSort: boolean; }){
      args.useCustomSort = true;
    };
    if (
      this.filterAnalyticsList != undefined &&
      this.filterAnalyticsList.length > 0
    ) {
      this.revealView.startInEditMode = true;
      this.revealView.canEdit = true;
      this.revealView.canAddVisualization = true;
      this.defaultSelectedTab = this.filterAnalyticsList[0];
      this.loadDashBoard(this.defaultSelectedTab.dataSetName);
    } else {
      if (this.triggerApplyEvent) {
        this.revealView.startInEditMode = true;
        this.revealView.canEdit = true;
        this.revealView.canAddVisualization = true;
      } else {
        this.revealView.startInEditMode = false;
        this.revealView.canEdit = false;
        this.revealView.canAddVisualization = false;
      }
    }
    this.revealBiOnSave();
    this.isLoader = false;
  }
  setEditModeByUserId() {
    if (this.permission.checkFeaturePermission({featureId:this.tabType == DataAnalyticsConstants.CommonTabName? this.feature.Common: this.feature.MyDashboard,action: DataAnalyticsConstants.edit})) {
      this.revealView.canEdit = true;
      this.deleteButtonEnabled = true;
    } else {
      this.revealView.canEdit = false;
    }
  }
  revealBiOnSave() {
    this.revealView.onSave = (rv: any, args: { saveAs: any; name: string; dashboardId: any; })=>{
      this.revealSource = rv;
      this.revealArgs = args;
      if (
        args.saveAs ||
        this.defaultSelectedTab?.id == undefined ||
        this.defaultSelectedTab == null ||
        this.defaultSelectedTab?.id == null ||
        this.defaultSelectedTab?.id == 0
      ) {
        this.reset();
        this.displayModal = true;
        this.setPersonal();
      } else {
        if (args.name != "" || args.name != null) {
          this.analyticsName = args.name;
        }
        args.dashboardId = args.name;
        this.serializeDashboard(rv, args, false);
      }
    };
  }
  serializeDashboard(rv: any, args: any, isOverride: boolean) {
    this.isLoader = true;
    this.isSave = true;
    let isExist: boolean = false;
    if (args.saveAs || this.defaultSelectedTab?.id == undefined) {
      this.currentTabId = 0;
    } else {
      this.currentTabId = this.defaultSelectedTab?.id;
      this.analyticsName = args.name;
      if (args.name != this.defaultSelectedTab.dataSetName)
        this.isExistDashboardType(args, isOverride);
      else this.saveDashboardByName(args, isOverride);
    }
    if (args.saveAs || this.defaultSelectedTab == null) {
      this.saveDashboardByName(args, isOverride);
    }
  }
  saveDashboardByName(args: any, isOverride: boolean) {
    this.isLoader = true;
    let dashboardId = isOverride
      ? this.defaultSelectedTab?.id
      : this.currentTabId;
    let userId = this.userPermissions[0].userID;
    args.serialize((bytes: any) => {
      let dashboard = {
        File: btoa(String.fromCharCode.apply(null, bytes)),
        DashboardId: dashboardId,
        DatasetName: this.analyticsName,
        UserId: userId,
        Description: this.description,
        isPersonal: this.isPersonal,
      };
      this.dataAnalyticService.saveDashboard(dashboard).subscribe({
        next: () => {
          this.reset();
          this.successInfo();
          this.onSaveDashboardEvent.emit(false);
            this.getDataAnalytics();
          this.isLoader = false;
        },
        error: (error) => {
          this.isLoader = false;
        },
      });
    });
  }
  saveDashBoard(args: any, isSaveAs: boolean) {
    if (isSaveAs || this.defaultSelectedTab?.id == undefined) {
      this.currentTabId = 0;
    } else {
      this.currentTabId = this.defaultSelectedTab?.id;
    }
    $.ig.RevealSdkSettings.setAdditionalHeadersProvider((url: string) => {
      let headers: Record<string, any> = {};
      headers["Authorization"] = this.accessToken;
      headers[this.userDetails] = this.userPermissions[0].userID;
      headers[this.DashboardId] = this.currentTabId;
      return headers;
    });
    args.name = this.analyticsName;
    args.saveFinished();
    this.successInfo();
    this.isLoader = true;
    setTimeout(() => {
      this.reset();
      this.getDataAnalytics();
      this.isLoader = false;
    }, 4000);
  }
  successInfo() {
    this.analyticsName = null;
    this.alertService.success("Dashboard added successfully", "", {
      positionClass: "toast-center-center",
    });
  }
  getUploadDataSource(file: any) {
    let excelDataSourceItem: { defaultRefreshRate: number; title: any; } ;
    let localFileItem = new $.ig.RVLocalFileDataSourceItem();
    localFileItem.uri = "local:/" + file.newFileName;
    excelDataSourceItem = new $.ig.RVExcelDataSourceItem(localFileItem);
    excelDataSourceItem.defaultRefreshRate = 0;
    excelDataSourceItem.title = file.oldFileName;
    return excelDataSourceItem;
  }
  getDataSources() {
    if (this.revealView != undefined)
      this.revealView.onDataSourcesRequested = (callback) => {
        let payloadDataSource = [];
        if (
          this.dataAnalyticsUploadModel &&
          this.dataAnalyticsUploadModel.length > 0
        ) {
          this.dataAnalyticsUploadModel.forEach((element) => {
            if (element.newFileName != null && element.newFileName != "") {
              payloadDataSource.push(this.getUploadDataSource(element));
            }
          });
        }
        if (
          this.validMandatoryPortfolioCompany(
            this.dataAnalyticsModel.portfolioCompanyModel
          )
        ) {
          payloadDataSource.push(this.getDataSourcePortfolioCompany());
        }
        if (this.validMandatoryDeal(this.dataAnalyticsModel.dealModel)) {
          payloadDataSource.push(this.getDataSourceDeals());
        }
        if (this.validMandatoryFund(this.dataAnalyticsModel.fundModel)) {
          payloadDataSource.push(this.getDataSourceFunds());
        }
        if (
          this.validMandatoryInvestor(this.dataAnalyticsModel.investorModel)
        ) {
          payloadDataSource.push(this.getDataSourceInvestors());
        }
        if (
          this.validMandatoryESG(
            this.dataAnalyticsModel.ESGModel
          )
        ) {
          payloadDataSource.push(this.getDataSourceESG());
        }
        callback(new $.ig.RevealDataSources([], payloadDataSource, false));
      };
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
    this.sideNavBaseClass =
      this.miscService.getSideBarWidth() == "17.3em"
        ? "dashboardview-width-with-expand"
        : "dashboardview-width-without-expand";
  }
  getDataSourceDeals() {
    const restDataSource = new $.ig.RVRESTDataSource();
    let idValue = Math.random().toString(36).substring(3);
    restDataSource.id = idValue.toString();
    restDataSource.method = DataAnalyticsConstants.PostMethod;
    restDataSource.defaultRefreshRate = 0;
    restDataSource.title = DataAnalyticsConstants.DealDetails;
    restDataSource.subtitle = DataAnalyticsConstants.SubTitle;
    restDataSource.url =
      this.myAppUrl + DataAnalyticsConstants.getDealDataSourceURL;
    restDataSource.body = JSON.stringify(this.getDealsPayload());
    restDataSource.useAnonymousAuthentication = true;
    return this.getCommonDataSourceItem(
      restDataSource,
      DataAnalyticsConstants.DealDetails,
      DataAnalyticsConstants.SubTitle,
      DataAnalyticsConstants.DealDetails
    );
  }
  getDataSourceFunds() {
    const restDataSource = new $.ig.RVRESTDataSource();
    let idValue = Math.random().toString(36).substring(3);
    restDataSource.id = idValue.toString();
    restDataSource.method = DataAnalyticsConstants.PostMethod;
    restDataSource.defaultRefreshRate = 0;
    restDataSource.title = DataAnalyticsConstants.FundDetails;
    restDataSource.subtitle = DataAnalyticsConstants.SubTitle;
    restDataSource.url =
      this.myAppUrl + DataAnalyticsConstants.getFundsDataSourceURL;
    restDataSource.body = JSON.stringify(this.getFundsPayload());
    restDataSource.useAnonymousAuthentication = true;
    return this.getCommonDataSourceItem(
      restDataSource,
      DataAnalyticsConstants.FundDetails,
      DataAnalyticsConstants.SubTitle,
      DataAnalyticsConstants.FundDetails
    );
  }
  getDataSourceInvestors() {
    const restDataSource = new $.ig.RVRESTDataSource();
    let idValue = Math.random().toString(36).substring(3);
    restDataSource.id = idValue.toString();
    restDataSource.method = DataAnalyticsConstants.PostMethod;
    restDataSource.defaultRefreshRate = 0;
    restDataSource.title = DataAnalyticsConstants.InvestorDetails;
    restDataSource.subtitle = DataAnalyticsConstants.SubTitle;
    restDataSource.url =
      this.myAppUrl + DataAnalyticsConstants.getInvestorsDataSourceURL;
    restDataSource.body = JSON.stringify(this.getInvestorPayload());
    restDataSource.useAnonymousAuthentication = true;
    return this.getCommonDataSourceItem(
      restDataSource,
      DataAnalyticsConstants.InvestorDetails,
      DataAnalyticsConstants.SubTitle,
      DataAnalyticsConstants.InvestorDetails
    );
  }
  getDataSourcePortfolioCompany() {
    const restDataSource = new $.ig.RVRESTDataSource();
    let idValue = Math.random().toString(36).substring(3);
    restDataSource.id = idValue.toString();
    restDataSource.method = DataAnalyticsConstants.PostMethod;
    restDataSource.defaultRefreshRate = 0;
    restDataSource.title = DataAnalyticsConstants.PCDetails;
    restDataSource.subtitle = DataAnalyticsConstants.SubTitle;
    restDataSource.url =
      this.myAppUrl + DataAnalyticsConstants.getPCDetailsDataSourceURL;
    restDataSource.body = JSON.stringify(this.getPCPayload());
    restDataSource.useAnonymousAuthentication = true;
    return this.getCommonDataSourceItem(
      restDataSource,
      DataAnalyticsConstants.PCDetails,
      DataAnalyticsConstants.SubTitle,
      DataAnalyticsConstants.PCDetails
    );
  }
  getDataSourceESG() {
    const restDataSource = new $.ig.RVRESTDataSource();
    let idValue = Math.random().toString(36).substring(3);
    restDataSource.id = idValue.toString();
    restDataSource.method = DataAnalyticsConstants.PostMethod;
    restDataSource.defaultRefreshRate = 0;
    restDataSource.title = DataAnalyticsConstants.ESGDetails;
    restDataSource.subtitle = DataAnalyticsConstants.SubTitle;
    restDataSource.url =
      this.myAppUrl + DataAnalyticsConstants.getESGDetailsDataSourceURL;
    restDataSource.body = JSON.stringify(this.getESGPayload());
    restDataSource.useAnonymousAuthentication = true;
    return this.getCommonDataSourceItem(
      restDataSource,
      DataAnalyticsConstants.ESGDetails,
      DataAnalyticsConstants.SubTitle,
      DataAnalyticsConstants.ESGDetails
    );
  }
  getCommonDataSourceItem(
    restDataSource: any,
    title: string,
    subtitle: string,
    type: string
  ) {
    const restDataSourceItem = new $.ig.RVRESTDataSourceItem(restDataSource);
    restDataSourceItem.id = DataAnalyticsConstants.RestDataSourceItem;
    const jsonDataSourceItem = new $.ig.RVJsonDataSourceItem(
      restDataSourceItem
    );
    jsonDataSourceItem.id = DataAnalyticsConstants.JsonDataSourceItem;
    jsonDataSourceItem.defaultRefreshRate = 0;
    jsonDataSourceItem.title = type;
    jsonDataSourceItem.subtitle = subtitle;
    jsonDataSourceItem.config = this.getCustomPayload(type);
    return jsonDataSourceItem;
  }
  getCustomPayload(type: string) {
    let StaticArray: { iterationDepth: number; columnsConfig: any[]; }
    let result = [];
    if (type == DataAnalyticsConstants.PCDetails) {
      let staticLineItem = this.getPCStaticPayload();
      result.push(...staticLineItem);
    } else if (type == DataAnalyticsConstants.DealDetails) {
      let StaticDealArray = this.getDealStaticPayload();
      result.push(...StaticDealArray);
    } else if (type == DataAnalyticsConstants.FundDetails) {
      let StaticFundArray = this.getFundStaticPayload();
      result.push(...StaticFundArray);
    } else if (type == DataAnalyticsConstants.InvestorDetails) {
      let StaticInvestorArray = this.getInvestorStaticPayload();
      result.push(...StaticInvestorArray);
    }else  if (type == DataAnalyticsConstants.ESGDetails) {
      let staticLineItem = this.getESGStaticPayload();
      result.push(...staticLineItem);
    }
    StaticArray = {
      iterationDepth: 0,
      columnsConfig: result,
    };
    return JSON.stringify(StaticArray);
  }
  getPCStaticPayload() {
    let StaticArray = [
      { key: "Period", type: 0 },
      { key: "PeriodType", type: 0 },
      { key: "PeriodDate", type: 2 },
      { key: "ValueType", type: 0 },
      { key: "KpiType", type: 0 },
      { key: "~", uniqueName: "Level 1", type: 1 },
    ];
    let DefaultArray = [];
    let returnArray = [];
    this.model.portfolioCompanyModel.kpiItems.forEach((element) => {
      const checkDuplicateKpi = (roleParam) =>
      DefaultArray.some(
        ({ key }) => key.toLowerCase() == element.kpi.toLowerCase()
      );
    if (!checkDuplicateKpi(element.kpi)) {
      if (element.kpiFieldName == null) {
        DefaultArray.push({ key: element.kpi, type: 1 });
      } else {
        DefaultArray.push({ key: element.kpi, type: 0 });
      }
    }
    });
    returnArray.push(...this.GetFixedFields(false,false), ...StaticArray, ...DefaultArray);
    return returnArray;
  }
  getESGStaticPayload() {
    let StaticArray = [
      { key: "Period", type: 0 },
      { key: "PeriodType", type: 0 },
      { key: "PeriodDate", type: 2 },
      { key: "ValueType", type: 0 },
      { key: "KpiType", type: 0 },
      { key: "~", uniqueName: "Level 1", type: 1 },
    ];
    let DefaultArray = [];
    let returnArray = [];
    this.model.ESGModel.kpiItems.forEach((element) => {
      if(DefaultArray.length > 0){  
      const checkDuplicateKpi = (roleParam) =>
      
      DefaultArray?.some(
        ({ key }) => key.toLowerCase() == element.name.toLowerCase()
      );
    if (!checkDuplicateKpi(element.name)) {
      if (element.kpiFieldName == null) {
        DefaultArray.push({ key: element.name, type: 1 });
      } else {
        DefaultArray.push({ key: element.name, type: 0 });
      }
    }
      }
    });
    returnArray.push(...this.GetFixedFields(false,false), ...StaticArray, ...DefaultArray);
    return returnArray;
  }
  getSectionId(id: string) {
    if (id == InvestorSections.InvestedFunds) return InvestorSectionsIds.InvestedFunds;
    else if (id == InvestorSections.InvestorFundDetails) return InvestorSectionsIds.InvestorFundDetails;
    else if (id == InvestorSections.CompanyPerformance) return InvestorSectionsIds.CompanyPerformance;
    else if (id == InvestorSections.InvestorCompanyDetails) return InvestorSectionsIds.InvestorCompanyDetails;
    else if (id == InvestorSections.ValuationData) return InvestorSectionsIds.ValuationData;
  }
  getInvestorStaticPayload() {
    let DynamicArray = [];
    let returnArray = [];
    let sectionId;
    let fixedArray = [];
    if (this.investorStaticList != null && this.investorStaticList.length > 0) {
      if (
        this.model?.investorModel?.investorSections?.id &&
        this.model?.investorModel?.investorSections?.id != ""
      )
        sectionId = this.getSectionId(
          this.model?.investorModel?.investorSections?.id
        );
      let investorStaticList = this.investorStaticList?.filter(
        (kpi) => kpi.subPageID == sectionId 
      );
      investorStaticList?.forEach((element1) => {
        if (DynamicArray.length > 1 && element1.name !=  DataAnalyticsConstants.InvestorName && element1.name !=  DataAnalyticsConstants.FundName
          && element1.name !=  DataAnalyticsConstants.InvestorId && element1.name !=  DataAnalyticsConstants.FundId) {
          const checkDuplicateKpi = (roleParam) =>
            DynamicArray.some(
              ({ key }) => key.toLowerCase() == element1.aliasName.toLowerCase()
            );
          if (!checkDuplicateKpi(element1.aliasName)) {
            DynamicArray.push({ key: element1.aliasName, type: 0 });
          }
        } else if(element1.name != DataAnalyticsConstants.InvestorName && element1.name !=  DataAnalyticsConstants.FundName
          && element1.name !=  DataAnalyticsConstants.InvestorId && element1.name !=  DataAnalyticsConstants.FundId) {
          DynamicArray.push({ key: element1.aliasName, type: 0 });
        }
      });
    }
    let StaticArray = [
      { key: "Period", type: 0 },
      { key: "PeriodDate", type: 2 },
    ];
    let levelArray = [{ key: "~", uniqueName: "Level 1" }];
    fixedArray = this.GetFixedFields(true,false);
    if(sectionId != InvestorSectionsIds.CompanyPerformance && sectionId != InvestorSectionsIds.InvestorCompanyDetails){
      fixedArray = fixedArray.filter(x => x.name != DataAnalyticsConstants.CompanyName);
    }
    returnArray.push(...fixedArray,...StaticArray,...levelArray,...DynamicArray);
    return returnArray;
  }
  getDealStaticPayload() {
    let returnArray = [];
    let DefaultArray =[];
    let ValuesArray = [];
    let DateArray = [];
      this.model.dealModel.kpiItems.forEach(element => {
        let  checkDuplicateKpi = (roleParam: string) => DefaultArray.some(({ key }) => key.toLowerCase() == roleParam.toLowerCase());
        let checkDuplicateValues = (roleParam: string) => ValuesArray.some(({ key }) => key.toLowerCase() == roleParam.toLowerCase());
        let checkDuplicateDate = (roleParam: string) => DateArray.some(({ key }) => key.toLowerCase() == roleParam.toLowerCase());
        if (!checkDuplicateKpi(element.kpi) && !checkDuplicateValues(element.kpi) && !checkDuplicateDate(element.kpi)) {
          if(element.type == null){
            DefaultArray.push({ key: element.kpi,type:0 });
          }else{
            if(element.type == 1)
              ValuesArray.push({ key: element.kpi,type:element.type});
            else if(element.type == 2)
            DateArray.push({ key: element.kpi, type: element.type });
          else
            DefaultArray.push({ key: element.kpi, type: element.type });
        }
      }
      });
    let StaticArray = [{ key: "Period", type: 0 }, { key: "PeriodType", type: 0 }, { key: "PeriodDate", type: 2 }, { key: "~", uniqueName: "Level 1", type: 1 }];
    returnArray.push(...this.GetFixedFields(false,false), ...StaticArray, ...ValuesArray, ...DateArray, ...DefaultArray);
    return returnArray;
  }

  GetFixedFields(isInvestorTab:boolean, isFundTab:boolean){
    let DynamicArray = [];
    let fixedStaticListCopy = [];
    if(isFundTab){
      fixedStaticListCopy =this.fixedStaticList.filter(x => x.name == DataAnalyticsConstants.FundName);
    } else if(!isInvestorTab){
      fixedStaticListCopy =this.fixedStaticList.filter(x => x.name != DataAnalyticsConstants.InvestorName);
    } else{
      fixedStaticListCopy = this.fixedStaticList;
    }
    fixedStaticListCopy.forEach(x => {
      DynamicArray.push({ key: x.aliasName, type: 0,name:x.name})
    })
    return DynamicArray;
  }
  getFundStaticPayload() {
    let DynamicArray = [];
    let returnArray = [];
    if (this.fundStaticList != null && this.fundStaticList.length > 0) {
      this.fundStaticList?.forEach((element1: { aliasName: string;name: string; }) => {
        if (DynamicArray.length > 1 && element1.name != DataAnalyticsConstants.FundName) {
          const checkDuplicateKpi = (roleParam) =>
            DynamicArray.some(
              ({ key }) => key.toLowerCase() == element1.aliasName.toLowerCase()
            );
          if (!checkDuplicateKpi(element1.aliasName)) {
            DynamicArray.push({ key: element1.aliasName, type: 0 });
          }
        } else if(element1.name != DataAnalyticsConstants.FundName) {
          DynamicArray.push({ key: element1.aliasName, type: 0 });
        }
      });
    }
    let StaticArray = [
      { key: "Period", type: 0 },
      { key: "PeriodDate", type: 2 },
    ];
    let levelArray = [{ key: "~", uniqueName: "Level 1", type: 1 }];
    returnArray.push(...this.GetFixedFields(false,true),...StaticArray, ...levelArray, ...DynamicArray);
    return returnArray;
  }
  getStaticFieldConfiguration() {
    this.isLoader = true;
    this.dataAnalyticService.getStaticFields().subscribe({
      next: (result: any) => {
        if (result != null && result != undefined) {
          this.parseJsonResponse(result);
        }
        this.isLoader = false;
      },
      error: (error) => {
        this.isLoader = false;
      },
    });
  }
  getFixedStaticFieldConfiguration() {
    this.isLoader = true;
    this.dataAnalyticService.getFixedStaticFields().subscribe({
      next: (result: any) => {
        if (result != null && result != undefined) {
          this.fixedStaticList = result.fixedStaticFields;
        }
        this.isLoader = false;
      },
      error: (error) => {
        this.isLoader = false;
      },
    });
  }

  parseJsonResponse(result: any) {
    this.dealStaticList = result.dealStaticFields;
    this.fundStaticList = result.fundStaticFields;
    this.investorStaticList = result.investorStaticFields;
  }
  getPCPayload() {
    let startDate = new Date(this.model?.portfolioCompanyModel.period[0]);
    let endDate = new Date(this.model?.portfolioCompanyModel.period[1]);
    let companyId = this.model?.portfolioCompanyModel.companyList.map(function (
      company
    ) {
      return company.companyId;
    });
    let moduleId = this.model?.portfolioCompanyModel.moduleList
      .filter((module) => !module.staticSection)
      .map(function (type) {
        return type.moduleId;
      });
    let subPageIds = this.model?.portfolioCompanyModel.moduleList
      .filter((module) => module.staticSection)
      .map(function (type) {
        return type.moduleId;
      });
    const pageConfigFields = this.model?.portfolioCompanyModel.kpiItems
      .filter((x) => subPageIds.includes(x.moduleId))
      .map((kpi) => ({ SubPageId: kpi.moduleId, FieldId: kpi.kpiId }));
    return {
      CompanyId: companyId,
      ModuleIds: moduleId,
      StartDate: this.datePipe
        .transform(startDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      EndDate: this.datePipe
        .transform(endDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      KpiIds: [],
      ToCurrencyId:
        this.model?.portfolioCompanyModel.currenceList?.currencyID == undefined
          ? 0
          : this.model?.portfolioCompanyModel.currenceList?.currencyID,
      CurrencyRateSource:
        this.model?.portfolioCompanyModel.fxRates?.type == undefined
          ? ""
          : this.model?.portfolioCompanyModel.fxRates?.type,
      IsAnalytics: true,
      DataAnalyticsKpiFilter: {
        CompanyKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.Company)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        InvestmentKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.Investment)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        OperationalKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.Operational)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        TradingKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.TradingRecords)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        CreditKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.CreditKPI)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        ProfitLossKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.ProfitAndLoss)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        BalanceSheetKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.BalanceSheet)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        CashflowKpiIds: this.model?.portfolioCompanyModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.CashFlow)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        PageConfigFields: pageConfigFields,
      },
    };
  }
  getESGPayload() {
    let startDate = new Date(this.model?.ESGModel.period[0]);
    let endDate = new Date(this.model?.ESGModel.period[1]);
    let companyId = this.model?.ESGModel.companyList.map(function (
      company
    ) {
      return company.companyId;
    });
    let moduleId = this.model?.ESGModel.moduleList
      .filter((module) => !module.staticSection)
      .map(function (type) {
        return type.moduleId;
      });
    let subPageIds = this.model?.ESGModel.moduleList
      .filter((module) => module.staticSection)
      .map(function (type) {
        return type.moduleId;
      });
    const pageConfigFields = this.model?.ESGModel.kpiItems
      .filter((x) => subPageIds.includes(x.moduleId))
      .map((kpi) => ({ SubPageId: kpi.moduleId, FieldId: kpi.kpiId }));
    return {
      CompanyId: companyId,
      ModuleIds: moduleId,
      StartDate: this.datePipe
        .transform(startDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      EndDate: this.datePipe
        .transform(endDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      KpiIds: [],
      ToCurrencyId:
        this.model?.ESGModel.currenceList?.currencyID == undefined
          ? 0
          : this.model?.ESGModel.currenceList?.currencyID,
      CurrencyRateSource:
        this.model?.ESGModel.fxRates?.type == undefined
          ? ""
          : this.model?.ESGModel.fxRates?.type,
      IsAnalytics: true,
      DataAnalyticsKpiFilter: {
        ESGKpiIds: this.model?.ESGModel.kpiItems
          .filter((x) => x.moduleId == KPIModulesEnum.Company)
          .map(function (kpi) {
            return kpi.kpiId;
          }),
        
        PageConfigFields: pageConfigFields,
      },
    };
  }
  convertTransformDate(date) {
    return this.datePipe.transform(
      date,
      DataAnalyticsConstants.StaticDateFormat
    );
  }
  getDealsPayload() {
    let companyId = this.model?.dealModel.companyList.map(function (company: { companyId: any; }) {
      return company.companyId;
    });
    let startDate = new Date(this.model?.dealModel.period[0]);
    let endDate = new Date(this.model?.dealModel.period[1]);
    return {
      Sections: [
        DataAnalyticsConstants.BasicDetails,
        DataAnalyticsConstants.PCFundHoldingDetails,
        DataAnalyticsConstants.StaticInformation,
        DataAnalyticsConstants.FundStaticInformation
      ],
      DealId: [],
      DealCombine: true,
      IsExcelPlugin:false,
      CompanyIds: companyId,
      StartDate: this.datePipe
        .transform(startDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      EndDate: this.datePipe
        .transform(endDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
    };
  }
  getInvestorPayload() {
    let startDate = new Date(this.model?.investorModel.period[0]);
    let endDate = new Date(this.model?.investorModel.period[1]);
    let companyId = this.model?.investorModel.companyList.map(function (
      company: { companyId: any; }
    ) {
      return company.companyId;
    });
    let investorIds = this.model?.investorModel.investorList.map(function (
      investor: { investorId: any; }
    ) {
      return investor.investorId;
    });
    let fundIds = this.model?.investorModel.fundList.map(function (fund: { fundID: any; }) {
      return fund.fundID;
    });
    return {
      Sections: [
        this.model?.investorModel.investorSections?.type == undefined
          ? ""
          : this.model?.investorModel.investorSections?.type,
      ],
      CompanyIds: companyId,
      InvestorIds: investorIds,
      StartDate: this.datePipe
        .transform(startDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      EndDate: this.datePipe
        .transform(endDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      Combine: true,
      FundIds: fundIds,
    };
  }
  getFundsPayload() {
    let fundID = this.model?.fundModel.fundList.map(function (fund: { fundID: any; }) {
      return fund.fundID;
    });
    let startDate = new Date(this.model?.fundModel.period[0]);
    let endDate = new Date(this.model?.fundModel.period[1]);
    return {
      sections: [
        DataAnalyticsConstants.StaticFundDetails,
        DataAnalyticsConstants.FundTerms,
        DataAnalyticsConstants.GeographicLocations,
        DataAnalyticsConstants.TrackRecord,
      ],
      FundId: fundID,
      IsCombine: true,
      StartDate: this.datePipe
        .transform(startDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
      EndDate: this.datePipe
        .transform(endDate, DataAnalyticsConstants.StaticDateFormat)
        .toString(),
    };
  }
  changeTabType(tab: any) {
    this.defaultSelectedTab = tab;
    this?.filterAnalyticsList?.forEach((row: { isActive: boolean; }) => (row.isActive = false));
    tab.isActive = true;
    if (
      this.defaultSelectedTab != undefined &&
      this.defaultSelectedTab != null
    ) {
      this.loadDashBoard(this.defaultSelectedTab.dataSetName);
    }
  }
  moveRight() {
    let scroll = 300;
    let remainingScroll =
      this.panel.nativeElement.scrollWidth -
      (this.panel.nativeElement.offsetWidth +
        this.panel.nativeElement.scrollLeft);
    if (remainingScroll > 2) {
      this.enableLeft = false;
      this.enableRight = true;
    } else {
      this.enableLeft = true;
      this.enableRight = false;
    }
    if (remainingScroll > scroll && remainingScroll < scroll * 2) {
      scroll = remainingScroll;
    }
    try {
      this.panel.nativeElement.scrollTo({
        left: this.panel.nativeElement.scrollLeft + scroll,
        top: 0,
        behavior: "smooth",
      });
    } catch {
      this.panel.nativeElement.scrollLeft =
        this.panel.nativeElement.scrollLeft + scroll;
    }
    setTimeout(
      function (local: any) {
        local.setScrollButtonVisibility();
      },
      500,
      this
    );
  }
  rightScrollTimer: any;
  leftScrollTimer: any;
  startLeftScrolling() {
    this.leftScrollTimer = setInterval(
      function (local: any) {
        local.moveLeft();
      },
      500,
      this
    );
  }
  startRightScrolling() {
    this.rightScrollTimer = setInterval(
      function (local: any) {
        local.moveRight();
      },
      500,
      this
    );
  }
  propagateChange = (_: any) => {};
  stopLeftScrolling() {
    clearInterval(this.leftScrollTimer);
  }
  stopRightScrolling() {
    clearInterval(this.rightScrollTimer);
  }

  moveLeft() {
    if (this.panel.nativeElement.scrollLeft > 1) {
      this.enableRight = false;
      this.enableLeft = true;
    } else {
      this.enableRight = true;
      this.enableLeft = false;
    }
    try {
      this.panel.nativeElement.scrollLeft.scrollTo({
        left: this.panel.nativeElement.scrollLeft - 300,
        top: 0,
        behavior: "smooth",
      });
    } catch {
      this.panel.nativeElement.scrollLeft =
        this.panel.nativeElement.scrollLeft - 300;
    }

    setTimeout(
      function (local: any) {
        local.setScrollButtonVisibility();
      },
      500,
      this
    );
  }
  setScrollButtonVisibility() {
    this.changeDetectorRef.detectChanges();
    if (
      this.panel.nativeElement.offsetWidth +
        this.panel.nativeElement.scrollLeft ==
      this.panel.nativeElement.scrollWidth
    ) {
      this.stopRightScrolling();
      this.showRightScroll = false;
    } else {
      this.showRightScroll = true;
    }
    if (this.panel.nativeElement.scrollLeft == 0) {
      this.stopLeftScrolling();
      this.showLeftScroll = false;
    } else {
      this.showLeftScroll = true;
    }
  }
  validMandatoryInvestor(investorModel: any) {
    if (investorModel != undefined) {
      if (
        investorModel.companyList != undefined &&
        investorModel.companyList.length > 0 &&
        investorModel.fundList != undefined &&
        investorModel.fundList.length > 0 &&
        investorModel.investorList != undefined &&
        investorModel.investorList.length > 0 &&
        investorModel.investorSections != undefined &&
        investorModel.investorSections.id != undefined &&
        investorModel.investorSections.id != null &&
        investorModel.period != undefined &&
        investorModel.period.length > 0
      ) {
        return true;
      }
      return false;
    }
  }
  validMandatoryPortfolioCompany(portfolioCompanyModel: any) {
    if (portfolioCompanyModel !== undefined) {
      return (
        portfolioCompanyModel.companyList !== undefined &&
        portfolioCompanyModel.companyList.length > 0 &&
        portfolioCompanyModel.moduleList !== undefined &&
        portfolioCompanyModel.moduleList.length > 0 &&
        portfolioCompanyModel.period !== undefined &&
        portfolioCompanyModel.period.length > 0 &&
        portfolioCompanyModel.kpiItems !== undefined &&
        portfolioCompanyModel.kpiItems.length > 0
      );
    }
    return false;
  }
  validMandatoryESG(portfolioCompanyModel: any) {
    if (portfolioCompanyModel !== undefined) {
      return (
        portfolioCompanyModel.companyList !== undefined &&
        portfolioCompanyModel.companyList.length > 0 &&
        portfolioCompanyModel.moduleList !== undefined &&
        portfolioCompanyModel.moduleList.length > 0 &&
        portfolioCompanyModel.period !== undefined &&
        portfolioCompanyModel.period.length > 0 &&
        portfolioCompanyModel.kpiItems !== undefined &&
        portfolioCompanyModel.kpiItems.length > 0
      );
    }
    return false;
  }
  validMandatoryDeal(dealModel: any) {
    if (dealModel != undefined) {
      if (
        dealModel.companyList != undefined &&
        dealModel.companyList.length > 0 &&
        dealModel.fundList != undefined &&
        dealModel.fundList.length > 0 &&
        dealModel.period != undefined &&
        dealModel.period.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  validMandatoryFund(fundModel: any) {
    if (fundModel != undefined) {
      if (
        fundModel.fundList != undefined &&
        fundModel.fundList.length > 0 &&
        fundModel.period != undefined &&
        fundModel.period.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  tabDelete(tab: any) {
    if(this.defaultSelectedTab?.id >0){
      let dashboard = {
        File: "",
        DashboardId: this.defaultSelectedTab?.id,
        DatasetName: this.defaultSelectedTab?.dataSetName,
        UserId: this.userPermissions[0].userID,
        Description: this.description,
        isPersonal: this.isPersonal,
        isDeleted: true,
      };
      this.isLoader = true;
      this.dataAnalyticService.deleteDashboard(dashboard).subscribe({
        next: () => {
          this.reset();
          this.alertService.success("Dashboard deleted successfully", "", {
            positionClass: "toast-center-center",
          });
          this.currentTabId = 0;
          this.getDataAnalytics();
          this.isLoader = false;
          this.deletePopub = false;
        },
        error: (error) => {
          this.isLoader = false;
        },
      });
    }
  }
  tabCancel(tab: any) {
    this.deletePopub = false;
  }
  deletePopupFunction() {
    this.deletePopub = true;
  }
}