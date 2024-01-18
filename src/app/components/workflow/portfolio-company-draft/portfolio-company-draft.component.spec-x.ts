import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CryptoService } from 'src/app/services/crypto.service';
import { PermissionService,ActionsEnum,UserSubFeaturesEnum ,FeaturesEnum} from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { DataService } from 'src/app/services/data-service.service';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { WorkflowConstants } from 'src/app/common/constants';
import { PortfolioCompanyDraftComponent } from './portfolio-company-draft.component';

describe('PortfolioCompanyDraftComponent', () => {
  let component: PortfolioCompanyDraftComponent;
  let fixture: ComponentFixture<PortfolioCompanyDraftComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (message, string, object) => ({}),
      error: (arg, string, object) => ({})
    });
    const cryptoServiceStub = () => ({});
    const permissionServiceStub = () => ({});
    const workflowCompanyServiceStub = () => ({
      getWorkflowPermissions: workFlowRequest => ({ subscribe: f => f({}) }),
      discardWorkflow: workflowRequest => ({ subscribe: f => f({}) }),
      createWorkflow: workflowRequest => ({ subscribe: f => f({}) }),
      updateWorkflow: workflowRequest => ({ subscribe: f => f({}) }),
      moveStatusToNextLevel: workFlowRequestId => ({ subscribe: f => f({}) }),
      publishWorkflow: workFlowRequestId => ({ subscribe: f => f({}) }),
      getWorkflowAllDetails: workFlowRequestId => ({ subscribe: f => f({}) }),
      ResetWorkflowStatus: workFlowRequestId => ({ subscribe: f => f({}) })
    });
    const dataServiceStub = () => ({
      changeWorkflowRequestId: arg => ({}),
      changeWorkflowMappingId: arg => ({})
    });
    const oidcAuthServiceStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const pageConfigurationServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyDraftComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: CryptoService, useFactory: cryptoServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: WorkflowCompanyService,
          useFactory: workflowCompanyServiceStub
        },
        { provide: DataService, useFactory: dataServiceStub },
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(PortfolioCompanyDraftComponent);
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

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`panelOpenState has default value`, () => {
    expect(component.panelOpenState).toEqual(true);
  });

  it(`reportDataList has default value`, () => {
    expect(component.reportDataList).toEqual([]);
  });

  it(`datapermissionList has default value`, () => {
    expect(component.datapermissionList).toEqual([]);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(true);
  });

  it(`workFlowRequestId has default value`, () => {
    expect(component.workFlowRequestId).toEqual(0);
  });

  it(`workflowMappingIds has default value`, () => {
    expect(component.workflowMappingIds).toEqual([]);
  });

  it(`IsValidUser has default value`, () => {
    expect(component.IsValidUser).toEqual(true);
  });

  it(`showConfirmDiscardDraftModel has default value`, () => {
    expect(component.showConfirmDiscardDraftModel).toEqual(false);
  });

  it(`isCompanyInfo has default value`, () => {
    expect(component.isCompanyInfo).toEqual(false);
  });

  it(`isInvestmentKPI has default value`, () => {
    expect(component.isInvestmentKPI).toEqual(false);
  });

  it(`isCompanyKPI has default value`, () => {
    expect(component.isCompanyKPI).toEqual(false);
  });

  it(`isOperationalKPI has default value`, () => {
    expect(component.isOperationalKPI).toEqual(false);
  });

  it(`isTradingRecordsKPI has default value`, () => {
    expect(component.isTradingRecordsKPI).toEqual(false);
  });

  it(`isSubmit has default value`, () => {
    expect(component.isSubmit).toEqual(false);
  });

  it(`showSubmitCancelModel has default value`, () => {
    expect(component.showSubmitCancelModel).toEqual(false);
  });

  it(`companyRedirect has default value`, () => {
    expect(component.companyRedirect).toEqual(false);
  });

  it(`publishPageRedirect has default value`, () => {
    expect(component.publishPageRedirect).toEqual(false);
  });

  it(`showSubmitPublishModel has default value`, () => {
    expect(component.showSubmitPublishModel).toEqual(false);
  });

  it(`showUnselectSelectionModel has default value`, () => {
    expect(component.showUnselectSelectionModel).toEqual(false);
  });

  it(`workflowConstants has default value`, () => {
    expect(component.workflowConstants).toEqual(WorkflowConstants);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getWorkflowAllDetails').and.callThrough();
      spyOn(component, 'getPrerequisitePermission').and.callThrough();
      spyOn(component, 'setWorkflowRequest').and.callThrough();
      component.ngOnInit();
      expect(component.getWorkflowAllDetails).toHaveBeenCalled();
      expect(component.getPrerequisitePermission).toHaveBeenCalled();
      expect(component.setWorkflowRequest).toHaveBeenCalled();
    });
  });

  describe('getPrerequisitePermission', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPermissions').and.callThrough();
      spyOn(component, 'getDataHideShowPermissionslist').and.callThrough();
      component.getPrerequisitePermission();
      expect(component.getPermissions).toHaveBeenCalled();
      expect(component.getDataHideShowPermissionslist).toHaveBeenCalled();
    });
  });

  describe('getDataHideShowPermissionslist', () => {
    it('makes expected calls', () => {
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(component, 'isExists').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'getWorkflowPermissions'
      ).and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      component.getDataHideShowPermissionslist();
      expect(component.isExists).toHaveBeenCalled();
      expect(
        workflowCompanyServiceStub.getWorkflowPermissions
      ).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('discardDraft', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(workflowCompanyServiceStub, 'discardWorkflow').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      component.discardDraft();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.discardWorkflow).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('makes expected calls', () => {
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(component, 'setResponseMessage').and.callThrough();
      spyOn(component, 'setErrorMessage').and.callThrough();
      spyOn(workflowCompanyServiceStub, 'createWorkflow').and.callThrough();
      spyOn(workflowCompanyServiceStub, 'updateWorkflow').and.callThrough();
      component.submit();
      expect(component.setResponseMessage).toHaveBeenCalled();
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.createWorkflow).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.updateWorkflow).toHaveBeenCalled();
    });
  });

  describe('setErrorMessage', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.setErrorMessage();
      expect(toastrServiceStub.error).toHaveBeenCalled();
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

  describe('moveToNextLevel', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(component, 'resetStatus').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'moveStatusToNextLevel'
      ).and.callThrough();
      component.moveToNextLevel();
      expect(component.resetStatus).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(
        workflowCompanyServiceStub.moveStatusToNextLevel
      ).toHaveBeenCalled();
    });
  });

  describe('publishWorkFlow', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(component, 'redirectToCompanyDetail').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(workflowCompanyServiceStub, 'publishWorkflow').and.callThrough();
      component.publishWorkFlow();
      expect(component.redirectToCompanyDetail).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.publishWorkflow).toHaveBeenCalled();
    });
  });

  describe('getWorkflowAllDetails', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'getWorkflowAllDetails'
      ).and.callThrough();
      component.getWorkflowAllDetails();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(
        workflowCompanyServiceStub.getWorkflowAllDetails
      ).toHaveBeenCalled();
    });
  });

  describe('resetAllStatus', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'ResetWorkflowStatus'
      ).and.callThrough();
      spyOn(component, 'resetAllStatus').and.callThrough();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(workflowCompanyServiceStub.ResetWorkflowStatus).toHaveBeenCalled();
      expect(component.resetAllStatus).toHaveBeenCalled();
    });
  });
});
