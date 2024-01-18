import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { CryptoService } from 'src/app/services/crypto.service';
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { DataService } from 'src/app/services/data-service.service';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { WorkflowConstants } from 'src/app/common/constants';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { UserPermissionEntity } from "../../../common/enums";


@Component({
  selector: 'app-portfolio-company-draft',
  templateUrl: './portfolio-company-draft.component.html',
  styleUrls: ['./portfolio-company-draft.component.scss']
})
export class PortfolioCompanyDraftComponent implements OnInit {
  companyinformation: any = {};
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  isLoader: boolean = false;
  panelOpenState = true;
  permissionList: any;
  reportDataList: any = [];
  permissionListOriginal: any;
  id: any;
  datapermissionList = [];
  isDisabledBtn: boolean = true;
  currentStatus: any;
  workFlowRequestId: number = 0;
  workflowMappingIds: any[] = [];
  headquarterLocation: any;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  IsValidUser = true;
  showConfirmDiscardDraftModel = false;
  companyInfoModel: any = null;
  draftName: string = "";
  isCompanyInfo:boolean = false;
  isInvestmentKPI:boolean = false;
  isCompanyKPI:boolean = false;
  isOperationalKPI:boolean = false;
  isTradingRecordsKPI:boolean = false;
  isSubmit:boolean = false;
  workflowDetails:any = null;
  showSubmitCancelModel:boolean = false;
  companyRedirect:boolean = false;
  publishPageRedirect:boolean = false;
  showSubmitPublishModel:boolean = false;
  showUnselectSelectionModel:boolean = false;
  sectionSelectedData: any = {};
  workflowConstants = WorkflowConstants;
  
  constructor(private pageConfigurationService: PageConfigurationService, private _avRoute: ActivatedRoute, private cryptoService: CryptoService, private workflowCompanyService: WorkflowCompanyService,
    private toastrService: ToastrService, private dataService: DataService, private permissionService: PermissionService,
    private ids: OidcAuthService, private route: Router) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }

  ngOnInit() {
    this.workFlowRequestId = history?.state?.data?.WorkflowRequestId;
    this.draftName = history?.state?.data?.DraftName;
    if (this.workFlowRequestId == undefined)
    {
      let draftData=localStorage.getItem("currentWorkflowId") != "" ? JSON.parse(localStorage.getItem("currentWorkflow")):null;
      this.workFlowRequestId = draftData?.WorkflowRequestId;
      this.draftName = draftData?.DraftName;
    }
    this.toastrService.overlayContainer = this.toastContainer;
    this.reportDataList.push({ "name": "LP Report Data" });
    this.reportDataList.push({ "name": "Board Report Data" });
    this.getWorkflowAllDetails();  
    this.companyinformation.workFlowRequestId = this.workFlowRequestId;
    this.getPrerequisitePermission();   
    this.setWorkflowRequest();
  }

  getPrerequisitePermission() {
    this.isLoader = true;
    Promise.all([this.getUserSubFeaturePermissions(), this.getConfiguration()]).then((results) => {
      let userSubFeaturePermission = results[0];
      let pageConfigurationSettings = results[1];
     
      this.getPermissions(pageConfigurationSettings, userSubFeaturePermission);
      this.getDataHideShowPermissionslist();
      this.isLoader = false;
    });
  }

