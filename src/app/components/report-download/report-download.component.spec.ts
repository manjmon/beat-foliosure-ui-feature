import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { ReportDownloadComponent } from './report-download.component';

describe('ReportDownloadComponent', () => {
  let component: ReportDownloadComponent;
  let fixture: ComponentFixture<ReportDownloadComponent>;

  beforeEach(() => {
    const reportDownloadServiceStub = () => ({
      getReportTypes: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReportDownloadComponent],
      providers: [
        {
          provide: ReportDownloadService,
          useFactory: reportDownloadServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(ReportDownloadComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`reportTypes has default value`, () => {
    expect(component.reportTypes).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getReportTypes').and.callThrough();
      component.ngOnInit();
      expect(component.getReportTypes).toHaveBeenCalled();
    });
  });

  describe('getReportTypes', () => {
    it('makes expected calls', () => {
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(reportDownloadServiceStub, 'getReportTypes').and.callThrough();
      component.getReportTypes();
      expect(reportDownloadServiceStub.getReportTypes).toHaveBeenCalled();
    });
  });
});
