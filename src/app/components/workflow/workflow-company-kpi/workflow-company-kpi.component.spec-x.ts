import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,SimpleChanges } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuditService } from 'src/app/services/audit.service';
import { MiscellaneousService,ExportTypeEnum,FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';
import { PermissionService,UserSubFeaturesEnum,FeaturesEnum,ActionsEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { FormsModule } from '@angular/forms';
import { WorkflowCompanyKpiComponent } from './workflow-company-kpi.component';
import {  MatMenuModule } from '@angular/material/menu';

describe('WorkflowCompanyKpiComponent', () => {
  let component: WorkflowCompanyKpiComponent;
  let fixture: ComponentFixture<WorkflowCompanyKpiComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({});
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (somethingWentWrong, string, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const accountServiceStub = () => ({});
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({}),
      showAlertMessages: (string, somethingWentWrong) => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (companyKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      exportCompanywiseKPIList: object => ({ subscribe: f => f({}) })
    });
    const workflowCompanyServiceStub = () => ({
      getCompanyWorkFlowDraft: (requestId, id) => ({ subscribe: f => f({}) }),
      getPCCompanyKPIValues: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowCompanyKpiComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: AuditService, useFactory: auditServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        {
          provide: WorkflowCompanyService,
          useFactory: workflowCompanyServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowCompanyKpiComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isOpenUpload has default value`, () => {
    expect(component.isOpenUpload).toEqual(false);
  });

  it(`showCompany has default value`, () => {
    expect(component.showCompany).toEqual(false);
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

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(FinancialValueUnitsEnum);
  });

  it(`exportType has default value`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual(component.frozenCols);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
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

  it(`exportCompanyKPILoading has default value`, () => {
    expect(component.exportCompanyKPILoading).toEqual(false);
  });

  it(`CompanyKPIOrginalData has default value`, () => {
    expect(component.CompanyKPIOrginalData).toEqual([]);
  });

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
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

  it(`objCompanyKPIList has default value`, () => {
    expect(component.objCompanyKPIList).toEqual([]);
  });

  it(`companyKPICols has default value`, () => {
    expect(component.companyKPICols).toEqual([]);
  });

  it(`companyValueUnitTable has default value`, () => {
    expect(component.companyValueUnitTable).toEqual(
      FinancialValueUnitsEnum.Absolute
    );
  });

  it(`expandedCompanyKPIs has default value`, () => {
    expect(component.expandedCompanyKPIs).toEqual([]);
  });

  it(`companywiseKPIMultiSortMeta has default value`, () => {
    expect(component.companywiseKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      component.ngOnChanges(simpleChangesStub);
      });
  });

  describe('getPortfolioCompanies', () => {
    it('makes expected calls', () => {
      component.getPortfolioCompanies();
    });
  });

  describe('convertCompanyKPIValueUnits', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createCompanyKPILayOut').and.callThrough();
      component.convertCompanyKPIValueUnits();
      expect(component.createCompanyKPILayOut).toHaveBeenCalled();
    });
  });

  describe('exportCompanyKpiValues', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(miscellaneousServiceStub, 'showAlertMessages').and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        'exportCompanywiseKPIList'
      ).and.callThrough();
      component.exportCompanyKpiValues();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
      expect(
        portfolioCompanyServiceStub.exportCompanywiseKPIList
      ).toHaveBeenCalled();
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

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'configureMenuClose').and.callThrough();
      component.ngAfterViewInit();
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });
});
