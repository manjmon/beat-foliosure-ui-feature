import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild,EventEmitter} from "@angular/core";
import { FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/api/message";
import { ConfirmationService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { HelperService } from "../../services/helper.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from 'src/app/services/data-service.service';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { CompanyPageSectionConstants, CompanyInformationConstants } from "../../common/constants";
import { PageConfigurationSubFeature } from "../../common/enums";
import { PageConfigFieldModel, WorkflowRequestModel,AppConfig } from "../../common/models";
import { AppSettingService } from '../../services/appsettings.service';
import { Observable, Subject,Subscription} from "rxjs";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { filter } from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FeaturesEnum } from '../../services/permission.service';
import { M_Datatypes } from "src/app/common/constants";
import { PCCustomListFieldModel } from "src/app/common/models/pagefieldconfig.model";
@Component({
  selector: "add-portfolio-company",
  templateUrl: "./add-portfolioCompany.component.html",
  styleUrls: ['./add-portfolio-company.component.scss'],
  providers: [ConfirmationService],
})
export class AddPortfolioCompanyComponent implements OnInit {
  searchGroup:string ="";
  selectedGroupId:number = 0;
  confirmDelete:boolean = false;
  selectedCompanyGroup:any = null;
  feature: typeof FeaturesEnum = FeaturesEnum;
  pcForm: FormGroup;
  groupName:string = "";
  public sectorList: any[];
  files = [];
  companyid: any;
  filename: any;
  path: any;
  browseicon: boolean = true;
  deleticon: boolean = false;
  isexits: boolean = false;
  uploadedlogos = [];
  uploadedlogostemp = [];
  public stockExchangeList: any[];
  id: any;
  msgTimeSpan: number;
  msgs: Message[] = [];
  locationModel: any;
  locationModelClone: any;
  browsetext: any = "Upload Logo";
  deleteConfirmationMessage: string =
    "Are you sure that you want to delete this record?";
  public masterModel: any;
  title: string = "Create";
  resetText: string = "Reset";
  pcStatus: boolean = true;
  pcEmployee: any = {};
  geographicLocation: any = { isHeadquarter: false };
  isGeographic: boolean = false;
  isActive = "active";
  isinActive = "";
  isInvestment: boolean = false;
  fixedbottomHeight: any = 0;
  months = [{ name: "January", value: "January" }, { name: "February", value: "February" }, { name: "March", value: "March" }, { name: "April", value: "April" }, { name: "May", value: "May" }, { name: "June", value: "June" }, { name: "July", value: "July" }, { name: "August", value: "August" }, { name: "September", value: "September" }, { name: "October", value: "October" }, { name: "November", value: "November" }, { name: "December", value: "December" }];
  model: any = {
    isActive: this.pcStatus,
    geographicLocations: [],
    pcEmployees: [],
    customFieldValueList:[]
  };
  statusOptions: any = [
    { value: "Private", text: "Private" },
    { value: "Public", text: "Public" },
  ];
  deletefilename: string = "";
  loading = false;
  designationList: any[];
  tabList: any[] = [];
  workflowRequestId: number = 0;
  workflowMappingId: number = 0;
  subscription: Subscription;
  isFileUpload: boolean = false;
  isWorkflow: boolean = false;
  sourceURL: any;
  tabName: string = "";
  businessModel: PageConfigFieldModel;
  companyLogoModel: PageConfigFieldModel;
  subPageList: any[];
  pageFieldLists: any[]; pageFieldListMaster: any[];
  customfieldValueList: any[];
  customPortfolioGroupList=[];
  locationFieldList: PageConfigFieldModel[] = [];
  investmentProfessionFieldList: any[];
  companyPageSectionConstants = CompanyPageSectionConstants;
  companyInformationConstants = CompanyInformationConstants;
  logoFile: any;
  sideNavWidth:any ="";
  appConfig: AppConfig;
  @ViewChild("menuInvestor") uiuxMenu!: MatMenu;
  @ViewChild("tRecordTrigger") menuTrigger: MatMenuTrigger;
  selectedGroup:any=null;
  groupList = [];
  originalGroupList:any = [];
  companyGroupPageField: any;
  mDataTypes = M_Datatypes;
  pcCustomListDetails:PCCustomListFieldModel[]=[];
  companyId:string;
  yearRange: string = "";
  constructor(
    private confirmationService: ConfirmationService,
    private portfolioCompanyService: PortfolioCompanyService,
    private accountService: AccountService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscellaneousService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private router: Router,
    private dataService: DataService,
    private pageConfigurationService: PageConfigurationService,
    private appSettingService: AppSettingService,
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    
      
      this.title = "Done";
      this.resetText = "Cancel";
    }
    this.businessModel = <PageConfigFieldModel>({
      name: "",
      displayName: "",
      value: "",
      isActive: false,
      dataTypeId:0,
    });

    this.companyLogoModel = <PageConfigFieldModel>({
      name: "",
      displayName: "",
      value: "",
      isActive: false,
      dataTypeId:0,
    });
    if (!this.id)
      this.getPageConfigSetting();
    this.getMasterFirmModel();
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.companyId=this.id==undefined?0:this.id;
    let year = new Date();
    this.yearRange = "2000:" + year.getFullYear();
  }

  getFieldDisplayName(items: any[], sectionName: string) {
    let result = items.find(x => x.name == sectionName);
    return ((result && result.displayName) || "");
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized(_$event)
  {
    this.getSideNavWidth();
  }
  isFieldActive(items: any[], sectionName: string): boolean {
    let result = items.find(x => x.name == sectionName);
    return ((result && result.isActive) || false);

  }
  getMasterFirmModel() {
    this.firmService.getMasterFirmModel().subscribe(
      (result) => {
        this.locationModel = result["body"];
        this.locationModelClone = JSON.parse(JSON.stringify(result));
      }
    );
  }
  configureMenuClose(old: MatMenu["close"]): MatMenu["close"] {
    const upd = new EventEmitter();
    feed(
      upd.pipe(
        filter((event) => {
          if (event === "click") {
            return false;
          }
          return true;
        })
      ),
      old
    );
    return upd;
  }
  getPageConfigSetting = () => {

    this.pageConfigurationService.getPageConfigSettingById(1)
      .subscribe(
        (result: any) => {
          this.parseJsonResponse(result);
          this.setupTab();

        }, (_error) => {

        });
  }

  getFieldsBySubPageID = (subPageName: string) => {
    let subPageID = this.subPageList.find(x => x.name == subPageName).id || "";
    return this.pageFieldLists.filter(x => x.subpageid == subPageID);
  }
  formatPageFieldResponse = (result: any[]): PageConfigFieldModel[] => {
    let formatResult: PageConfigFieldModel[] = result.map(x => <PageConfigFieldModel>({
      fieldID: x.fieldID || x.id,
      subPageID: x.subPageID,
      name: x.name,
      displayName: x.displayName,
      value: !x.value ? 'NA' : x.value,
      isMandatory: x.isMandatory || false,
      isActive: x.isActive || false,
      dataTypeId: x.dataTypeId
    }));
    return formatResult || [];
  }
  parseJsonResponse = (result: any) => {
    if (!result) return;
    this.subPageList = result.subPageList || [];
    this.pageFieldListMaster = result?.fieldValueList || [];
    this.pageFieldLists = this.formatPageFieldResponse(this.pageFieldListMaster.filter(x => x.subPageID == PageConfigurationSubFeature.StaticInformation));
    this.companyGroupPageField = this.pageFieldLists.find(x => x.name == CompanyInformationConstants.CompanyGroupId);
    this.customfieldValueList = this.formatPageFieldResponse(this.pageFieldListMaster.filter(x => x.subPageID == PageConfigurationSubFeature.StaticInformation && x.isCustom));
    this.locationFieldList = this.formatPageFieldResponse(this.pageFieldListMaster.filter(x => x.subPageID == PageConfigurationSubFeature.GeographicLocations));
    this.locationFieldList.forEach(x => {
      if (x.name == CompanyInformationConstants.Country) {
        x.isMandatory = false;
      }

    });
    this.investmentProfessionFieldList = this.formatPageFieldResponse(this.pageFieldListMaster.filter(x => x.subPageID == PageConfigurationSubFeature.InvestmentProfessionals));

    let _companyLogo = this.pageFieldListMaster.find(x => x.name == CompanyInformationConstants.CompanyLogo);
    if (_companyLogo) {
      this.companyLogoModel = {
        name: _companyLogo?.name,
        displayName: _companyLogo?.displayName,
        value: _companyLogo?.value,
        isMandatory: _companyLogo?.isMandatory || false,
        isActive: _companyLogo?.isActive || false,
        dataTypeId:0,
      }
    }

    let _businessDescModel = this.pageFieldListMaster.find(x => x.name == CompanyInformationConstants.BusinessDescription);
    if (_businessDescModel) {
      this.businessModel = {
        name: _businessDescModel?.name,
        displayName: _businessDescModel?.displayName,
        value: _businessDescModel?.value,
        isMandatory: _businessDescModel?.isMandatory || false,
        isActive: _businessDescModel?.isActive || false,
        dataTypeId:0,
      };
    }
  }


  setupTab() {

    if (this.isFieldActive(this.subPageList, CompanyPageSectionConstants.Locations)) {
      this.isGeographic = this.isFieldActive(this.subPageList, CompanyPageSectionConstants.Locations);
      this.tabList.push({
        isActive: this.isFieldActive(this.subPageList, CompanyPageSectionConstants.Locations),
        name: "Geographic Locations",
        isSelected: this.isGeographic,
        displayName: this.getFieldDisplayName(this.subPageList, CompanyPageSectionConstants.Locations)
      });

    }
    if (this.isFieldActive(this.subPageList, CompanyPageSectionConstants.InvestmentProfessionals)) {
      this.isInvestment = this.isGeographic ? false : true;
      this.tabList.push({
        isActive: this.isFieldActive(this.subPageList, CompanyPageSectionConstants.InvestmentProfessionals),
        name: "Investment Professionals",
        isSelected: this.isInvestment,
        displayName: this.getFieldDisplayName(this.subPageList, CompanyPageSectionConstants.InvestmentProfessionals)
      });

    }


  }

  onTabClick(tab: any) {
    if (tab != null || tab != undefined) {
      this.tabName = tab.name;
    }
  }
  getWorkflowDetails() {

    this.subscription = this.dataService.currentWorkflowMappingId.subscribe(result => 
      this.workflowMappingId = parseInt(result)
      );
    this.subscription = this.dataService.currentWorkflowRequest.subscribe(
      result => this.workflowRequestId = parseInt(result)
      );

      let config =JSON.parse(sessionStorage.getItem("WorkflowRequestModel"));
      let workFlowReqModel:WorkflowRequestModel =  {
        MappingId:Number(config["MappingId"]),
        RequestId :Number(config["RequestId"])
     };
     this.workflowRequestId = workFlowReqModel.RequestId;
     this.workflowMappingId = workFlowReqModel.MappingId;

  }

  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getSideNavWidth();
    if (this.id != undefined) {
      this.loading = true;
      this.title = "Done";
    } else {
      this.loading = false;
    }
    this.portfolioCompanyService.getMasterPCModel().subscribe({
      next:(result) => {
        this.masterModel = result["body"];
        this.designationList = result["body"].designationList;
        this.setDefaultValues();
      },
      error:(_error) => {
      }
  });

   this.appSettingService.setGetConfig().then( res => {
    this.appConfig = res;
    if(this.appConfig.IsWorkflowEnable) {
      this.getWorkflowDetails();
    }
   });
   this.getCompanyGroups();
  
  }
  ngAfterViewInit() {
    this.fixedbottomHeight = window.outerHeight - 43 + "px";
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.fixedbottomHeight = window.outerHeight - 43 + "px";
  }
  selectTab(tab: any) {
    this.tabList.forEach(x => x.isSelected = false);
    let obj = this.tabList.find(x => x.name == tab);
    obj.isSelected = true;

    if (tab == "Geographic Locations") {
      this.isGeographic = true;
      this.isInvestment = false;
      this.getMasterFirmModel();
    }
    if (tab == "Investment Professionals") {
      this.isInvestment = true;
      this.isGeographic = false;
    }
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: any) {
    let supportedImageTypes: Array<string> = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bpg','jfif','jif'];
    for (let item of files) {
      let extension = item?.type.split('/')[1].toLocaleLowerCase();
      if (supportedImageTypes.toString().toLocaleLowerCase().indexOf(extension.toString()) === -1) {
        // TODO document why this block is empty
      } else {
        item.imagePath = this.getFileIcons(item.name);
        item.displayName = item.name.substr(0, item.name.lastIndexOf("."));
        this.filename = item.name;
        this.browseicon = false;
        this.isFileUpload = false;
        this.deleticon = true;
        this.browsetext = this.filename;
        this.logoFile = item;
      }
    }
  }
  clearupload() {

    this.browsetext = "Upload Logo";
    this.deleticon = false;
    this.browseicon = true;
    this.isFileUpload = false;
    this.filename = "";
    this.logoFile = null;
    this.deletefilename = ""
  }
  deleteIconClick(filename: string) {
    this.deletefilename = filename.toString();
    this.deleticon = false;
    this.browseicon = true;
    this.resetlogos();
  }
  uploadLogoIcon = (companyid: any, file: any) => {
    if (!file) return;
    let pcID = companyid || this.companyid;
    let path: any;
    if (this.title == "Done")
      path = this.isWorkflow ? `logos/draft/${pcID}/` : `logos/${pcID}/`;
    else
      path = `logos/${pcID}/`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    return new Promise<string>((resolve, reject) => {
      this.portfolioCompanyService.uploadlogos(formData, '').subscribe({next:(result: any) => {
        if (result) {
          this.isFileUpload = false;
          this.deleticon = true;
          this.movedUploadLogoImg(path).then(res => {
            if (res) {
              resolve('Company Logo successfully uploaded');
            }
          })
          .catch (_err=> {
            reject("Failed to upload the logo, please try later");
          });
        }
        else {
          this.isFileUpload = false;
          this.clearupload();
          reject("Failed to upload the logo, please try later");         
        }
      }, error:_error => {
        this.isFileUpload = false;
        this.clearupload();
        reject("Failed to upload the logo, please try later");        
      }});

    });

  }
  uploadLogo(file) {
    let path: any;
    if (this.title == "Done")
      path = this.isWorkflow ? `logos/draft/${this.companyid}/` : `logos/${this.companyid}/`;
    else
      path = `logos/${this.companyid}/`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    this.portfolioCompanyService.uploadlogos(formData, '').subscribe({next:(result: any) => {
      if (result) {
        this.isFileUpload = false;
        this.deleticon = true;
      }
      else {
        this.isFileUpload = false;
        this.clearupload();
        this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
      }
    }, error:_error => {
      this.isFileUpload = false;
      this.clearupload();
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    }});
  }
  getFileIcons(filename: string) {
    return this.helperService.getIconFromFileName(filename);
  }
  movedUploadLogoImg = (path: string) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.filename) 
        reject(false);     
      else
        path = `${path}${this.filename}`;

      this.portfolioCompanyService.impactsaveuploadlogs({
        'Path': path
      }).subscribe((res: any) => {
        if (res) 
          resolve(true);        
        else
        reject(false);
      });
    });
  }
  saveImage() {
    let path: any;
    if (this.title == "Done") {
      path = this.isWorkflow ? { 'Path': `logos/draft/${this.companyid}/${this.filename}` } : { 'Path': `logos/${this.companyid}/${this.filename}` };
    }
    else
      path = { 'Path': `logos/${this.companyid}/${this.filename}` };
    this.portfolioCompanyService.impactsaveuploadlogs(path).subscribe((_response: any) => {
    });
  }
  closePanel() {
    this.menuTrigger.closeMenu();
  }
  setDefaultValues() {
    if (this.id != undefined) {
      this.title = "Done";
      let workflowId = isNaN(this.workflowRequestId) ? 0 : this.workflowRequestId;
      this.portfolioCompanyService
        .getPortfolioCompanyDraftById(this.id, workflowId)
        .subscribe({
          next:(result) => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
              this.parseJsonResponse(resp);
              this.setupTab();
              this.isWorkflow = resp.isWorkflow;
              this.model = resp.companyDetails;
              this.selectedGroupId = resp?.companyDetails?.companyGroupId;
              this.setGroup();
              if (this.model.financialYearEnd != null && this.model.financialYearEnd.split(' ').length > 3) {
                let month = this.model.financialYearEnd.split(' ')[3];
                this.model.financialYearEnd = { name: month, value: month }
              }
              this.companyid = (this.model.portfolioCompanyID);
              if (this.model != null && this.model.designationId > 0) {
                let designationId = this.model.designationId;
                this.model.designationDetail = this.masterModel.designationList.filter(
                  function (element: any, _index: any) {
                    return element.designationId == designationId;
                  }
                )[0];
              }
              if (this.model != null && this.model.sectorID > 0) {
                let sectorID = this.model.sectorID;
                this.model.sectorDetail = this.masterModel.sectorList.filter(
                  function (element: any, _index: any) {
                    return element.sectorID == sectorID;
                  }
                )[0];

                this.GetSubSectorListBySectorId(this.model.sectorID);
              }

              if (this.model.geographicLocations != null) {
                this.model.geographicLocations.forEach(function (value: any) {
                  value.uniquelocationID = value.locationID;
                });
              }
              this.browsetext = (this.model.imagePath !== null && this.model.imagePath !== "") ? this.model.imagePath : this.browsetext;
              this.browseicon = (this.model.imagePath !== null && this.model.imagePath !== "") ? true : this.browseicon;
              this.deleticon = (this.model.imagePath !== null && this.model.imagePath !== "") ? true : this.deleticon;
              this.filename = (this.model.imagePath !== null && this.model.imagePath !== "") ? this.model.imagePath : this.filename;
            } else {
              if (resp.status != null && resp.status.message != "") {
                this.toastrService.error(resp.status.message, "", { positionClass: "toast-center-center" });
              }
            }

            this.loading = false;
          },
          error:(_error) => {
            this.loading = false;
          }
    });
    }
  }
 setGroup()
 {
  let selectedGroup =  (this.groupList || [])?.find(x=>x.groupId == this.selectedGroupId);
  if(selectedGroup != undefined)
  {
    this.selectedGroup = selectedGroup.groupName;
  }
 }
  addGeographicLocation(form: any) {

    if (form.valid) {
      if (this.geographicLocation.country != undefined) {
        let isHeadquarterExist = this.model.geographicLocations.filter(
          function (ele: any) {
            return ele.isHeadquarter;
          }
        );
        let local = this;
        let isLocationExist = this.model.geographicLocations.filter(function (
          ele: any
        ) {
          let res = false;
          if (ele.city && local.geographicLocation.city) {
            res = ele.city.cityId == local.geographicLocation.city.cityId;
          } else if (ele.city == local.geographicLocation.city) {
            if (ele.state && local.geographicLocation.state) {
              res = ele.state.stateId == local.geographicLocation.state.stateId;
            } else if (ele.state == local.geographicLocation.state) {
              if (ele.country && local.geographicLocation.country) {
                res =
                  ele.country.countryId ==
                  local.geographicLocation.country.countryId;
              } else if (ele.country == local.geographicLocation.country) {
                if (ele.region && local.geographicLocation.region) {
                  res =
                    ele.region.regionId ==
                    local.geographicLocation.region.regionId;
                } else {
                  res = ele.region == local.geographicLocation.region;
                }
              }
            }
          }

          return res;
        });
        if (isLocationExist.length == 0) {
          if (
            isHeadquarterExist.length == 0 ||
            !this.geographicLocation.isHeadquarter
          ) {
            this.geographicLocation.uniquelocationID = 1;
            if (this.model.geographicLocations.length > 0) {
              let maxVal = this.model.geographicLocations.reduce(function (
                prev: any,
                current: any
              ) {
                return prev.uniquelocationID > current.uniquelocationID
                  ? prev
                  : current;
              });
              this.geographicLocation.uniquelocationID =
                maxVal.uniquelocationID + 1;
            }

            this.model.geographicLocations.push(
              JSON.parse(JSON.stringify(this.geographicLocation))
            );
            this.geographicLocation = {};
            this.clearGeographicLocation(form);
          } else {
            this.toastrService.error("You have already selected the headquarter location for the portfolio company", "", { positionClass: "toast-center-center" });
          }
        } else {
          this.toastrService.error("Same location is already added for the portfolio company", "", { positionClass: "toast-center-center" });
        }
      }
      else {
        this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });

      }
    } else {

      this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
    }
  }

  clearGeographicLocation(_geoForm: any) {
    this.geographicLocation = {};
    setTimeout(
      function (local: any) {
        local.locationModel = JSON.parse(
          JSON.stringify(local.locationModelClone)
        );
        local.geographicLocation = { isHeadquarter: false };
        local.changeDetectorRef.detectChanges();
      },
      10,
      this
    );
  }

  removeLocation(locationId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.geographicLocations = this.model.geographicLocations.filter(
          function (ele: any) {
            return locationId != ele.uniquelocationID;
          }
        );
      },
    });
  }

  addEmployees(form: NgForm) {
    if (!form.valid) {
      for (let eachControl in form?.form?.controls) {
        (<FormControl>form.form.controls[eachControl]).markAsDirty();
      }
      this.toastrService.error("Please enter the required fields", "", { positionClass: "toast-center-center" });
      return;
    }
    if (this.employeeEditMode) {
      this.updateEmployee(form);
    } else if (
      this.pcEmployee.employeeName != undefined &&
      this.pcEmployee.emailId != undefined
    ) {
      let empEmailId = this.pcEmployee?.emailId;
      let existingEmails = this.model.pcEmployees?.filter(function (ele: any) {
        return ele?.emailId?.toLowerCase() == empEmailId?.toLowerCase();
      });

      if (this.model.pcEmployees.length == 0 || existingEmails.length == 0) {
        this.pcEmployee.employeeId = 1;
        if (this.model.pcEmployees.length > 0) {
          let maxVal = this.model.pcEmployees.reduce(function (
            prev: any,
            current: any
          ) {
            return prev.employeeId > current.employeeId ? prev : current;
          });
          this.pcEmployee.employeeId = maxVal.employeeId + 1;
        }
        this.model.pcEmployees.push(this.pcEmployee);
        this.clearEmployees(form);
      } else {
        this.toastrService.error("Employee with the same email id is already added in the list", "", { positionClass: "toast-center-center" });
      }
    } else {
      this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
    }
  }

  clearEmployees(form: NgForm) {
    this.employeeEditMode = false;
    this.pcEmployee = {};
    if (form) {
      for (let eachControl in form.form.controls) {
        (<FormControl>form.form.controls[eachControl]).markAsPristine();
      }
    }
  }

  removeEmployee(emailId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.pcEmployees = this.model.pcEmployees.filter(function (
          ele: any
        ) {
          return ele.emailId.toLowerCase() != emailId.toLowerCase();
        });
      },
    });
  }

  AddOrUpdateCustomFieldValue(event, pcCustomField) {
    let val = event.target.value;
    let index = this.customfieldValueList.findIndex(x => x.displayName == pcCustomField.displayName);
    if (index != null) {
      let data = this.customfieldValueList;
      data[index].value = (val || '').trim();
      this.customfieldValueList = data
      this.model.customFieldValueList = data;
    }
  }

  savePortfolioCompany(f: any) {
    if (!this.model.companyName || !this.model.reportingCurrencyDetail) {
      this.toastrService.error("Please enter the required fields", "", { positionClass: "toast-center-center" });
      return;
    }

      this.loading = true;      
      if (this.validateGeographicLocation()) {
        if (this.title == "Create") {
          this.model.financialYearEnd = this.model?.financialYearEnd?.value;
          this.model.imagePath = this.filename;
          this.model.companyGroupId =  this.selectedGroupId;
          this.portfolioCompanyService
            .addPortfolioCompany(this.model)
            .subscribe({
              next:(data) => {
                if (data.code == "OK") {
                  let resp = data['body'];
                  this.selectedGroupId = 0;
                  this.selectedGroup = "";
                  if (this.logoFile != null) {
                    this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
                    this.uploadLogoIcon(resp.portfolioCompanyID, this.logoFile).then(res => {
                      this.loading = false;
                      this.formReset(f);
                      this.getCompanyGroups();
                      this.clearupload();
                      this.toastrService.success(res, "", { positionClass: "toast-center-center" });
                    })
                      .catch(err => {
                        this.loading = false;
                        this.formReset(f);
                        this.clearupload();
                        this.toastrService.error(err, "", { positionClass: "toast-center-center" });
                      });
                  }
                  else {
                    this.loading = false;
                    this.formReset(f);
                    this.clearupload();
                    this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
                  }
                }
                else {
                  this.loading = false;
                  this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
                }
              },
              error:(error) => {
                this.loading = false;
                this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
              }
        });
        } else if (this.title == "Done") {
          this.model.WorkflowRequestId = this.workflowRequestId;
          this.model.WorkflowMappingId = this.workflowMappingId;
          this.model.financialYearEnd = this.model?.financialYearEnd?.value;
          this.model.imagePath = this.filename;
          this.model.companyGroupId =  this.selectedGroupId;
          this.portfolioCompanyService
            .updatePortfolioCompany(this.model)
            .subscribe({
              next:(data) => {
                if (data.code == "OK") {
                  this.selectedGroupId = 0;
                  this.selectedGroup = "";
                  if (this.logoFile != null) {
                    this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
                    this.uploadLogoIcon(this.companyid, this.logoFile).then(res => {
                      this.loading = false;
                      this.formReset(f);
                      this.clearupload();
                      this.toastrService.success(res, "", { positionClass: "toast-center-center" });
                    })
                      .catch(err => {
                        this.loading = false;
                        this.formReset(f);
                        this.clearupload();
                        this.toastrService.error(err, "", { positionClass: "toast-center-center" });
                      });

                  }
                  else {
                    this.loading = false;
                    this.formReset(f);
                    this.clearupload();
                    this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
                  }

                }

                if (this.deletefilename != "") {
                  this.clearupload();
                }
                this.loading = false;
                if (data.code == "OK") {
                  setTimeout(() => {
                    if (this.isWorkflow)
                      this.router.navigate(['/workflow/company-draft', this.id]);
                    else
                      this.router.navigate(['/portfolio-company']);
                  }, 1000);

                }
                else
                  this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
              },
              error:(error) => {
                this.loading = false;
                this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
              }
        });
        }
      } else {
        this.loading = false;
        this.toastrService.error("Please select geographic location for the portfolio company", "", { positionClass: "toast-center-center" });
      }
    //}
  }

  validateGeographicLocation(): boolean {
    if (
      (this.model.geographicLocations != undefined &&
      this.model.geographicLocations.length > 0)|| this.model.geographicLocations.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  resetlogos() {
    if(!this.companyid)
    return;
    let path: any =  { 'Path': `logos/${this.companyid}/${this.filename}` };

    if (this.title == "Done" && this.isWorkflow)
      path = { 'Path': `/logos/draft/${this.companyid}/${this.filename}` }
    
    this.portfolioCompanyService.onDeleteTempFiles(path).subscribe({next:(_res) => {
      this.clearupload();
    },error: _error => {
      this.clearupload();
    }
  });
  }
  formReset(f: any) {
    if(this.resetText==="Cancel")
    {
      this.router.navigate(['/portfolio-company']);
    }
    else{
    this.clearupload();
    f.resetForm();
    this.changeDetectorRef.markForCheck();
    this.geographicLocation = { isHeadquarter: false };
    this.customfieldValueList = [];
    this.pageFieldLists = this.formatPageFieldResponse(this.pageFieldListMaster.filter(x => x.subPageID == PageConfigurationSubFeature.StaticInformation));
    this.model = {
      geographicLocations: [],
      pcEmployees: [],
      customfieldValueList: []

    };
    this.setDefaultValues();
  }
  }
  employeeEditMode: boolean = false;
  editPCEmployee(employee: any) {
    this.employeeEditMode = true;
    this.pcEmployee = JSON.parse(JSON.stringify(employee));
    let local = this;
    if (
      this.pcEmployee.designation != null &&
      this.pcEmployee.designation.designationId > 0
    ) {
      this.pcEmployee.designation = this.masterModel.designationList.filter(
        function (element: any, _index: any) {
          return (
            element.designationId == local.pcEmployee.designation.designationId
          );
        }
      )[0];
    }
  }

  updateEmployee(form: NgForm) {
    if (
      this.pcEmployee.employeeName != undefined &&
      this.pcEmployee.emailId != undefined
    ) {
      let employeeId = this.pcEmployee?.employeeId;

      let existingEmployee = this.model?.pcEmployees?.filter(function (ele: any) {
        return ele.employeeId == employeeId;
      });
      let emailId = this.pcEmployee?.emailId;
      let isEmailExist = this.model?.pcEmployees?.filter(function (ele: any) {
        return (
          ele.emailId?.toLowerCase() == emailId?.toLowerCase() &&
          ele.employeeId != employeeId
        );
      });

      if (existingEmployee.length != 0 && isEmailExist.length == 0) {
        this.changeDetectorRef.detectChanges();
        this.model.pcEmployees[
          this.model.pcEmployees.indexOf(existingEmployee[0])
        ] = this.pcEmployee;
        this.clearEmployees(form);
      } else {
        this.toastrService.error("Employee with the same email id is already added in the list", "", { positionClass: "toast-center-center" });
      }
    } else {
      this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
    }
  }

  onSectorChange() {
    this.GetSubSectorListBySectorId(null);
  }
  setMasterCompanyName() {
    this.model.masterCompanyName = this.modifiedCompanyName(this.model.companyName, this.masterModel.fundList);
  }

  /**
  This function takes a company name and a list of funds as input, and returns the company name with any parenthetical fund names removed.
  @param companyName The company name to modify.
  @param fundList A list of funds to check for.
  @returns The modified company name. */ 

  modifiedCompanyName(companyName: string, fundList:any){
    let valuesList = companyName?.match(/\((.*?)\)/g)?.map((b:string) => b.replace(/\(|(.*?)\)/g, "$1"));
    if (valuesList?.length > 0 && fundList?.length>0) {
      for (const element of valuesList) {
        let funds = fundList.filter((x:any) => x.fundName.toLowerCase() == element.toString().trim().toLowerCase());
        if (funds.length > 0) {
          let truncateString = '(' + element.toString() + ')';
          companyName = companyName.replace(truncateString, '')?.trim();
          break;
        }
      }
    }
    return companyName;
  }
  subSectorLoading: boolean = false;
  subSectorList: any[];
  GetSubSectorListBySectorId(sectorId: any) {
    this.subSectorList = [];
    this.subSectorLoading = true;
    sectorId = sectorId != null ? sectorId : this.model?.sectorDetail?.sectorID;
    if (sectorId == undefined)
      return;
    this.miscService.getSubSectorListBySectorId(sectorId?.toString()).subscribe({
      next:(data) => {
        this.subSectorLoading = false;
        this.subSectorList = data["body"];
        let local = this;

        if (
          this.model.subSectorDetail != null &&
          this.model.subSectorDetail.subSectorID > 0
        ) {
          let matchedList = this.subSectorList.filter(function (
            element: any,
            _index: any
          ) {
            return (
              element.subSectorID == local.model.subSectorDetail.subSectorID
            );
          });
          if (matchedList.length > 0) {
            this.model.subSectorDetail = matchedList[0];
          } else {
            this.model.subSectorDetail = null;
          }
        }
        this.subSectorLoading = false;
      },
      error:(_error) => {
        this.subSectorLoading = false;
      }
  });
  }
  myFunc(event) { event.stopPropagation(); }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groupList, event.previousIndex, event.currentIndex);
    this.saveOrder();
  }
  saveOrder()
  {
    this.portfolioCompanyService.updateDisplayOrder(this.groupList)
    .subscribe({
      next:(result: any) => {
        this.groupName ="";
        this.toastrService.success("Group reordered successfully", "", { positionClass: "toast-center-center" });
        this.getCompanyGroups();
      }, error:(_error) => {
        this.toastrService.error("Unable to reorder group!", "", { positionClass: "toast-center-center" });
  }});
  }
  addCompanyGroup()
  {
    if(this.groupName == null ||  this.groupName =="") return;
    let group={
      GroupName:this.groupName,
      FeatureId:this.feature.PortfolioCompany,
      DisplayOrder:this.groupList?.length == 0 || this.groupList == null ? 1 : this.groupList?.length + 1
    };
    this.portfolioCompanyService.addCompanyGroup(group)
    .subscribe({
      next:(result: any) => {
        this.groupName ="";
        this.toastrService.success("Group created successfully", "", { positionClass: "toast-center-center" });
        this.getCompanyGroups();
      }, error:(_error) => {
        this.toastrService.error("Already group exist!", "", { positionClass: "toast-center-center" });
      }});
  }
  updateGroup(group:any)
  {
    if(group.groupName == null || group.groupName =="") return;
    let groupConst={
      GroupId:group?.groupId,
      GroupName:group?.groupName,
      FeatureId:this.feature.PortfolioCompany,
      DisplayOrder:group.displayOrder
    };
    this.portfolioCompanyService.updateCompanyGroup(groupConst)
    .subscribe({
      next:(result: any) => {
        this.toastrService.success("Group updated successfully", "", { positionClass: "toast-center-center" });
        this.groupName ="";
        this.getCompanyGroups();
      }, error:(_error) => {
        this.toastrService.error("Already group exist!", "", { positionClass: "toast-center-center" });
      }});
  }
