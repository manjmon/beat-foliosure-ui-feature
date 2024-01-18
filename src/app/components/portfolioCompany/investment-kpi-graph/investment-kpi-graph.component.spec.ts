import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService,ReportType } from 'src/app/services/report.service';
import { AppSettingService } from '../../../services/appsettings.service';
import { ActionsEnum,FeaturesEnum,UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { InvestmentKpiGraphComponent } from './investment-kpi-graph.component';
import { DecimalDigitEnum, FinancialValueUnitsEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { of } from 'rxjs';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { HttpClientModule } from '@angular/common/http';
import { KpiInfo } from 'src/app/common/constants';

describe('InvestmentKpiGraphComponent', () => {
  let component: InvestmentKpiGraphComponent;
  let fixture: ComponentFixture<InvestmentKpiGraphComponent>;
  let miscService: MiscellaneousService;
  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const reportServiceStub = () => ({
      getReportData: objQueryModel => ({ subscribe: f => of({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    const miscellaneousServiceStub = () => ({ GetCompanyOrInvestmentKPIList: objQueryModel => ({ subscribe: f => f({}) }) });
    TestBed.configureTestingModule({
      imports: [FormsModule,PrimeNgModule,HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InvestmentKpiGraphComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
      ]
    });
    fixture = TestBed.createComponent(InvestmentKpiGraphComponent);
    component = fixture.componentInstance;
    miscService = TestBed.inject(MiscellaneousService);
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

  it(`InvestmentKPIChartData has default value`, () => {
    expect(component.InvestmentKPIChartData).toEqual([]);
  });

  it(`InvestmentKPIChartCol has default value`, () => {
    expect(component.InvestmentKPIChartCol).toEqual([]);
  });

  it(`InvestmentKPIOrginalData has default value`, () => {
    expect(component.InvestmentKPIOrginalData).toEqual([]);
  });

  it(`isLoaded has default value`, () => {
    expect(component.isLoaded).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });
  it('should fetch investment KPIs and update the component properties', () => {
    // Arrange
    const mockResponse = {
      body: ['KPI 1', 'KPI 2'],
      code: 'OK',
    };
    spyOn(miscService, 'GetCompanyOrInvestmentKPIList').and.returnValue(of(mockResponse));

    // Act
    component.getInvestmentKPIs();

    // Assert
    expect(component.investmentKPIs).toEqual(mockResponse.body);
    expect(component.ddlmodelList.investmentKPIList).toEqual(mockResponse.body);
    expect(component.ddlmodelList.selectedInvestmentKPI).toEqual(mockResponse.body[0]);
  });
  it('should set modelInvestmentKpi properties and call getInvestmentKPIReport when ddlmodelList is defined and investmentKPIList is not empty', () => {
    // Arrange
    component.ddlmodelList = {
      investmentKPIList: [{ /* sample investmentKPI object */ }]
    };
    component.isLoaded = false;

    // Act
    component.ngDoCheck();

    // Assert
    expect(component.modelInvestmentKpi.periodType).toEqual({ type: PeriodTypeQuarterEnum.Last1Year });
    expect(component.modelInvestmentKpi.orderType).toEqual({ type: OrderTypesEnum.LatestOnRight });
    expect(component.modelInvestmentKpi.decimalPlaces).toEqual({ type: DecimalDigitEnum.Zero, value: "1.1-1" });
    expect(component.investmentKPIs).toEqual(component.ddlmodelList.investmentKPIList);
    expect(component.isLoaded).toBeTrue();
  });

  it('should not set modelInvestmentKpi properties and call getInvestmentKPIReport when ddlmodelList is undefined', () => {
    // Arrange
    component.ddlmodelList = undefined;
    component.isLoaded = false;

    // Act
    component.ngDoCheck();

    // Assert
    expect(component.modelInvestmentKpi.periodType).toBeUndefined();
    expect(component.modelInvestmentKpi.orderType).toBeUndefined();
    expect(component.modelInvestmentKpi.decimalPlaces).toBeUndefined();
    expect(component.investmentKPIs).toBeUndefined();
    expect(component.isLoaded).toBeFalse();
  });

  it('should not set modelInvestmentKpi properties and call getInvestmentKPIReport when investmentKPIList is empty', () => {
    // Arrange
    component.ddlmodelList = {
      investmentKPIList: []
    };
    component.isLoaded = false;

    // Act
    component.ngDoCheck();

    // Assert
    expect(component.modelInvestmentKpi.periodType).toBeUndefined();
    expect(component.modelInvestmentKpi.orderType).toBeUndefined();
    expect(component.modelInvestmentKpi.decimalPlaces).toBeUndefined();
    expect(component.isLoaded).toBeFalse();
  });
  it('should convert value to absolute when unit type is Absolute', () => {
    component.investmentKpiValueUnit = { typeId: FinancialValueUnitsEnum.Absolute };
    const result = component.convertUnits(1000);
    expect(result).toBe(1000);
  });

  it('should convert value to thousands when unit type is Thousands', () => {
    component.investmentKpiValueUnit = { typeId: FinancialValueUnitsEnum.Thousands };
    const result = component.convertUnits('1,000');
    expect(result).toBe(1);
  });

  it('should convert value to millions when unit type is Millions', () => {
    component.investmentKpiValueUnit = { typeId: FinancialValueUnitsEnum.Millions };
    const result = component.convertUnits('1,000,000');
    expect(result).toBe(1);
  });

  it('should convert value to billions when unit type is Billions', () => {
    component.investmentKpiValueUnit = { typeId: FinancialValueUnitsEnum.Billions };
    const result = component.convertUnits('1,000,000,000');
    expect(result).toBe(1);
  });
  it('should filter InvestmentKPIOrginalData based on selectedInvestmentKPI', () => {
    // Arrange
    component.InvestmentKPIOrginalData = [
      { KPIId: 1, value: 10 },
      { KPIId: 2, value: 20 },
      { KPIId: 1, value: 30 },
    ];
    component.ddlmodelList = {
      selectedInvestmentKPI: { kpiid: 1 },
    };

    // Act
    component.OnInvestmentKPIChange();

    // Assert
    expect(component.InvestmentKPIChartData).toEqual([
      { KPIId: 1, value: 10 },
      { KPIId: 1, value: 30 },
    ]);
  });

  it('should set InvestmentKPIUnit based on selectedInvestmentKPI', () => {
    // Arrange
    component.InvestmentKPIOrginalData = [
      { KPIId: 1, value: 10 },
      { KPIId: 2, value: 20 },
    ];
    component.ddlmodelList = {
      selectedInvestmentKPI: { kpiid: 2, kpiInfo: 'Unit' },
    };

    // Act
    component.OnInvestmentKPIChange();

    // Assert
    expect(component.InvestmentKPIUnit).toBe('Unit');
  });

  it('should convert "Actual Value" to currency if Info is Currency', () => {
    // Arrange
    component.InvestmentKPIOrginalData = [
      { KPIId: 1, kpiInfo:KpiInfo.Currency, 'Actual Value': 100 },
      { KPIId: 2, kpiInfo: KpiInfo.Currency, 'Actual Value': 200 },
    ];
    component.modelList = {
      reportingCurrencyCode: { currencyCode: 'USD' },
    };
    spyOn(component, 'convertUnits').and.returnValue(50);

    // Act
    component.OnInvestmentKPIChange();

    // Assert
    expect(component.InvestmentKPIOrginalData.length).toEqual(2);
  });
  it('should fetch investment KPI report data', () => {
    // Arrange
    const mockResponse = {
      body: [
        {
          Results: [{ KPIId: 1 }, { KPIId: 2 }],
          Columns: ['Column 1', 'Column 2']
        }
      ],
      code: 'OK'
    };
    const reportService: ReportService = fixture?.debugElement?.injector?.get(
      ReportService
    );
    spyOn(reportService, 'getReportData').and.returnValue(of(mockResponse));

    // Act
    component.ddlmodelList = {
      investmentKPIList: [{ kpiid: 2, kpiInfo: '#' }],
    };
    component.getInvestmentKPIReport();

    // Assert
    expect(component.loading).toBe(false);
    expect(component.InvestmentKPIOrginalData).toEqual(mockResponse.body[0].Results);
    expect(component.InvestmentKPIChartCol).toEqual(mockResponse.body[0].Columns);
    // Add more assertions as needed
  });
});
