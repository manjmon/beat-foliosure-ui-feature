import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeaturesEnum,UserSubFeaturesEnum ,ActionsEnum} from 'src/app/services/permission.service';
import {ReportService, ReportCategory ,ReportType} from 'src/app/services/report.service';
import { FormsModule } from '@angular/forms';
import { OperationalKpiGraphComponent } from './operational-kpi-graph.component';

describe('OperationalKpiGraphComponent', () => {
  let component: OperationalKpiGraphComponent;
  let fixture: ComponentFixture<OperationalKpiGraphComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const reportServiceStub = () => ({
      getReportData: reportModel => ({ subscribe: f => f({}) }),
      setDataAvailabilityInReport: arg => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OperationalKpiGraphComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    fixture = TestBed.createComponent(OperationalKpiGraphComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isLoaded has default value`, () => {
    expect(component.isLoaded).toEqual(false);
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

  it(`reportCategory has default value`, () => {
    expect(component.reportCategory).toEqual(ReportCategory);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  describe('onOperationalKPIChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getCompanyFinancialReports').and.callThrough();
      component.onOperationalKPIChange();
      expect(component.getCompanyFinancialReports).toHaveBeenCalled();
    });
  });

  describe('getCompanyFinancialReports', () => {
    it('makes expected calls', () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, 'CheckIfNoDataInReport').and.callThrough();
      spyOn(reportServiceStub, 'getReportData').and.callThrough();
      component.getCompanyFinancialReports();
      expect(component.CheckIfNoDataInReport).toHaveBeenCalled();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });

  describe('CheckIfNoDataInReport', () => {
    it('makes expected calls', () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, 'setDataAvailabilityInReport').and.callThrough();
      component.CheckIfNoDataInReport();
      expect(reportServiceStub.setDataAvailabilityInReport).toHaveBeenCalled();
    });
  });
  describe('onResized', () => {
    it('should set width to the newRect width', () => {
      const event = { newRect: { width: 500 } };
      component.onResized(event);
      expect(component.width).toEqual(500);
    });
});
describe('onOperationalKPIChange', () => {
  beforeEach(() => {
    component.operationalddlmodel = {
      selectedOperationalKPI: { sector: 'Sector 1' }
    };
    component.operationalModel = { portfolioCompanyID: '123' };
  });

  it('should set operationalReport_AsOfDate to undefined', () => {
    component.onOperationalKPIChange();
    expect(component.operationalReport_AsOfDate).toBeUndefined();
  });

  it('should set operationalddlmodel.selectedOperationalKPI.sector to null', () => {
    component.onOperationalKPIChange();
    expect(component.operationalddlmodel.selectedOperationalKPI.sector).toBeNull();
  });

  it('should set reportModel.sectorwiseOperationalKPIs to an array containing selectedOperationalKPI', () => {
    component.onOperationalKPIChange();
    expect(component.reportModel.sectorwiseOperationalKPIs).toEqual([component.operationalddlmodel.selectedOperationalKPI]);
  });

  it('should set reportModel.portfolioCompany to an object containing portfolioCompanyID', () => {
    component.onOperationalKPIChange();
    expect(component.reportModel.portfolioCompany).toEqual({ PortfolioCompanyID: component.operationalModel.portfolioCompanyID });
  });

  it('should call getCompanyFinancialReports', () => {
    spyOn(component, 'getCompanyFinancialReports');
    component.onOperationalKPIChange();
    expect(component.getCompanyFinancialReports).toHaveBeenCalled();
  });
});
});