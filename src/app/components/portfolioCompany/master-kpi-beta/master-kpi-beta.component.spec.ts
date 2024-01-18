import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MasterKpiService } from '../../../services/master-kpi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService, ExportTypeEnum, ErrorMessage } from 'src/app/services/miscellaneous.service';
import { PermissionService, FeaturesEnum, UserSubFeaturesEnum, ActionsEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from 'src/app/services/audit.service';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { FinancialsSubTabs, NumberDecimalConst } from 'src/app/common/constants';
import { MasterKpiBetaComponent } from './master-kpi-beta.component';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { of, throwError } from 'rxjs';
describe ('MasterKpiBetaComponent', () => {
    let component: MasterKpiBetaComponent;
    let fixture: ComponentFixture<MasterKpiBetaComponent>;
    let printColumn: any;

    beforeEach(() => {
        const masterKpiServiceStub = () => ({
            getBetaMasterKPIValues: object => ({ subscribe: f => of({}) })
        });
        const activatedRouteStub = () => ({ snapshot: { params: {} } });
        const routerStub = () => ({});
        const accountServiceStub = () => ({});
        const miscellaneousServiceStub = () => ({ getMessageTimeSpan: () => ({}) });
        const permissionServiceStub = () => ({});
        const portfolioCompanyServiceStub = () => ({
            getfinancialsvalueTypes: () => ({ subscribe: f => f({}) })
        });
        const toastrServiceStub = () => ({});
        const auditServiceStub = () => ({});
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports:[MaterialModule],
            declarations: [MasterKpiBetaComponent],
            providers: [
                { provide: MasterKpiService, useFactory: masterKpiServiceStub },
                { provide: ActivatedRoute, useFactory: activatedRouteStub },
                { provide: Router, useFactory: routerStub },
                { provide: AccountService, useFactory: accountServiceStub },
                { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
                { provide: PermissionService, useFactory: permissionServiceStub },
                {
                    provide: PortfolioCompanyService,
                    useFactory: portfolioCompanyServiceStub
                },
                { provide: ToastrService, useFactory: toastrServiceStub },
                { provide: AuditService, useFactory: auditServiceStub }
            ]
        });
        fixture = TestBed.createComponent(MasterKpiBetaComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`NumberDecimalConst has default value`, () => {
        expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
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

    it(`exportType has default value`, () => {
        expect(component.exportType).toEqual(ExportTypeEnum);
    });

    it(`loading has default value`, () => {
        expect(component.loading).toEqual(false);
    });

    it(`tableReload has default value`, () => {
        expect(component.tableReload).toEqual(false);
    });

    it(`isLoader has default value`, () => {
        expect(component.isLoader).toEqual(false);
    });

    it(`frozenCols has default value`, () => {
        expect(component.frozenCols.length).toEqual(1);
    });

    it(`objMasterKPIList has default value`, () => {
        expect(component.objMasterKPIList).toEqual([]);
    });

    it(`masterKPICols has default value`, () => {
        expect(component.masterKPICols).toEqual([]);
    });

    it(`expandedMasterKPIs has default value`, () => {
        expect(component.expandedMasterKPIs).toEqual([]);
    });

    it(`financialKPIMultiSortMeta has default value`, () => {
        expect(component.financialKPIMultiSortMeta.length).toEqual(2);
    });

    it(`auditToggle has default value`, () => {
        expect(component.auditToggle).toEqual(false);
    });

    it(`confirmUpdate has default value`, () => {
        expect(component.confirmUpdate).toEqual(false);
    });

    it(`infoUpdate has default value`, () => {
        expect(component.infoUpdate).toEqual(false);
    });

    it(`ErrorNotation has default value`, () => {
        expect(component.ErrorNotation).toEqual(false);
    });

    it(`isToasterMessage has default value`, () => {
        expect(component.isToasterMessage).toEqual(false);
    });

    it(`exportMasterKPILoading has default value`, () => {
        expect(component.exportMasterKPILoading).toEqual(false);
    });

    it(`isValueUpdated has default value`, () => {
        expect(component.isValueUpdated).toEqual(false);
    });

    it(`tabValueTypeList has default value`, () => {
        expect(component.tabValueTypeList).toEqual([]);
    });

    it(`IsPageLoad has default value`, () => {
        expect(component.IsPageLoad).toEqual(true);
    });

    it(`isMonthly has default value`, () => {
        expect(component.isMonthly).toEqual(true);
    });

    it(`isQuarterly has default value`, () => {
        expect(component.isQuarterly).toEqual(false);
    });

    it(`isAnnually has default value`, () => {
        expect(component.isAnnually).toEqual(false);
    });

    it(`filterOptions has default value`, () => {
        expect(component.filterOptions).toEqual([]);
    });

    it(`tableColumns has default value`, () => {
        expect(component.tableColumns).toEqual([]);
    });

    it(`tableFrozenColumns has default value`, () => {
        expect(component.tableFrozenColumns).toEqual([]);
    });

    it(`tableResult has default value`, () => {
        expect(component.tableResult).toEqual([]);
    });

    it(`tableResultClone has default value`, () => {
        expect(component.tableResultClone).toEqual([]);
    });

    it(`kpiFilterCols has default value`, () => {
        expect(component.kpiFilterCols).toEqual([]);
    });

    it(`auditLogList has default value`, () => {
        expect(component.auditLogList).toEqual([]);
    });
    it('should return the actual audit log if the tab name includes "Actual" or "Forecast"', () => {
        const rowData = {
            actualAuditLog: true,
        };
        const column = {
            name: 'Actual',
            field: 'Actual 2020'
        };
        const result = component.printColumn(rowData, column);
        expect(result).toBe(false);
    });

    describe('selectValueTab', () => {
        it('makes expected calls', () => {
            const iTabStub: ITab = <any>{};
            spyOn(component, 'getPortfolioCompanyMasterKPIValues').and.callThrough();
            component.selectValueTab(iTabStub);
            expect(component.getPortfolioCompanyMasterKPIValues).toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
                MiscellaneousService
            );
            spyOn(component, 'getValueTypeTabList').and.callThrough();
            spyOn(component, 'getPortfolioCompanyMasterKPIValues').and.callThrough();
            spyOn(miscellaneousServiceStub, 'getMessageTimeSpan').and.callThrough();
            component.ngOnInit();
            expect(component.getValueTypeTabList).toHaveBeenCalled();
            expect(component.getPortfolioCompanyMasterKPIValues).toHaveBeenCalled();
            expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
        });
    });

    describe('getValueTypeTabList', () => {
        it('makes expected calls', () => {
            const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
                PortfolioCompanyService
            );
            spyOn(
                portfolioCompanyServiceStub,
                'getfinancialsvalueTypes'
            ).and.callThrough();
            component.getValueTypeTabList();
            expect(
                portfolioCompanyServiceStub.getfinancialsvalueTypes
            ).toHaveBeenCalled();
        });
    });
    it('should return the actualAuditLog value if it exists in the filter audit result', () => {
        const rowData = { id: 1 };
        const column = { name: 'column1' };
        const filterAuditResult = [{ acutalAuditLog: true }];
    
        spyOn(component, 'getFilterAuditValue').and.returnValue(filterAuditResult);
    
        const result = component.printColumn(rowData, column);
    
        expect(result).toBe(true);
        expect(component.getFilterAuditValue).toHaveBeenCalledWith(rowData, column);
      });
    
      it('should return false if the filter audit result is empty', () => {
        const rowData = { id: 1 };
        const column = { name: 'column1' };
        const filterAuditResult = [];
    
        spyOn(component, 'getFilterAuditValue').and.returnValue(filterAuditResult);
    
        const result = component.printColumn(rowData, column);
    
        expect(result).toBe(false);
        expect(component.getFilterAuditValue).toHaveBeenCalledWith(rowData, column);
      });
       it('should return false when event value length is 21 and contains a dot', () => {
        const event = {
          target: {
            value: '1234567890.1234567890'
          }
        };
        expect(component.validateMaxLength(event)).toBe(false);
      });
    
      it('should return false when event value length is 16 and does not contain a dot', () => {
        const event = {
          target: {
            value: '1234567890123456'
          }
        };
        expect(component.validateMaxLength(event)).toBe(false);
      });
    
      it('should return true for other cases', () => {
        const event = {
          target: {
            value: '123456789012345'
          }
        };
        expect(component.validateMaxLength(event)).toBe(true);
      }); 
      it('should validate number input', () => {
        const event = { which: 15, target: { value: '123.456' } };
        component.validateNumber(event, 'KpiInfo');
        expect(event.target.value).toBe('123.456');
      });
    
      it('should convert invalid number input to fixed 6 decimal places', () => {
        const event = { which: 10, target: { value: 'abc' } };
        component.validateNumber(event, 'KpiInfo');
        expect(event.target.value).toEqual('abc');
      });
      it('should clear cell edit', () => {
        // Arrange
        component.tableResult = [
          { KpiId: 1, 'colName editable': true },
          { KpiId: 2, 'colName editable': true },
          { KpiId: 3, 'colName editable': true }
        ];
        component.updateModel = { kpiId: 2, colName: 'colName' };
    
        // Act
        component.clearcellEdit();
    
        // Assert
        expect(component.tableResult[1]['colName editable']).toBe(false);
        expect(component.confirmUpdate).toBe(false);
        expect(component.updateModel).toEqual({});
      });
      describe('getTabName', () => {
        it('should return "actual" when tabName is FinancialsSubTabs.Actual', () => {
          // Arrange
          component.tabName = FinancialsSubTabs.Actual;
      
          // Act
          const result = component.getTabName();
      
          // Assert
          expect(result).toEqual('actual');
        });
      
        it('should return "budget" when tabName is FinancialsSubTabs.Budget', () => {
          // Arrange
          component.tabName = FinancialsSubTabs.Budget;
      
          // Act
          const result = component.getTabName();
      
          // Assert
          expect(result).toEqual('budget');
        });
      
        it('should return "forecast" when tabName is FinancialsSubTabs.Forecast', () => {
          // Arrange
          component.tabName = FinancialsSubTabs.Forecast;
      
          // Act
          const result = component.getTabName();
      
          // Assert
          expect(result).toEqual('forecast');
        });
      
        it('should return "ic" when tabName is FinancialsSubTabs.IC', () => {
          // Arrange
          component.tabName = FinancialsSubTabs.IC;
      
          // Act
          const result = component.getTabName();
      
          // Assert
          expect(result).toEqual('ic');
        });
    });
it('should update rowData when event is defined', () => {
    const index = 0;
    const col = { field: 'fieldName' };
    const rowData = { fieldName: 'oldValue' };
    const event = { target: { value: 'newValue' } };

    component.onColumnEditComplete(index, col, rowData, event);

    expect(rowData.fieldName).toBe('newValue');
  });

  it('should set rowData to undefined when event is undefined', () => {
    const index = 0;
    const col = { field: 'fieldName' };
    const rowData = { fieldName: 'oldValue' };
    const event = undefined;

    component.onColumnEditComplete(index, col, rowData, event);

    expect(rowData.fieldName).toEqual('oldValue');
  });
  it('should set confirmUpdate to true when currVal is different from prevVal', () => {
    const index = 0;
    const col = { field: 'fieldName' };
    const rowData = { fieldName: 'oldValue' };
    const event = { target: { value: 'newValue' } };
    component.updateModel.previousVal = 'oldValue';
    component.confirmUpdate = false;

    component.onColumnEditComplete(index, col, rowData, event);

    expect(component.confirmUpdate).toBe(true);
    expect(component.updateModel.updatedVal).toBe('newValue');
  });

  it('should call OnKpiUpdateCancel when confirmUpdate is true', () => {
    const index = 0;
    const col = { field: 'fieldName' };
    const rowData = { fieldName: 'oldValue' };
    const event = { target: { value: 'newValue' } };
    component.confirmUpdate = true;
    spyOn(component, 'OnKpiUpdateCancel');

    component.onColumnEditComplete(index, col, rowData, event);

    expect(component.OnKpiUpdateCancel).toHaveBeenCalledWith('');
  });
  it('should filter audit values by quarter', () => {
    const yearHeader = 2022;
    const monthValue = null;
    const auditList = [
      { quarter: 'Q1', year: 2022, companyKPIID: 1 },
      { quarter: 'Q2', year: 2022, companyKPIID: 2 },
      { quarter: 'Q3', year: 2022, companyKPIID: 1 },
      { quarter: 'Q4', year: 2022, companyKPIID: 3 },
    ];
    const periodHeader = 'Q3';
    const rowdata = { ValuesKpiId: 1 };

    const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

    expect(result).toEqual([
      { quarter: 'Q3', year: 2022, companyKPIID: 1 },
    ]);
  });

  it('should filter audit values by month', () => {
    const yearHeader = 2022;
    const monthValue = 'January';
    const auditList = [
      { month: 'January', year: 2022, companyKPIID: 1 },
      { month: 'February', year: 2022, companyKPIID: 2 },
      { month: 'March', year: 2022, companyKPIID: 1 },
      { month: 'April', year: 2022, companyKPIID: 3 },
    ];
    const periodHeader = 'Q1';
    const rowdata = { ValuesKpiId: 1 };

    const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

    expect(result.length).toEqual(0);
  });

  it('should filter audit values by year and null month/quarter', () => {
    const yearHeader = 2022;
    const monthValue = null;
    const auditList = [
      { month: null, year: 2022, companyKPIID: 1 },
      { month: 'February', year: 2022, companyKPIID: 2 },
      { month: null, year: 2022, companyKPIID: 1 },
      { month: 'April', year: 2022, companyKPIID: 3 },
    ];
    const periodHeader = 'Q1';
    const rowdata = { ValuesKpiId: 1 };

    const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

    expect(result.length).toEqual(0);
  });
});
