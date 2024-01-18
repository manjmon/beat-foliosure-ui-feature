import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,SimpleChanges } from '@angular/core';
import { PermissionService,UserSubFeaturesEnum,FeaturesEnum,ActionsEnum } from 'src/app/services/permission.service';
import { MiscellaneousService,ExportTypeEnum ,FinancialValueUnitsEnum} from '../../../services/miscellaneous.service';
import { ToastrService } from 'ngx-toastr';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ActivatedRoute ,Router} from '@angular/router';
import { NumberDecimalConst,WorkflowConstants } from 'src/app/common/constants';
import { FormsModule } from '@angular/forms';
import { WorkflowOperationalKpiComponent } from './workflow-operational-kpi.component';

describe('WorkflowOperationalKpiComponent', () => {
  let component: WorkflowOperationalKpiComponent;
  let fixture: ComponentFixture<WorkflowOperationalKpiComponent>;

  beforeEach(() => {
    const permissionServiceStub = () => ({
      checkUserPermission: (operationalKPIs, arg1, id) => ({})
    });
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({}),
      showAlertMessages: (string, somethingWentWrong) => ({})
    });
    const toastrServiceStub = () => ({
      error: (string, string1, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const workflowCompanyServiceStub = () => ({
      getCompanyWorkFlowDraft: (workflowRequestId, id) => ({
        subscribe: f => f({})
      }),
      UpdateWorkflowMappingStatus: mappingId => ({ subscribe: f => f({}) }),
      updateWorkflowKpiValue: datauditmodellog => ({ subscribe: f => f({}) }),
      getPortfolioCompanyOperationalKpiValues: object => ({
        subscribe: f => f({})
      }),
      addWorkflowComment: object => ({ subscribe: f => f({}) }),
      updateWorkflowRequest: request => ({ subscribe: f => f({}) }),
      getWorkflowComments: mappingId => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      exportOperationalKPIListdraft: object => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowOperationalKpiComponent],
      providers: [
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        {
          provide: WorkflowCompanyService,
          useFactory: workflowCompanyServiceStub
        },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowOperationalKpiComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isOpenUpload has default value`, () => {
    expect(component.isOpenUpload).toEqual(false);
  });

  it(`showOperational has default value`, () => {
    expect(component.showOperational).toEqual(false);
  });

  it(`dataInformation has default value`, () => {
    expect(component.dataInformation).toEqual([]);
  });

  it(`mappingId has default value`, () => {
    expect(component.mappingId).toEqual(0);
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

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(FinancialValueUnitsEnum);
  });

  it(`exportType has default value`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`reportingCurrency has default value`, () => {
    expect(component.reportingCurrency).toEqual(`NA`);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([]);
  });

  it(`operationalKPIMultiSortMeta has default value`, () => {
    expect(component.operationalKPIMultiSortMeta).toEqual([]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`confirmUpdate has default value`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`tableReload has default value`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`portfolioCompanyOperationalKPIValuesDataTableList has default value`, () => {
    expect(component.portfolioCompanyOperationalKPIValuesDataTableList).toEqual(
      []
    );
  });

  it(`isloadevent has default value`, () => {
    expect(component.isloadevent).toEqual(false);
  });

  it(`exportCompanyKPILoading has default value`, () => {
    expect(component.exportCompanyKPILoading).toEqual(false);
  });

  it(`exportOperationalKPILoading has default value`, () => {
    expect(component.exportOperationalKPILoading).toEqual(false);
  });

  it(`CompanyKPIOrginalData has default value`, () => {
    expect(component.CompanyKPIOrginalData).toEqual([]);
  });

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`workFlowRequestId has default value`, () => {
    expect(component.workFlowRequestId).toEqual(0);
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

  it(`operationalKPICols has default value`, () => {
    expect(component.operationalKPICols).toEqual([]);
  });

  it(`auditLogList has default value`, () => {
    expect(component.auditLogList).toEqual([]);
  });

  it(`objCompanyKPIList has default value`, () => {
    expect(component.objCompanyKPIList).toEqual([]);
  });

  it(`companyKPICols has default value`, () => {
    expect(component.companyKPICols).toEqual([]);
  });

  it(`companyValueUnitTable has default value`, () => {
    expect(component.companyValueUnitTable).toEqual(
      FinancialValueUnitsEnum.Millions
    );
  });

  it(`expandedCompanyKPIs has default value`, () => {
    expect(component.expandedCompanyKPIs).toEqual([]);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`workflowConstants has default value`, () => {
    expect(component.workflowConstants).toEqual(WorkflowConstants);
  });

  it(`companywiseKPIMultiSortMeta has default value`, () => {
    expect(component.companywiseKPIMultiSortMeta).toEqual([]);
  });

  it(`showAddCommentPopup has default value`, () => {
    expect(component.showAddCommentPopup).toEqual(false);
  });

  it(`commentsList has default value`, () => {
    expect(component.commentsList).toEqual([]);
  });

  it(`disableAddCommentDoneBtn has default value`, () => {
    expect(component.disableAddCommentDoneBtn).toEqual(true);
  });

  it(`operationalKPIFilterCols has default value`, () => {
    expect(component.operationalKPIFilterCols).toEqual([]);
  });

  it(`tableFrozenColumns has default value`, () => {
    expect(component.tableFrozenColumns).toEqual([]);
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

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, 'getMappedData').and.callThrough();
      spyOn(
        component,
        'getPortfolioCompanyOperationalKPIValues'
      ).and.callThrough();
      spyOn(component, 'getCurrency').and.callThrough();
      spyOn(component, 'setCompanyInfo').and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.getMappedData).toHaveBeenCalled();
      expect(
        component.getPortfolioCompanyOperationalKPIValues
      ).toHaveBeenCalled();
      expect(component.getCurrency).toHaveBeenCalled();
      expect(component.setCompanyInfo).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setCompanyInfo').and.callThrough();
      component.ngOnInit();
      expect(component.setCompanyInfo).toHaveBeenCalled();
    });
  });

  describe('getCurrency', () => {
    it('makes expected calls', () => {
      const workflowCompanyServiceStub: WorkflowCompanyService = fixture.debugElement.injector.get(
        WorkflowCompanyService
      );
      spyOn(
        workflowCompanyServiceStub,
        'getCompanyWorkFlowDraft'
      ).and.callThrough();
      component.getCurrency();
      expect(
        workflowCompanyServiceStub.getCompanyWorkFlowDraft
      ).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'configureMenuClose').and.callThrough();
      component.ngAfterViewInit();
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });

  describe('setCompanyInfo', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      component.setCompanyInfo();
      expect(component.setToggleStatus).toHaveBeenCalled();
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

  describe('setIsMarked', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateWorkflowRequest').and.callThrough();
      component.setIsMarked();
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

  describe('setReject', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateWorkflowRequest').and.callThrough();
      component.setReject();
      expect(component.updateWorkflowRequest).toHaveBeenCalled();
    });
  });

  describe('resetAddCommentPopup', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setToggleStatus').and.callThrough();
      component.resetAddCommentPopup();
      expect(component.setToggleStatus).toHaveBeenCalled();
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
