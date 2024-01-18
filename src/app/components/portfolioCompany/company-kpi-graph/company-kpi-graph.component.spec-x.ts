import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService ,ReportType,ReportCategory} from 'src/app/services/report.service';
import { FeaturesEnum,UserSubFeaturesEnum,ActionsEnum } from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { CompanyKpiGraphComponent } from './company-kpi-graph.component';

describe('CompanyKpiGraphComponent', () => {
  let component: CompanyKpiGraphComponent;
  let fixture: ComponentFixture<CompanyKpiGraphComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const reportServiceStub = () => ({
      getReportData: objQueryModel => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CompanyKpiGraphComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CompanyKpiGraphComponent);
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

  it(`CompanyKPIOrginalData has default value`, () => {
    expect(component.CompanyKPIOrginalData).toEqual([]);
  });

  it(`CompanyKPIChartData has default value`, () => {
    expect(component.CompanyKPIChartData).toEqual([]);
  });

  it(`CompanyKPIChartCol has default value`, () => {
    expect(component.CompanyKPIChartCol).toEqual([]);
  });


  describe('getCompanyKPIReport', () => {
    it('makes expected calls', () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, 'OnCompanyKPIChange').and.callThrough();
      spyOn(reportServiceStub, 'getReportData').and.callThrough();
      component.getCompanyKPIReport();
      expect(component.OnCompanyKPIChange).toHaveBeenCalled();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });
});
