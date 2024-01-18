import { Component, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DataService } from 'src/app/services/data-service.service';
import { WorkflowConstants } from 'src/app/common/constants';
import {WorkflowCompanyStaticModel} from "../models/workflow-info";
import {CompanyPageSectionConstants, CompanyInformationConstants} from "../../../common/constants";
import {PageConfigurationSubFeature} from "../../../common/enums";
import {WorkflowRequestModel} from "../../../common/models";
@Component({
  selector: 'app-workflow-companyinfo',
  templateUrl: './workflow-companyinfo.component.html',
  styleUrls: ['./workflow-companyinfo.component.scss']
})
export class WorkflowCompanyinfoComponent implements OnInit, OnChanges {
  @Output() onStatusChanges: EventEmitter<any> = new EventEmitter();
  @Output() onCompanyInfoModel: EventEmitter<any> = new EventEmitter();
  @Input() CompanyInformation: any;
  @Input() workflowDetails: any = null;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  id: any;
  @Input() dataInformation = [];
  isDisabledBtn: boolean = true;
  currentStatus: any;
  model: any = {
    geographicLocations: [],
    pcEmployees: [],
  };
  workflowMappingId: number = 0;
  headquarterLocation: any;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  showAddCommentPopup = false;
  disableAddCommentDoneBtn = true;
  comment = "";
  workFlowRequestId: number = 0;
  isLoading: boolean = false;
  isLoader: boolean = false;
  isOpenCommentsPopup: boolean = false;
  commentsList = [];
  commentDesc: any;
  disableCloseButton: boolean = true;
  disableUpdateButton:boolean = true;
  commentListOriginal:any;
  isMarkedForReview:boolean = true;
  statusId = -1;
  IsValidUser = false;
  currentSectionStatus ="";
  sectionData:any =null;
  toggleStatus:any="";
  myFlagForButtonToggle = true;
  workflowConstants = WorkflowConstants;
  CIFieldExclude:any[] = [CompanyInformationConstants.CompanyLogo,
     CompanyInformationConstants.BusinessDescription];
  fieldValueList :any = [];
  subPageList : any = [];
  businessModel: WorkflowCompanyStaticModel;
  companyLogoModel : WorkflowCompanyStaticModel;
  companyStatusModel : WorkflowCompanyStaticModel;
  companyPageSectionConstants = CompanyPageSectionConstants;
  companyInformationConstants = CompanyInformationConstants;
  commentFieldList:any[];
  investmentProfessionFieldList:[];
  geographicLocationFieldList:[];


  constructor(private _avRoute: ActivatedRoute, private dataService: DataService, private workflowCompanyService: WorkflowCompanyService, private toastrService: ToastrService, private portfolioCompanyService: PortfolioCompanyService, private permissionService: PermissionService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    let emptyStaticObj = <WorkflowCompanyStaticModel>({
      Name : "",
      DisplayName:"",
      Value : "NA",
      IsActive : false
    });
    this.businessModel = emptyStaticObj;
    this.companyStatusModel = emptyStaticObj;
    this.companyLogoModel = emptyStaticObj;
  }
  ngOnInit(): void {
    if(this.dataInformation.length>0)
      this.setCompanyInfo();
  }
  ngOnChanges() {
    if (this.dataInformation.length > 0)
      this.setCompanyInfo();
  }

  getFieldDisplayName( items : any, sectionName : string) {
    let result = items.find(x=> x.name == sectionName);

    return (result && result.displayName) || "";
  }

  isFieldActive(items: any[], sectionName: string): boolean {
    let result = items.find(x => x.name == sectionName);
    return ( (result && result.isActive) ||false);
    
  }
  