getUserSubFeaturePermissions=():Promise<any[]>  => {
  let local = this;
  return new Promise<any[]> ((resolve, reject) => {
    let claims = local.ids.getClaimsFromToken();
  if (claims != null) {
    let username = claims.preferred_username;
    local.permissionService.getUserSubFeature({
      EmailId: username,
      Entity : UserPermissionEntity.PortfolioCompany.toString,
      EncryptedFeatureMappingId : this.id })
          .subscribe(
            (result) => {            
             resolve(result && result.body);
            }, (error) => {
            });
          }
          else {
            reject(false);
          }
  });
  
}
  getConfiguration =() : Promise<any[]>=> {
   
    return new Promise<any[]> ((resolve, reject) => {
      this.pageConfigurationService.getPageConfiguration()
      .subscribe(
        (result: any) => {
          let finalPCSections = this.parseJsonResponse(result);        
        
         
          resolve(finalPCSections);
        }, (error) => {
          this.isLoader = false;
        });
    });
    
  }

  parseJsonResponse = (result: any[]) => {
    
    if ((result == null || undefined)) return;
    let pcField = result.filter(x => x.isActive && x.name == "Portfolio Company");
    let subPageDetails = pcField[0].subPageDetailList.filter(x=> x.isActive).map(x => ({ id: x.id, name: x.name, displayName: x.displayName }));;
    let supportedSubFeatureSection = ["Static Information", "Company Financials", "Commentary"]
    let kpiSection = pcField[0].subPageDetailList.filter(x=>x.name == "Key Performance Indicator");
    let kpiFields = kpiSection[0].subPageFieldList.filter(x=> x.isActive).map(x => ({ id: x.id, name: x.name, displayName: x.displayName }));

    let finalPCSections = [];
    subPageDetails.forEach(x => {
      if(supportedSubFeatureSection.includes(x.name)){
        finalPCSections.push(x);
      }
    });
    kpiFields.forEach(x => {      
        finalPCSections.push(x);
    });
    return finalPCSections;
  }

   groupBy = (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), 
    {},
  ); 

  /*TODO : Rework required with new design */
  getPermissions(pageConfigData: any[], permissionData :any[]) {   
    let activePCSections = pageConfigData ;
    let pcSubFeaturePermission =  permissionData.filter(x => x.encryptedFeatureMappingId === this.id);
    let groupBySybfeature = this.groupBy(pcSubFeaturePermission,'subFeatureID');
    let finalPermission:any[] = [];  
    Object.keys(groupBySybfeature).forEach(idx => {     
      let element = groupBySybfeature[idx];
      let obj = element[0];     
      element.forEach(x=> {
        let {canView, canAdd,canEdit,canImport,canExport} =x;
        obj.canView = obj.canView || canView;
        obj.canAdd = obj.canAdd || canAdd;
        obj.canEdit = obj.canEdit || canEdit;
        obj.canImport = obj.canImport || canImport;
        obj.canExport = obj.canExport || canExport;
      });
      finalPermission.push(obj);
      
    });

    let permission = finalPermission.filter((x: { canEdit: boolean}) => x.canEdit === true );
    permission = [...new Map(permission.map(item =>
      [item['subFeatureID'], item])).values()];
    let mappingSubFeaturePageConfig = [
      { source : "Static Data Business Desciption Investment Professional", target :"Static Information"

      },
      { source : "Trading Records", target :"TradingRecords"

      },
      { source : "Operational KPIs", target :"OperationalKPIs"

      },
      { source : "Investment KPIs", target :"InvestmentKPIs"

      },
      { source : "Company KPIs", target :"CompanyKPIs"

      },
      { source : "Impact KPIs", target :"ImpactKPIs"

      },
      { source : "Credit KPI", target :"CreditKPI"

      },
      { source : "Financials", target :"Company Financials"

    },
      { source : "Commentary", target :"Commentary"

      }
      
    ];

    let filterPCSection = [];    
    activePCSections.filter( x=> {
      let item = mappingSubFeaturePageConfig.find(i=> i.target == x.name);
      if( item != null){
        filterPCSection.push(Object.assign({}, x, item));
      }
    });

    let tempPermissionlist = [];
   filterPCSection.forEach(x=> {
    let item = permission.find(i=> i.subFeatureName == x.source);
     if(item!= null){      
      tempPermissionlist.push(Object.assign({}, item, x));
    }
   });

   tempPermissionlist.forEach(function (e) {
      if (typeof e === "object") {
        e["isChecked"] = false;
      }
    });
    this.reportDataList.forEach(function (e) {
      if (typeof e === "object") {
        e["isChecked"] = false;
      }
    });
    this.permissionListOriginal = JSON.parse(JSON.stringify(tempPermissionlist));
    this.permissionList = tempPermissionlist;
    this.isDisabledBtn = true;
  }

  
  getDataHideShowPermissionslist() {
    let workFlowRequest = {
      EncryptedRequestId: this.id,
      FeatureId: this.feature.PortfolioCompany,
      WorkflowRequestId: this.workFlowRequestId
    };
    this.workflowCompanyService.getWorkflowPermissions(workFlowRequest).subscribe(
      (result) => {
        if (result.length > 0) {
          this.datapermissionList = result;
          this.workflowMappingIds = result;
          this.IsValidUser = this.datapermissionList[0].isValidUser
          this.panelOpenState = false;
          for (let i = 0; i < this.permissionList.length; i++) {
            this.permissionList[i].isChecked = this.isExists(this.permissionList[i]['subFeatureID']);
          }
          this.isCompanyInfo =this.isExists(this.subFeature.StaticDataBusinessDesciptionInvestmentProfessional);
          this.isInvestmentKPI =this.isExists(this.subFeature.InvestmentKPIs);
          this.isCompanyKPI =this.isExists(this.subFeature.CompanyKPIs);
          this.isOperationalKPI =this.isExists(this.subFeature.OperationalKPIs);
          this.isTradingRecordsKPI =this.isExists(this.subFeature.TradingRecords);
          if(this.workflowDetails.isEnd && this.companyRedirect){
            this.route.navigate(['/portfolio-company-detail', this.id]);
          }
          if(this.publishPageRedirect){
            this.route.navigate(['/portfolio-company']);
          }
        }
      }
    );
  }

  showConfirmDiscardDraft() {
    this.showConfirmDiscardDraftModel = true;
  }
  cancelConfirmDiscardDraft() {
    this.showConfirmDiscardDraftModel = false;
  }

  discardDraft() {   

    let workflowRequest = { WorkflowRequestId: this.workFlowRequestId, EncryptedRequestId: this.id };
    this.workflowCompanyService.discardWorkflow(workflowRequest).subscribe((res: any) => {
      this.toastrService.success(res.message, "", { positionClass: "toast-center-center" });
      this.showConfirmDiscardDraftModel = false;
      this.route.navigate(['/portfolio-company']);
    }, error => {
      this.toastrService.error(error?.error?.message, "", { positionClass: "toast-center-center" });
      this.showConfirmDiscardDraftModel = false;
    });
  }

  submit() {
    let subFeatureIds = this.permissionList.filter((x: { isChecked: boolean; }) => x.isChecked === true).map((x: { subFeatureID: any; }) => x.subFeatureID);
    this.isLoader = true;
    let workflowRequest: any = {};
    workflowRequest.EncryptedRequestId = this.id;
    workflowRequest.FeatureId = this.feature.PortfolioCompany;
    workflowRequest.SubFeatureId = subFeatureIds;
    workflowRequest.WorkflowRequestId = this.workFlowRequestId;
    if (this.workflowMappingIds.length == 0) {
      this.workflowCompanyService.createWorkflow(workflowRequest).subscribe((res: any) => {
        this.setResponseMessage(res);
      }, error => {
        this.setErrorMessage();
      });
    }
    else {
      const UpdatesubFeature = [];
      this.permissionList.forEach(element => {
        const _object: any = {};
        _object.isChecked = element.isChecked;
        _object.SubFeatureId = element.subFeatureID;
        UpdatesubFeature.push(_object);
      });
      workflowRequest.WorkFlowSubFeatureList = UpdatesubFeature;
      workflowRequest.WorkflowRequestId = this.workFlowRequestId;
      this.workflowCompanyService.updateWorkflow(workflowRequest).subscribe((res: any) => {
        this.setResponseMessage(res);
      }, error => {
        this.setErrorMessage();
      });
    }
  }
  setErrorMessage()
  {
    this.isLoader = false;
    this.isDisabledBtn = false;
    this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
  }
  setResponseMessage(result:any)
  {
    this.companyinformation.workFlowRequestId = result.workFlowRequestId;
    this.companyinformation = Object.assign({}, this.companyinformation);
    this.panelOpenState = false;
    this.isLoader = false;
    this.toastrService.success("Sections loaded for editing successfully", "", { positionClass: "toast-center-center" });
    this.getWorkflowAllDetails();
    this.getDataHideShowPermissionslist();
  }
  handleCheckBox(event: any, item: any) {
    item["isChecked"] = event.checked;
    if(!event.checked){
      this.sectionSelectedData =  this.workflowDetails.workflowSectionLevels.find(x => x.subFeatureId == item.subFeatureID);
      if(this.sectionSelectedData?.length != 0 && this.sectionSelectedData?.isRework){
        this.showUnselectSelectionModel = true  
      }
    }
    this.checkAnyDataChange(); 
  }

  checkAnyDataChange() {
    if (JSON.stringify(this.permissionListOriginal) !== JSON.stringify(this.permissionList)) {
      this.isDisabledBtn = false;
    } else {
      this.isDisabledBtn = true;
    }
  }
  isExists(subFeatureId: any) {    
   const isSubfeatureAvailable = this.permissionList.some(function (el) {
    return el.subFeatureID === subFeatureId;
  });

    return  isSubfeatureAvailable && this.datapermissionList.some(function (el) {
      return el.subFeatureId === subFeatureId;
    });  
  }
  setWorkflowRequest() {
    this.dataService.changeWorkflowRequestId(this.workFlowRequestId?.toString());
    this.dataService.changeWorkflowMappingId(this.workFlowRequestId?.toString());
  }
  setCompanyInfoModel(model: any) {
    this.companyInfoModel = model;
  }
  moveToNextLevel()
  {
    this.workflowCompanyService.moveStatusToNextLevel(this.workFlowRequestId).subscribe((result: any) => {
      this.showSubmitCancelModel = false;
      this.publishPageRedirect = true;
      this.toastrService.success("Data submitted successfully", "", { positionClass: "toast-center-center" });
      this.resetStatus(true);

    }, error => {
      this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
    });
  }

  publishWorkFlow()
  {
    this.isLoader = true;
    this.workflowCompanyService.publishWorkflow(this.workFlowRequestId).subscribe((result: any) => {
      this.isLoader = false;
      this.showSubmitPublishModel = false;
      let pc =result;
      if(pc!= null){
        this.toastrService.success("Data Publish successfully", "", { positionClass: "toast-center-center" });
        this.redirectToCompanyDetail(pc);
      }
      else
      {
        this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
      }
    }, error => {
      this.isLoader = false;
      this.showSubmitPublishModel = false;
      this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
    });
  }

  redirectToCompanyDetail(pc: any) {
    localStorage.setItem("headerName", pc.companyName);
    this.route.navigate(['/portfolio-company-detail', pc.encryptedPortfolioCompanyId]);
 }


  getWorkflowAllDetails()
  {
    this.workflowCompanyService.getWorkflowAllDetails(this.workFlowRequestId).subscribe((result: any) => {
     this.workflowDetails = result;
    }, error => {
      this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
    });

  }

  resetStatus(isMarked: boolean) {
 
    if(isMarked)
    {
      this.getWorkflowAllDetails();
      this.getDataHideShowPermissionslist();
    }
  }
  resetAllStatus()
  {
    this.workflowCompanyService.ResetWorkflowStatus(this.workFlowRequestId).subscribe((result: any) => {
      this.toastrService.success("Reset all sections successfully", "", { positionClass: "toast-center-center" });
     }, error => {
       this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
     });
  }

  sectionDelectionCancel(){
    this.showUnselectSelectionModel = false;
    let recordIndex = this.permissionList.findIndex(x => x.subFeatureID == this.sectionSelectedData["subFeatureId"])
    if(recordIndex != -1){
      this.permissionList[recordIndex].isChecked = true;
    }
  }
}
