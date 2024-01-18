import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ClientReportingService } from 'src/app/services/client-reporting.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ClientReportingComponent } from './client-reporting.component';
import { of } from 'rxjs';

describe('ClientReportingComponent', () => {
  let component: ClientReportingComponent;
  let fixture: ComponentFixture<ClientReportingComponent>;

  beforeEach(() => {
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompany: () => of({})
    });
    
    const clientReportingServiceStub = () => ({
      getPeriodTypes: portfolioCompanyID => of({}),
      getTabs: adhocDownload => of([]), // Return an empty array
      getUnstructerDataByPortfolioCompanyId: (portfolioCompanyID, guId) => of({}),
      exportReports: adhocDownload => of({})
    });
    const miscellaneousServiceStub = () => ({
      bindYearList: () => of({}),
      getSideBarWidth: () => of({}),
      getQuarterLastDateByQuarter: (string, number) => of({}),
      downloadZIPFile: response => of({}),
      downloadExcelFile: response => of({})
    });
    
    const toastrServiceStub = () => ({
      error: (string, string1, object) => of({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ClientReportingComponent],
      providers: [
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        {
          provide: ClientReportingService,
          useFactory: clientReportingServiceStub
        },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClientReportingComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`companyList has default value`, () => {
    expect(component.companyList).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`reportingList has default value`, () => {
    expect(component.reportingList).toEqual([]);
  });

  it(`colHeaders has default value`, () => {
    expect(component.colHeaders).toEqual([]);
  });

  it(`customWidth has default value`, () => {
    expect(component.customWidth).toEqual(`301px`);
  });

  it(`frozenTableColumns has default value`, () => {
    expect(component.frozenTableColumns).toEqual([]);
  });

  it(`tableColumns has default value`, () => {
    expect(component.tableColumns).toEqual([]);
  });

  it(`clientReportData has default value`, () => {
    expect(component.clientReportData).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`periodTypeList has default value`, () => {
    expect(component.periodTypeList).toEqual([]);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`periodLastestEntities has default value`, () => {
    expect(component.periodLastestEntities).toEqual([]);
  });

  it(`adhocDataScroll has default value`, () => {
    expect(component.adhocDataScroll).toEqual([]);
  });

  it(`isMonthYearValidation has default value`, () => {
    expect(component.isMonthYearValidation).toEqual(false);
  });

  it(`isFromMonthYearValidation has default value`, () => {
    expect(component.isFromMonthYearValidation).toEqual(false);
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`isExportLoading has default value`, () => {
    expect(component.isExportLoading).toEqual(false);
  });

  it(`isFullExportLoading has default value`, () => {
    expect(component.isFullExportLoading).toEqual(false);
  });


  describe('getSideNavWidth', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getSideBarWidth').and.callThrough();
      component.getSideNavWidth();
      expect(miscellaneousServiceStub.getSideBarWidth).toHaveBeenCalled();
    });
  });

  describe('getCompanies', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(component, 'getPeriodTypesAndLatestData').and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        'getPortfolioCompany'
      ).and.callThrough();
      component.getCompanies();
      expect(
        portfolioCompanyServiceStub.getPortfolioCompany
      ).toHaveBeenCalled();
    });
  });


  describe('getPeriodTypesAndLatestData', () => {
    it('makes expected calls', () => {
      const clientReportingServiceStub: ClientReportingService = fixture.debugElement.injector.get(
        ClientReportingService
      );
      spyOn(component, 'changeEventControlTrigger').and.callThrough();
      spyOn(component, 'getTabList').and.callThrough();
      spyOn(clientReportingServiceStub, 'getPeriodTypes').and.callThrough();
      component.getPeriodTypesAndLatestData();
      expect(component.changeEventControlTrigger).toHaveBeenCalled();
      expect(component.getTabList).toHaveBeenCalled();
      expect(clientReportingServiceStub.getPeriodTypes).toHaveBeenCalled();
    });
  });


  describe('companyChangeEvent', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPeriodTypesAndLatestData').and.callThrough();
      component.companyChangeEvent();
      expect(component.getPeriodTypesAndLatestData).toHaveBeenCalled();
    });
  });

  
});