  setCompanyInfo()
  {
   
    this.sectionData = this.workflowDetails.workflowSectionLevels.find(x=>x.subFeatureId==this.subFeature.StaticDataBusinessDesciptionInvestmentProfessional);
    this.setToggleStatus();
    let subfeatureModel= this.dataInformation.find(x=>x.subFeatureId==this.subFeature.StaticDataBusinessDesciptionInvestmentProfessional);
    this.workFlowRequestId = subfeatureModel.workflowRequestId;
    this.workflowMappingId = subfeatureModel.workflowMappingId;
    this.isMarkedForReview = subfeatureModel.isMarkedForReview;
    this.IsValidUser = subfeatureModel.isValidUser;
    this.statusId = subfeatureModel.statusId;
    this.loadCompanyInformation();
  }
  setToggleStatus()
  {
    if(!this.workflowDetails?.isEnd && !this.workflowDetails?.isStart)
      this.toggleStatus = this.sectionData.isRework?'Rework':this.sectionData.isApprove?'Approve':'';
    if(this.workflowDetails?.isEnd)
      this.toggleStatus = this.sectionData.isRework?'Reject':this.sectionData.isApprove?'Publish':''; 
  }
  isExists(subFeatureId: any) {
    return this.dataInformation.some(function (el) {
      return el.subFeatureId === subFeatureId;
    });
  }

