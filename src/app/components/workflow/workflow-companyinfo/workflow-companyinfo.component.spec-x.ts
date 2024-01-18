import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissionService,FeaturesEnum,UserSubFeaturesEnum,ActionsEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DataService } from 'src/app/services/data-service.service';
import { WorkflowConstants,CompanyPageSectionConstants,CompanyInformationConstants } from 'src/app/common/constants';
import { FormsModule } from '@angular/forms';
import { WorkflowCompanyinfoComponent } from './workflow-companyinfo.component';

describe('WorkflowCompanyinfoComponent', () => {
  let component: WorkflowCompanyinfoComponent;
  let fixture: ComponentFixture<WorkflowCompanyinfoComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({
      error: (string, string1, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const permissionServiceStub = () => ({});
    const workflowCompanyServiceStub = () => ({
      getCompanyWorkFlowDraft: (workFlowRequestId, id) => ({
        subscribe: f => f({})
      }),
      addWorkflowComment: object => ({ subscribe: f => f({}) }),
      getWorkflowComments: workflowMappingId => ({ subscribe: f => f({}) }),
      updateWorkflowRequest: request => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({});
    const dataServiceStub = () => ({
      changeWorkflowRequestId: arg => ({}),
      changeWorkflowMappingId: arg => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowCompanyinfoComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: WorkflowCompanyService,
          useFactory: workflowCompanyServiceStub
        },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: DataService, useFactory: dataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowCompanyinfoComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`subFeature has default value`, () => {
    expect(component.subFeature).toEqual(UserSubFeaturesEnum);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual(ActionsEnum);
  });

  it(`dataInformation has default value`, () => {
    expect(component.dataInformation).toEqual([]);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(true);
  });

  it(`workflowMappingId has default value`, () => {
    expect(component.workflowMappingId).toEqual(0);
  });

  it(`showAddCommentPopup has default value`, () => {
    expect(component.showAddCommentPopup).toEqual(false);
  });

  it(`disableAddCommentDoneBtn has default value`, () => {
    expect(component.disableAddCommentDoneBtn).toEqual(true);
  });

  it(`workFlowRequestId has default value`, () => {
    expect(component.workFlowRequestId).toEqual(0);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isOpenCommentsPopup has default value`, () => {
    expect(component.isOpenCommentsPopup).toEqual(false);
  });

  it(`commentsList has default value`, () => {
    expect(component.commentsList).toEqual([]);
  });

  it(`disableCloseButton has default value`, () => {
    expect(component.disableCloseButton).toEqual(true);
  });

  it(`disableUpdateButton has default value`, () => {
    expect(component.disableUpdateButton).toEqual(true);
  });

  it(`isMarkedForReview has default value`, () => {
    expect(component.isMarkedForReview).toEqual(true);
  });

  it(`IsValidUser has default value`, () => {
    expect(component.IsValidUser).toEqual(false);
  });

  it(`myFlagForButtonToggle has default value`, () => {
    expect(component.myFlagForButtonToggle).toEqual(true);
  });

  it(`workflowConstants has default value`, () => {
    expect(component.workflowConstants).toEqual(WorkflowConstants);
  });

  it(`CIFieldExclude has default value`, () => {
    expect(component.CIFieldExclude).toEqual(component.CIFieldExclude);
  });

  it(`fieldValueList has default value`, () => {
    expect(component.fieldValueList).toEqual([]);
  });

  it(`subPageList has default value`, () => {
    expect(component.subPageList).toEqual([]);
  });

  it(`companyPageSectionConstants has default value`, () => {
    expect(component.companyPageSectionConstants).toEqual(
      CompanyPageSectionConstants
    );
  });

  it(`companyInformationConstants has default value`, () => {
    expect(component.companyInformationConstants).toEqual(
      CompanyInformationConstants
    );
  });

  describe('setCompanyInfo', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setCompanyInfo').and.callThrough();
      component.setCompanyInfo();
      expect(component.setCompanyInfo).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      component.ngOnChanges();
    });
  });

  describe('setCompanyInfo', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      spyOn(component, 'loadCompanyInformation').and.callThrough();
      component.setCompanyInfo();
      expect(component.setToggleStatus).toHaveBeenCalled();
      expect(component.loadCompanyInformation).toHaveBeenCalled();
    });
  });

  describe('loadCompanyInformation', () => {
    it('makes expected calls', () => {
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(
        workflowCompanyServiceStub,
        'getCompanyWorkFlowDraft'
      ).and.callThrough();
      component.loadCompanyInformation();
     expect(
        workflowCompanyServiceStub.getCompanyWorkFlowDraft
      ).toHaveBeenCalled();
    });
  });

  describe('SaveComment', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(component, 'setIsMarked').and.callThrough();
      spyOn(component, 'setPublish').and.callThrough();
      spyOn(component, 'setReject').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(workflowCompanyServiceStub, 'addWorkflowComment').and.callThrough();
      component.SaveComment();
      expect(component.setIsMarked).toHaveBeenCalled();
      expect(component.setPublish).toHaveBeenCalled();
      expect(component.setReject).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.addWorkflowComment).toHaveBeenCalled();
    });
  });

  describe('getComments', () => {
    it('makes expected calls', () => {
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(component, 'resetAddCommentPopup').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'getWorkflowComments'
      ).and.callThrough();
      component.getComments();
      expect(component.resetAddCommentPopup).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.getWorkflowComments).toHaveBeenCalled();
    });
  });

  describe('resetAddCommentPopup', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      component.resetAddCommentPopup();
      expect(component.setToggleStatus).toHaveBeenCalled();
    });
  });

  describe('openCommentsPopUp', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getComments').and.callThrough();
      component.openCommentsPopUp();
      expect(component.getComments).toHaveBeenCalled();
    });
  });

  describe('setWorkflowRequest', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(dataServiceStub, 'changeWorkflowRequestId').and.callThrough();
      spyOn(dataServiceStub, 'changeWorkflowMappingId').and.callThrough();
      component.setWorkflowRequest();
      expect(dataServiceStub.changeWorkflowRequestId).toHaveBeenCalled();
      expect(dataServiceStub.changeWorkflowMappingId).toHaveBeenCalled();
    });
  });

  describe('setReject', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateWorkflowRequest').and.callThrough();
      component.setReject();
      expect(component.updateWorkflowRequest).toHaveBeenCalled();
    });
  });

  describe('setPublish', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateWorkflowRequest').and.callThrough();
      component.setPublish();
      expect(component.updateWorkflowRequest).toHaveBeenCalled();
    });
  });

  describe('setIsMarked', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateWorkflowRequest').and.callThrough();
      component.setIsMarked();
      expect(component.updateWorkflowRequest).toHaveBeenCalled();
    });
  });
});
