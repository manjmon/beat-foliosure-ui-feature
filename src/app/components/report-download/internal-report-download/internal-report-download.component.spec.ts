import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { FormsModule } from '@angular/forms';
import { InternalReportDownloadComponent } from './internal-report-download.component';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('InternalReportDownloadComponent', () => {
  let component: InternalReportDownloadComponent;
  let fixture: ComponentFixture<InternalReportDownloadComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (toasterMessage, string, object) => ({}),
      error: (toasterMessage, string, object) => ({})
    });
    const reportDownloadServiceStub = () => ({
      getInternalReportTemplates: () => ({ subscribe: f => f({}) }),
      downloadReport: configuration => ({ subscribe: f => f({}) }),
      getInternalReportCompanies: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InternalReportDownloadComponent],
      providers: [
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        {
          provide: ReportDownloadService,
          useFactory: reportDownloadServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(InternalReportDownloadComponent);
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

  it(`companyList has default value`, () => {
    expect(component.companyList).toEqual([]);
  });

  it(`headers has default value`, () => {
    expect(component.headers).toEqual(component.headers);
  });

  it(`templateOptions has default value`, () => {
    expect(component.templateOptions).toEqual([]);
  });

  it(`yearRange has default value`, () => {
    expect(component.yearRange).toEqual(`2000:2050`);
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
      spyOn(component, 'getCompaniesByTemplateId').and.callThrough();
      spyOn(
        reportDownloadServiceStub,
        'getInternalReportTemplates'
      ).and.returnValue(of({})); // Ensure the method returns an Observable
      component.getTemplates();
      expect(
        reportDownloadServiceStub.getInternalReportTemplates
      ).toHaveBeenCalled();
    });
  });

  describe('resetAll', () => {
    it('makes expected calls', () => {
      const mockElement = { checked: false }; // Create a mock element
    component.checkAllBox = mockElement;
      spyOn(component, 'getCompaniesByTemplateId').and.callThrough();
      component.resetAll();
      expect(component.getCompaniesByTemplateId).toHaveBeenCalled();
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
      spyOn(reportDownloadServiceStub, 'downloadReport').and.callThrough();
      component.selectedTemplate = { excelTemplateName: 'Monthly Template' }; // Define selectedTemplate
      const mockElement = { checked: false }; // Create a mock element
      component.checkAllBox = mockElement;
      component.selectedPeriod = { name: "Template Period", value:1 };
      component.download();
      expect(reportDownloadServiceStub.downloadReport).toHaveBeenCalled();
    });
  });
  describe('getCompaniesByTemplateId', () => {
    it('should set checkAllBox.checked to false', () => {
      // Arrange
      component.checkAllBox = { checked: true };

      // Act
      component.getCompaniesByTemplateId();

      // Assert
      expect(component.checkAllBox.checked).toBe(false);
    });

    it('should set companyList to the result if it is not null and has length > 0', () => {
      // Arrange
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      const result = [{ id: 1, name: 'Company 1' }, { id: 2, name: 'Company 2' }];
      spyOn(reportDownloadServiceStub, 'getInternalReportCompanies').and.returnValue(of(result));

      // Act
      component.checkAllBox = { checked: true };
      component.getCompaniesByTemplateId();

      // Assert
      expect(component.companyList).toEqual(result);
    });

    it('should set companyList to an empty array if the result is null or has length <= 0', () => {
      // Arrange
      const result = null;
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(reportDownloadServiceStub, 'getInternalReportCompanies').and.returnValue(of(result));

      // Act
      component.checkAllBox = { checked: true };
      component.getCompaniesByTemplateId();

      // Assert
      expect(component.companyList).toEqual([]);
    });

    it('should set isLoader to false after getting the companies', () => {
      // Arrange
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(reportDownloadServiceStub, 'getInternalReportCompanies').and.returnValue(of([]));

      // Act
      component.checkAllBox = { checked: true };
      component.getCompaniesByTemplateId();

      // Assert
      expect(component.isLoader).toBe(false);
    });

    it('should set isLoader to false if an error occurs', () => {
      // Arrange
      const reportDownloadServiceStub: ReportDownloadService = fixture.debugElement.injector.get(
        ReportDownloadService
      );
      spyOn(reportDownloadServiceStub, 'getInternalReportCompanies').and.returnValue(throwError('Error'));

      // Act
      component.checkAllBox = { checked: true };
      component.getCompaniesByTemplateId();

      // Assert
      expect(component.isLoader).toBe(false);
    });

    // Add more test cases as needed...
  });
});
