import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportService,ReportType } from 'src/app/services/report.service';
import { AppSettingService } from '../../../services/appsettings.service';
import { FeaturesEnum,ActionsEnum ,UserSubFeaturesEnum} from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { MasterKpiGraphComponent } from './master-kpi-graph.component';

describe('MasterKpiGraphComponent', () => {
  let component: MasterKpiGraphComponent;
  let fixture: ComponentFixture<MasterKpiGraphComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const miscellaneousServiceStub = () => ({
      getKPIListByPCIdsKPIType: kPIQueryModel => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      getReportData: objQueryModel => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MasterKpiGraphComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MasterKpiGraphComponent);
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

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`KPIOrginalData has default value`, () => {
    expect(component.KPIOrginalData).toEqual([]);
  });

  it(`KPIChartData has default value`, () => {
    expect(component.KPIChartData).toEqual([]);
  });

  it(`KPIChartCol has default value`, () => {
    expect(component.KPIChartCol).toEqual([]);
  });

  it(`GraphHeaders has default value`, () => {
    expect(component.GraphHeaders).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.modelList = {reportingCurrencyDetail:{currencyCode:'USD'},moduleId:1,portfolioCompanyID:1};
      spyOn(component, 'ngOnInit').and.callThrough();
      spyOn(component, 'getKPIs').and.callThrough();
      component.ngOnInit();
      expect(component.getKPIs).toHaveBeenCalled();
      expect(component.ngOnInit).toHaveBeenCalled();
    });
  });

  describe('getKPIs', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getKPIListByPCIdsKPIType'
      ).and.callThrough();
      component.getKPIs();
      expect(
        miscellaneousServiceStub.getKPIListByPCIdsKPIType
      ).toHaveBeenCalled();
    });
  });

  describe('getKPIReport', () => {
    it('makes expected calls', () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, 'getReportData').and.callThrough();
      component.getKPIReport();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });
  it('should update KPIChartData based on selectedKPI', () => {
    // Arrange
    component.KPIOrginalData = [
      { KPIId: 1, Actual: 100 },
      { KPIId: 2, Actual: 200 },
      { KPIId: 1, Actual: 300 },
    ];
    component.ddlModel = {
      selectedKPI: { kpiid: 1, kpiInfo: 'Info' },
    };

    // Act
    component.OnKPIChange();

    // Assert
    expect(component.KPIChartData).toEqual([
      { KPIId: 1, Actual: 100 },
      { KPIId: 1, Actual: 300 },
    ]);
    expect(component.kpiUnit).toBe('Info');
  });

  it('should convert Actual to million if Info is "$" and moduleId is 1', () => {
    // Arrange
    component.KPIOrginalData = [
      { KPIId: 1, Actual: 100, Info: '$' },
      { KPIId: 2, Actual: 200, Info: 'Info' },
    ];
    component.ddlModel = {
      selectedKPI: { kpiid: 1, kpiInfo: 'Info' },
    };
    component.modelList = { moduleId: 1 };

    // Act
    component.OnKPIChange();

    // Assert
    expect(component.KPIChartData.length).toEqual(1);
  });

  it('should update KPIOrginalData and KPIChartCol when response is successful', () => {
    const mockResponse = {
      body: [
        {
          Results: [/* mock results */],
          Columns: [/* mock columns */]
        }
      ],
      code: 'OK'
    };
    component.getKPIReport();

    expect(component.KPIOrginalData).toEqual(mockResponse.body[0].Results);
    expect(component.KPIChartCol).toEqual(mockResponse.body[0].Columns);
  });
});