getCompanyGroups(){
  this.portfolioCompanyService.getCompanyGroup(this.feature.PortfolioCompany)
  .subscribe({
    next:(result: any) => {
      this.groupList = result;
      this.originalGroupList = JSON.parse(JSON.stringify(result));
    }, error:(_error) => {
      this.groupList = [];
    }});
}
deleteCompanyGroup(){
  this.portfolioCompanyService.deleteCompanyGroup(this.selectedCompanyGroup.groupId)
  .subscribe({
    next:(result: any) => {
      this.toastrService.success("Group deleted successfully", "", { positionClass: "toast-center-center" });
       this.selectedCompanyGroup =null;
      this.getCompanyGroups();
    }, error:(_error) => {
      this.toastrService.error("Unable to delete group", "", { positionClass: "toast-center-center" });
}});
}
deleteGroup(group:any){
 this.selectedCompanyGroup = group;
 this.deleteCompanyGroup();
}
cancelDelete(){
  this.confirmDelete = false;
}
editGroup(group:any)
{
  group.isEditable = true;
}
cancelSelection(group)
{
  let groupConst =  this.originalGroupList.find(x=>x.groupId == group.groupId);
  if(groupConst!=undefined && groupConst!=null)
  {
    group.groupName = groupConst.groupName;
  }
}
  //// newly added methods for List Custom Fields
  numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }
  decimalNumbersOnlyValidator(event: any) {
    const pattern = /^[0-9,.\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9,.\-]/g, "");
    }
  }
  isNumberKey(evt, obj) {
    let charCode = (evt.which) ? evt.which : evt.keyCode
    let value = obj.value;
    let dotContains = value.indexOf(".") != -1;
    if (dotContains)
      if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  onChangeDate(event, pcCustomField) {
    let d = new Date(Date.parse(event));
    let date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    let index = this.customfieldValueList.findIndex(x => x.displayName == pcCustomField.displayName);
    if (index != null) {
      let data = this.customfieldValueList;
      data[index].value = (date || '').trim();
      this.customfieldValueList = data
      this.model.customFieldValueList = data;
    }
  }
  CustomListAddOrUpdate(data: any[] = []): void {
    if (data.length > 0) {
      if (this.customPortfolioGroupList.length > 0) {
        this.customPortfolioGroupList = this.customPortfolioGroupList.filter(obj1 => !data.some(obj2 => obj1.fieldId === obj2.fieldId));
      }
      data.forEach(x => {
        this.customPortfolioGroupList.push(x);
      });
      this.model.customPortfolioGroupList = this.customPortfolioGroupList
    }
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
	return from.subscribe(
	  data => to.next(data),
	  err => to.error(err),
	  () => to.complete(),
	);
  }
