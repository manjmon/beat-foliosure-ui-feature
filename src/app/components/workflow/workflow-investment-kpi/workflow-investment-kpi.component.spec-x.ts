import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,SimpleChanges } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissionService,ActionsEnum,FeaturesEnum,UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { WorkflowInvestmentService } from 'src/app/services/WorkflowInvestmentService';
import { WorkflowConstants,NumberDecimalConst } from 'src/app/common/constants';
import { ExportTypeEnum } from 'src/app/services/miscellaneous.service';
import { FormsModule } from '@angular/forms';
import { WorkflowInvestmentKpiComponent } from './workflow-investment-kpi.component';
import { MatMenuModule } from '@angular/material/menu';


describe('WorkflowInvestmentKpiComponent', () => {
  let component: WorkflowInvestmentKpiComponent;
  let fixture: ComponentFixture<WorkflowInvestmentKpiComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: array => ({}) });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (string, string1, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (investmentKPIs, arg1, id) => ({})
    });
    const workflowCompanyServiceStub = () => ({
      getCompanyWorkFlowDraft: (requestId, id) => ({ subscribe: f => f({}) }),
      getWorkflowAllDetails: workFlowRequestId => ({ subscribe: f => f({}) }),
      UpdateWorkflowMappingStatus: mappingId => ({ subscribe: f => f({}) }),
      updateWorkflowKpiValue: datauditmodellog => ({ subscribe: f => f({}) }),
      addWorkflowComment: object => ({ subscribe: f => f({}) }),
      updateWorkflowRequest: request => ({ subscribe: f => f({}) }),
      getWorkflowComments: mappingId => ({ subscribe: f => f({}) })
    });
    const workflowInvestmentServiceStub = () => ({
      getWorkflowInvestmentKPIValues: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule,MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowInvestmentKpiComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: WorkflowCompanyService,
          useFactory: workflowCompanyServiceStub
        },
        {
          provide: WorkflowInvestmentService,
          useFactory: workflowInvestmentServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowInvestmentKpiComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`WorkflowConstants has default value`, () => {
    expect(component.WorkflowConstants).toEqual(WorkflowConstants);
  });

  it(`isOpenUpload has default value`, () => {
    expect(component.isOpenUpload).toEqual(false);
  });

  it(`showInvestment has default value`, () => {
    expect(component.showInvestment).toEqual(false);
  });

  it(`dataInformation has default value`, () => {
    expect(component.dataInformation).toEqual([]);
  });

  it(`mappingId has default value`, () => {
    expect(component.mappingId).toEqual(0);
  });

  it(`subFeature has default value`, () => {
    expect(component.subFeature).toEqual(UserSubFeaturesEnum);
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual(ActionsEnum);
  });

  it(`exportType has default value`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`blockedProfitabilityTable has default value`, () => {
    expect(component.blockedProfitabilityTable).toEqual(false);
  });

  it(`portfolioProfitabilityList has default value`, () => {
    expect(component.portfolioProfitabilityList).toEqual([]);
  });

  it(`portfolioCompanyProfitabilityClone has default value`, () => {
    expect(component.portfolioCompanyProfitabilityClone).toEqual([]);
  });

  it(`expandedOperationalKPIs has default value`, () => {
    expect(component.expandedOperationalKPIs).toEqual([]);
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`exportInvestmentKPILoading has default value`, () => {
    expect(component.exportInvestmentKPILoading).toEqual(false);
  });

  it(`InvestmentKPIOrginalData has default value`, () => {
    expect(component.InvestmentKPIOrginalData).toEqual([]);
  });

  it(`InvestmentKPIChartData has default value`, () => {
    expect(component.InvestmentKPIChartData).toEqual([]);
  });

  it(`InvestmentKPIChartCol has default value`, () => {
    expect(component.InvestmentKPIChartCol).toEqual([]);
  });

  it(`workFlowRequestId has default value`, () => {
    expect(component.workFlowRequestId).toEqual(0);
  });

  it(`workflowMappingId has default value`, () => {
    expect(component.workflowMappingId).toEqual(0);
  });

  it(`IsValidUser has default value`, () => {
    expect(component.IsValidUser).toEqual(false);
  });

  it(`confirmUpdate has default value`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`tableReload has default value`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`infoUpdate has default value`, () => {
    expect(component.infoUpdate).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isToasterMessage has default value`, () => {
    expect(component.isToasterMessage).toEqual(false);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([{ field: "KPI", header: "KPI" }]);
  });

  it(`objInvestmentKPIList has default value`, () => {
    expect(component.objInvestmentKPIList).toEqual([]);
  });

  it(`investmentKPICols has default value`, () => {
    expect(component.investmentKPICols).toEqual([]);
  });

  it(`expandedInvestmentKPIs has default value`, () => {
    expect(component.expandedInvestmentKPIs).toEqual([]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`isMarkedForReview has default value`, () => {
    expect(component.isMarkedForReview).toEqual(true);
  });

  it(`showAddCommentPopup has default value`, () => {
    expect(component.showAddCommentPopup).toEqual(false);
  });

  it(`disableAddCommentDoneBtn has default value`, () => {
    expect(component.disableAddCommentDoneBtn).toEqual(true);
  });

  it(`commentsList has default value`, () => {
    expect(component.commentsList).toEqual([]);
  });

  it(`isOpenCommentsPopup has default value`, () => {
    expect(component.isOpenCommentsPopup).toEqual(false);
  });

  it(`disableCloseButton has default value`, () => {
    expect(component.disableCloseButton).toEqual(true);
  });

  it(`disableUpdateButton has default value`, () => {
    expect(component.disableUpdateButton).toEqual(true);
  });

  it(`workflowConstants has default value`, () => {
    expect(component.workflowConstants).toEqual(WorkflowConstants);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, 'getMappedData').and.callThrough();
      spyOn(component, 'getPortfolioCompanies').and.callThrough();
      spyOn(component, 'setCompanyInfo').and.callThrough();
      spyOn(component, 'getCurrency').and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.getMappedData).toHaveBeenCalled();
      expect(component.getPortfolioCompanies).toHaveBeenCalled();
      expect(component.setCompanyInfo).toHaveBeenCalled();
      expect(component.getCurrency).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setCompanyInfo').and.callThrough();
      component.ngOnInit();
      expect(component.setCompanyInfo).toHaveBeenCalled();
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
      spyOn(component, 'setCompanyInfo').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(
        workflowCompanyServiceStub,
        'getWorkflowAllDetails'
      ).and.callThrough();
      component.getWorkflowAllDetails();
      expect(component.setCompanyInfo).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(
        workflowCompanyServiceStub.getWorkflowAllDetails
      ).toHaveBeenCalled();
    });
  });

  describe('setCompanyInfo', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      component.setCompanyInfo();
      expect(component.setToggleStatus).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'configureMenuClose').and.callThrough();
      component.ngAfterViewInit();
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });

  describe('getPortfolioCompanies', () => {
    it('makes expected calls', () => {
      spyOn(
        component,
        'getPortfolioCompanyInvestmentKPIValues'
      ).and.callThrough();
      component.getPortfolioCompanies();
      expect(
        component.getPortfolioCompanyInvestmentKPIValues
      ).toHaveBeenCalled();
    });
  });

  describe('getCurrency', () =>{
    it('makes expected calls', () =>{
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(workflowCompanyServiceStub,'getCompanyWorkFlowDraft').and.callThrough();
      component.getCurrency();
      expect(workflowCompanyServiceStub.getCompanyWorkFlowDraft).toHaveBeenCalled();
    })
  })

  describe('convertInvestmentKPIValueUnits', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createInvestmentKPILayOut').and.callThrough();
      component.convertInvestmentKPIValueUnits();
      expect(component.createInvestmentKPILayOut).toHaveBeenCalled();
    });
  });

  describe('successToaster', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, 'success').and.callThrough();
      component.successToaster();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe('resetAddCommentPopup', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      component.resetAddCommentPopup();
      expect(component.setToggleStatus).toHaveBeenCalled();
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

  describe('openCommentsPopUp', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getComments').and.callThrough();
      component.openCommentsPopUp();
      expect(component.getComments).toHaveBeenCalled();
    });
  });
});
