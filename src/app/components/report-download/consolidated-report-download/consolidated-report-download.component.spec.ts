import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { FormsModule } from '@angular/forms';
import { ConsolidatedReportDownloadComponent } from './consolidated-report-download.component';

describe('ConsolidatedReportDownloadComponent', () => {
  let component: ConsolidatedReportDownloadComponent;
  let fixture: ComponentFixture<ConsolidatedReportDownloadComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({}),
      getQuarterLastDateByQuarter: (arg, arg3) => ( new Date())
    });
    const reportDownloadServiceStub = () => ({
      getConsolidatedReportTemplates: () => ({ subscribe: f => f({}) }),
      downloadConsolidatedReport: configuration => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConsolidatedReportDownloadComponent],
      providers: [
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: ReportDownloadService,
          useFactory: reportDownloadServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(ConsolidatedReportDownloadComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isDownload has default value`, () => {
    expect(component.isDownload).toEqual(false);
  });

  it(`isEnable has default value`, () => {
    expect(component.isEnable).toEqual(true);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`templateList has default value`, () => {
    expect(component.templateList).toEqual([]);
  });

  it(`isValidateQuarter has default value`, () => {
    expect(component.isValidateQuarter).toEqual(false);
  });

  it(`buttonToggle has default value`, () => {
    expect(component.buttonToggle).toEqual(true);
  });

  it(`isQuarters has default value`, () => {
    expect(component.isQuarters).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTemplates').and.callThrough();
      component.ngOnInit();
      expect(component.getTemplates).toHaveBeenCalled();
    });
  });

  describe('getTemplates', () => {
    it('makes expected calls', () => {
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(
        reportDownloadServiceStub,
        'getConsolidatedReportTemplates'
      ).and.callThrough();
      component.getTemplates();
      expect(
        reportDownloadServiceStub.getConsolidatedReportTemplates
      ).toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(
        reportDownloadServiceStub,
        'downloadConsolidatedReport'
      ).and.callThrough();
      component.download();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(
        reportDownloadServiceStub.downloadConsolidatedReport
      ).toHaveBeenCalled();
    });
  });

  describe('validationForQuarter', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getQuarterLastDateByQuarter').and.callThrough();
      component.fromYearQuarter = "Q1 2020"; // Define selectedQuarter if it's used in validationForQuarter
      component.toYearQuarter = "Q1 2022";
      component.validationForQuarter();
      expect(miscellaneousServiceStub.getQuarterLastDateByQuarter).toHaveBeenCalled();
    });
  });
});
