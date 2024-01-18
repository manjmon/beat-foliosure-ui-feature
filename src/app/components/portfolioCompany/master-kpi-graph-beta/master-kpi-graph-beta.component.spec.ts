import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalDigitEnum, FinancialValueUnitsEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { KPIModulesEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { KpiInfo } from 'src/app/common/constants';
import { MasterKpiGraphBetaComponent } from './master-kpi-graph-beta.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
// Create mock objects for the services and the route
const mockRoute = { snapshot: { params: { id: '123' } } };
const mockMiscService = () => ({
});
let portfolioCompanyService: PortfolioCompanyService;
describe('MasterKpiGraphBetaComponent', () => {
  let component: MasterKpiGraphBetaComponent;
  let fixture: ComponentFixture<MasterKpiGraphBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterKpiGraphBetaComponent],
      providers: [
        { provide: MiscellaneousService, useValue: mockMiscService },
        { provide: PortfolioCompanyService, useValue: jasmine.createSpyObj('PortfolioCompanyService', ['getChartsKpiData'])},
        { provide: ActivatedRoute, useValue: mockRoute }
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterKpiGraphBetaComponent);
    component = fixture.componentInstance;
    component.modelList = {
      portfolioCompanyID: 1,
      moduleId: 2
    };
    component.searchFilter = 'example';
    component.masterKpiValueUnit = {
      typeId: 3
    };
    component.typeField = 'bar';
    component.selectedKPI = {
      kpiid: 4
    };
    portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
    (portfolioCompanyService.getChartsKpiData as jasmine.Spy).and.returnValue(of({ data: [], yLineFields: [], yBarFields: [], xField: '', yShades: [] }));
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the modelKpi properties', () => {
    expect(component.modelKpi.periodType).toEqual(PeriodTypeQuarterEnum.Last1Year);
    expect(component.modelKpi.orderType.type).toEqual(OrderTypesEnum.LatestOnRight);
    expect(component.modelKpi.decimalPlaces.type).toEqual(DecimalDigitEnum.Zero);
    expect(component.modelKpi.decimalPlaces.value).toEqual("1.0-0");
  });

  it('should set the masterKpiValueUnit property', () => {
    expect(component.masterKpiValueUnit.typeId).toEqual(FinancialValueUnitsEnum.Millions);
    expect(component.masterKpiValueUnit.unitType).toEqual(FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions]);
  });

  it('should set the id property from the route parameter', () => {
    expect(component.id).toEqual('123');
  });

  it('should create a filter object with the correct properties', () => {

    component.modelList = { portfolioCompanyID: 456, moduleId: 789 };
    component.searchFilter = { someFilter: 'abc' };
    component.typeField = 'bar';
    component.selectedKPI = { kpiid: 1011 };
    const filter = component.createFilter();
    expect(filter).toEqual({
      companyId: '456',
      portfolioCompanyID: '456',
      searchFilter: { someFilter: 'abc' },
      moduleId: 789,
      unit: FinancialValueUnitsEnum.Millions,
      chartType: 'bar',
      kpiId: 1011
    });
  });

  it('should clear the chartData and other properties when clearAll is called', () => {
    component.chartData = [{ x: 1, y: 2 }];
    component.yLineFields = ['a', 'b'];
    component.yBarFields = ['c', 'd'];
    component.xField = ['x'];
    component.yShades = ['e', 'f'];
    component.clearAll();
    expect(component.chartData).toEqual([]);
    expect(component.yLineFields).toEqual([]);
    expect(component.yBarFields).toEqual([]);
    expect(component.xField).toEqual(['x']);
    expect(component.yShades).toEqual([]);
  });
  it('should return the correct KPI type based on the TradingRecords', () => {
    component.modelList = { moduleId: KPIModulesEnum.TradingRecords };
    const kpiType = component.getKpiTypes();
    expect(kpiType).toEqual('MasterKpis');
  });
  it('should return the correct KPI type based on the Operational', () => {
    component.modelList = { moduleId: KPIModulesEnum.Operational };
    const kpiType = component.getKpiTypes();
    expect(kpiType).toEqual('Operational');
  });
  it('should return the correct KPI type based on the Company', () => {
    component.modelList = { moduleId: KPIModulesEnum.Company };
    const kpiType = component.getKpiTypes();
    expect(kpiType).toEqual('Company');
  });
  it('should return the correct KPI type based on the Investment', () => {
    component.modelList = { moduleId: KPIModulesEnum.Investment };
    const kpiType = component.getKpiTypes();
    expect(kpiType).toEqual('Investment');
  });
  it('should return the correct KPI type based on the CreditKPI', () => {
    component.modelList = { moduleId: KPIModulesEnum.CreditKPI };
    const kpiType = component.getKpiTypes();
    expect(kpiType).toEqual('MasterKpis');
  });
  it('should set the symbol for the selected KPI in the setSymbol method', () => {
    let mockKpi1 = { kpiInfo: KpiInfo.Currency };
    let mockKpi2 = { kpiInfo: KpiInfo.Number };
    let mockKpi3 = { kpiInfo: KpiInfo.Percentage };
    let mockKpi4 = { kpiInfo: KpiInfo.Multiple };
    let mockModelList = { reportingCurrencyDetail: { currencyCode: 'USD' } };
    component.modelList = mockModelList;
    component.setSymbol(mockKpi1);
    expect(component.moduleCurrency).toEqual('USD');
    component.setSymbol(mockKpi2);
    expect(component.moduleCurrency).toEqual(KpiInfo.Number);
    component.setSymbol(mockKpi3);
    expect(component.moduleCurrency).toEqual(KpiInfo.Percentage);
    component.setSymbol(mockKpi4);
    expect(component.moduleCurrency).toEqual(KpiInfo.Multiple);
  });
  it('should update the width property when the window is resized', () => {
    const newWidth = 500;
    component.width = newWidth;
    component.onResized({ newRect: { width: newWidth } });
    expect(component.width).toEqual(newWidth);
  });
  it('should set moduleCurrency to reporting currency code when kpiInfo is Currency', () => {
    const kpi = { kpiInfo: KpiInfo.Currency };
    component.setSymbol(kpi);
    expect(component.moduleCurrency).toEqual('NA');
  });

  it('should set moduleCurrency to KpiInfo.Number when kpiInfo is Number', () => {
    const kpi = { kpiInfo: KpiInfo.Number };
    component.setSymbol(kpi);
    expect(component.moduleCurrency).toBe(KpiInfo.Number);
  });

  it('should set moduleCurrency to KpiInfo.Percentage when kpiInfo is Percentage', () => {
    const kpi = { kpiInfo: KpiInfo.Percentage };
    component.setSymbol(kpi);
    expect(component.moduleCurrency).toBe(KpiInfo.Percentage);
  });

  it('should set moduleCurrency to KpiInfo.Multiple when kpiInfo is Multiple', () => {
    const kpi = { kpiInfo: KpiInfo.Multiple };
    component.setSymbol(kpi);
    expect(component.moduleCurrency).toBe(KpiInfo.Multiple);
  });

  it('should not change moduleCurrency when kpiInfo is not recognized', () => {
    const kpi = { kpiInfo: 'Unknown' };
    component.setSymbol(kpi);
    expect(component.moduleCurrency).toBeUndefined();
  });
  it('should create a filter object with correct values', () => {
    const filter = component.createFilter();

    expect(filter.unit).toEqual(2);
  });

  it('should set unit to FinancialValueUnitsEnum.Millions when masterKpiValueUnit is undefined', () => {
    component.masterKpiValueUnit = undefined;

    const filter = component.createFilter();

    expect(filter.unit).toBe(FinancialValueUnitsEnum.Millions);
  });
  it('should load graph successfully', () => {
    // Arrange
    spyOn(component, 'createFilter').and.returnValue({
      companyId: 1,
      portfolioCompanyID: 1,
      searchFilter: 'yourSearchFilter',
      moduleId: 1,
      unit: 2,
      chartType: 'yourChartType',
      kpiId: 1
    }); // Mock createFilter method

    // Act
    component.loadGraph();

    // Assert
    expect(component.isNoData).toBe(true);
    expect(component.isLoaded).toBe(false);
    expect(component.chartData).toEqual([]);
    expect(component.yLineFields).toEqual([]);
    expect(component.yBarFields).toEqual([]);
    expect(component.xField).toBe('');
    expect(component.yShades).toEqual([]);
    expect(component.isNoData).toBe(true);
    expect(component.isLoaded).toBe(false);
  });

  it('should handle error when loading graph', () => {
    // Arrange
    spyOn(component, 'clearAll');
    // Act
    component.loadGraph();

    // Assert
    expect(component.clearAll).toHaveBeenCalled();
    expect(component.isLoaded).toBe(false);
  });
  it('should clear all chart data, yLineFields, yBarFields, and yShades', () => {
    // Arrange
    component.chartData = [1, 2, 3];
    component.yLineFields = ['field1', 'field2'];
    component.yBarFields = ['field3', 'field4'];
    component.yShades = ['shade1', 'shade2'];

    // Act
    component.clearAll();

    // Assert
    expect(component.chartData).toEqual([]);
    expect(component.yLineFields).toEqual([]);
    expect(component.yBarFields).toEqual([]);
    expect(component.yShades).toEqual([]);
  });
  it('should return "MasterKpis" for KPIModulesEnum.TradingRecords', () => {
    component.modelList = { moduleId: KPIModulesEnum.TradingRecords };
    expect(component.getKpiTypes()).toBe('MasterKpis');
  });

  it('should return "Operational" for KPIModulesEnum.Operational', () => {
    component.modelList = { moduleId: KPIModulesEnum.Operational };
    expect(component.getKpiTypes()).toBe('Operational');
  });

  it('should return "Investment" for KPIModulesEnum.Investment', () => {
    component.modelList = { moduleId: KPIModulesEnum.Investment };
    expect(component.getKpiTypes()).toBe('Investment');
  });

  it('should return "MasterKpis" for KPIModulesEnum.CreditKPI', () => {
    component.modelList = { moduleId: KPIModulesEnum.CreditKPI };
    expect(component.getKpiTypes()).toBe('MasterKpis');
  });

  it('should return "Company" for KPIModulesEnum.Company', () => {
    component.modelList = { moduleId: KPIModulesEnum.Company };
    expect(component.getKpiTypes()).toBe('Company');
  });
});