  transform(value:string): string {
    let first = value?.substr(0,1).toUpperCase();
    return first + value?.substr(1);
  }
  sortByKey(array, key) {
    return array.sort(function(a, b) {
        let x = a[key]; let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
  loadCompanyInformation() {
    this.isLoader = true;
    if (!this.isLoading) {
      this.isLoading = true;
      this.workflowCompanyService.getCompanyWorkFlowDraft(this.workFlowRequestId, this.id).subscribe((result: any) => {
        let resp = result["body"];

        if (resp != null && result.code == "OK") {
        this.subPageList = resp.subPageList;
        this.fieldValueList = resp.fieldValueList.filter(x => x.subPageID == PageConfigurationSubFeature.StaticInformation && !(this.CIFieldExclude.indexOf(x.name) > -1));
        let _businessModel = resp.fieldValueList.find(x => x.name == CompanyInformationConstants.BusinessDescription);
        this.commentFieldList = resp.fieldValueList.filter(x => x.subPageID == PageConfigurationSubFeature.Commentary);
        this.investmentProfessionFieldList = this.sortByKey(resp.fieldValueList,"sequence").filter(x=> x.subPageID == PageConfigurationSubFeature.InvestmentProfessionals);
        this.geographicLocationFieldList = this.sortByKey(resp.fieldValueList,"sequence").filter(x=> x.subPageID == PageConfigurationSubFeature.GeographicLocations);
        if(!_businessModel){
          this.businessModel = {
            Name : _businessModel.name,
            DisplayName :  _businessModel.displayName,
            Value : _businessModel.value,
            IsActive : _businessModel.isActive || false
          };

        }        
        let _companyLogo =   resp.fieldValueList.find(x => x.name == CompanyInformationConstants.CompanyLogo);
        
        if(!_companyLogo){
        this.companyLogoModel = {
          Name : _companyLogo.name,
          DisplayName:_companyLogo.displayName,
          Value : _companyLogo.value,
          IsActive :  _companyLogo.isActive || false
        }
      }
     
        let _companyStatus =  resp.fieldValueList.find(x => x.name == CompanyInformationConstants.CompanyStatus);
        if(!_companyStatus){
        this.companyStatusModel = {
          Name : _companyStatus.name,
          DisplayName:_companyStatus.displayName,
          Value : this.transform(_companyStatus.value),
          IsActive :  _companyStatus.isActive || false
        }
      }
        this.model = resp.companyDetails; 
        this.onCompanyInfoModel.emit(this.model);
        this.isLoading = false;
        this.isLoader = false;
        this.headquarterLocation = this.model.geographicLocations.filter(
          function (element: any, index: any) {
            return element.isHeadquarter;
          }
        )[0];
        }
      }, error => {
        this.isLoader = false;
      })
    }
  }
  getFYEnd(value) {
    if (value != null && value.split(' ').length > 3) {
      return value.split(' ')[3];
    } else
      return value;
  }

  SaveComment() {
    this.workflowCompanyService.addWorkflowComment({ comments: this.comment, workflowMappingId: this.workflowMappingId }).subscribe((res: any) => {
      this.comment ="";
     if(this.workflowDetails.isStart)
        this.setIsMarked();
     else if(this.toggleStatus =='Approve' || this.toggleStatus =='Publish')
        this.setPublish();
     else if(this.toggleStatus =='Rework'|| this.toggleStatus =='Reject')
        this.setReject();
    }, error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }
  getComments() {
    this.isLoader = true;
    this.workflowCompanyService.getWorkflowComments(this.workflowMappingId).subscribe((result: any) => {
      this.commentListOriginal =JSON.stringify(result);
      this.commentsList = result;
      this.isLoader = false;
    }, error => {
      this.isLoader = false;
    });
    this.resetAddCommentPopup();
  }

  OnInputAddComment(comment) {
    this.comment = comment;
    if (comment.length > 0) {
      this.disableAddCommentDoneBtn = false;
    } else {
      this.disableAddCommentDoneBtn = true;
    }
  }

  resetAddCommentPopup() {
    this.disableAddCommentDoneBtn = true;
    this.showAddCommentPopup = false;
    this.setToggleStatus();
  }
  closeCommentPopup() {
    this.isOpenCommentsPopup = false;
  }
  openCommentsPopUp() {
    this.getComments();
    this.isOpenCommentsPopup = true;
  }
  editComment(comment: any) {
    comment.isEditable = true;
  }
  closeComment(comment: any) {
    comment.isEditable = false;
  }
  updateComment(comment: any) {
    comment.comments = this.commentDesc;
    this.workflowCompanyService.addWorkflowComment(comment).subscribe((res: any) => {
      this.toastrService.success("Comment updated successfully", "", { positionClass: "toast-center-center" });
      this.disableUpdateButton = false;
      this.commentDesc = "";
      this.getComments();
    }, error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }
  onInputUpdateComment(comment: any, event:any ) {
    this.commentDesc = event.target.value;
    comment.comments = this.commentDesc;
    if (this.commentDesc.length > 0 && (this.commentListOriginal !== JSON.stringify(this.commentsList))) {
      this.disableUpdateButton = false;
    } else {
      this.disableUpdateButton = true;
    }
  }
  setWorkflowRequest() {
    this.dataService.changeWorkflowRequestId(this.workFlowRequestId?.toString());
    this.dataService.changeWorkflowMappingId(this.workflowMappingId?.toString());
    let workFlowReqModel:WorkflowRequestModel =  {
      MappingId:this.workflowMappingId,
      RequestId :this.workFlowRequestId
   }
   sessionStorage.removeItem("WorkflowRequestModel") ;  

   sessionStorage.setItem("WorkflowRequestModel" ,JSON.stringify(workFlowReqModel)) ;  

  }
  setReject()
  {
    let request = {
      IsRework:true,
      IsApprove:false,
      IsMarked:false,
      WorkflowMappingId:this.workflowMappingId
    };
    this.updateWorkflowRequest(request);
  }
  setPublish()
  {
    let request = {
      IsRework:false,
      IsApprove:true,
      IsMarked:false,
      WorkflowMappingId:this.workflowMappingId
    };
    this.updateWorkflowRequest(request);
  }
  setIsMarked()
  {
    let request = {
      IsRework:false,
      IsApprove:false,
      IsMarked:true,
      WorkflowMappingId:this.workflowMappingId
    };
    this.updateWorkflowRequest(request);
  }
  showCommentPopup(isOpen:boolean)
  {
    if(!isOpen)
      this.showAddCommentPopup = true;
  }
  updateWorkflowRequest(request:any)
  {
    this.workflowCompanyService.updateWorkflowRequest(request).subscribe((res: any) => {
      let message = this.toggleStatus == 'Approve' ? this.workflowConstants.MarkedForApprovalMessage : this.toggleStatus == 'Publish' ? this.workflowConstants.MarkedForPublishMessage : this.toggleStatus == 'Rework' ? this.workflowConstants.MarkedForReworkMessage : this.toggleStatus == 'Reject' ? this.workflowConstants.MarkedForRejectMessage : this.workflowConstants.MarkedForReviewMessage;
      this.toastrService.success(message, "", { positionClass: "toast-center-center" });
      this.resetAddCommentPopup();
      this.onStatusChanges.emit(true);
    }, error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }
}
