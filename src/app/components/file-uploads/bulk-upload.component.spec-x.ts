import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { FileUploadService } from '../../services/file-upload.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { PermissionService,UserSubFeaturesEnum,ActionsEnum} from '../../services/permission.service';
import { FundService } from '../../services/funds.service';
import { ToastrService } from 'ngx-toastr';
import { InvestorService } from 'src/app/services/investor.service';
import { FormsModule } from '@angular/forms';
import { BulkUploadComponent } from './bulk-upload.component';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  beforeEach(() => {
    const domSanitizerStub = () => ({});
    const messageServiceStub = () => ({ add: object => ({}) });
    const fileUploadServiceStub = () => ({
      importBulkData: (formData, strAPIURL) => ({ subscribe: f => f({}) }),
      exportTemplates: res => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      bindYearList: () => ({}),
      getBulkModules: () => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({}),
      showAlertMessages: (string, string1) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompany: () => ({ subscribe: f => f({}) })
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (arg, arg2, encryptedPortfolioCompanyID) => ({})
    });
    const fundServiceStub = () => ({
      getFundData: () => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const investorServiceStub = () => ({
      getinvestorlist: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BulkUploadComponent],
      providers: [
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: FileUploadService, useFactory: fileUploadServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: InvestorService, useFactory: investorServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`uploadedFiles has default value`, () => {
    expect(component.uploadedFiles).toEqual([]);
  });

  it(`messages has default value`, () => {
    expect(component.messages).toEqual([]);
  });

  it(`errormessages has default value`, () => {
    expect(component.errormessages).toEqual([]);
  });

  it(`messageClass has default value`, () => {
    expect(component.messageClass).toEqual(`bulkMessage`);
  });

  it(`value has default value`, () => {
    expect(component.value).toEqual(0);
  });

  it(`cancel has default value`, () => {
    expect(component.cancel).toEqual(false);
  });

  it(`interval has default value`, () => {
    expect(component.interval).toEqual(0);
  });

  it(`ProgressCancel has default value`, () => {
    expect(component.ProgressCancel).toEqual(true);
  });

  it(`showCancelButton has default value`, () => {
    expect(component.showCancelButton).toEqual(true);
  });

  it(`FileProgresStatus has default value`, () => {
    expect(component.FileProgresStatus).toEqual(`Cancel File Progress`);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`PorfolioCompanies has default value`, () => {
    expect(component.PorfolioCompanies).toEqual([]);
  });

  it(`FundsList has default value`, () => {
    expect(component.FundsList).toEqual([]);
  });

  it(`fundDropDownDisabled has default value`, () => {
    expect(component.fundDropDownDisabled).toEqual(true);
  });

  it(`isFundModuleSelected has default value`, () => {
    expect(component.isFundModuleSelected).toEqual(false);
  });

  it(`isConditionalDropDown has default value`, () => {
    expect(component.isConditionalDropDown).toEqual(`common`);
  });

  it(`IsValidFundName has default value`, () => {
    expect(component.IsValidFundName).toEqual(true);
  });

  it(`IsValidInvestor has default value`, () => {
    expect(component.IsValidInvestor).toEqual(true);
  });

  it(`CompanyDisabled has default value`, () => {
    expect(component.CompanyDisabled).toEqual(true);
  });

  it(`IsValidCompany has default value`, () => {
    expect(component.IsValidCompany).toEqual(false);
  });

  it(`EnableDownload has default value`, () => {
    expect(component.EnableDownload).toEqual(true);
  });

  it(`disableDownload has default value`, () => {
    expect(component.disableDownload).toEqual(false);
  });

  it(`hideUnauthorized has default value`, () => {
    expect(component.hideUnauthorized).toEqual(true);
  });

  it(`showErrorPopUp has default value`, () => {
    expect(component.showErrorPopUp).toEqual(false);
  });

  it(`subFeature has default value`, () => {
    expect(component.subFeature).toEqual(UserSubFeaturesEnum);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual(ActionsEnum);
  });

  it(`defaultPlaceholder has default value`, () => {
    expect(component.defaultPlaceholder).toEqual(`Browse`);
  });

  it(`uploadFilePlaceholder has default value`, () => {
    expect(component.uploadFilePlaceholder).toEqual(`Browse`);
  });

  it(`browseicon has default value`, () => {
    expect(component.browseicon).toEqual(true);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`investorList has default value`, () => {
    expect(component.investorList).toEqual([]);
  });

  it(`adhocPeriodTypes has default value`, () => {
    expect(component.adhocPeriodTypes).toEqual([]);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual([]);
  });

  it(`isPeriod has default value`, () => {
    expect(component.isPeriod).toEqual(false);
  });

  it(`isPeriodValidate has default value`, () => {
    expect(component.isPeriodValidate).toEqual(false);
  });

  it(`isQuarterValidate has default value`, () => {
    expect(component.isQuarterValidate).toEqual(false);
  });

  it(`isMonthValidate has default value`, () => {
    expect(component.isMonthValidate).toEqual(false);
  });

  it(`isYearValidate has default value`, () => {
    expect(component.isYearValidate).toEqual(false);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(false);
  });

  it(`errorCount has default value`, () => {
    expect(component.errorCount).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getModuleList').and.callThrough();
      spyOn(component, 'getCompanies').and.callThrough();
      spyOn(component, 'getFundList').and.callThrough();
      spyOn(component, 'getInvestorDropdownList').and.callThrough();
      component.ngOnInit();
      expect(component.getModuleList).toHaveBeenCalled();
      expect(component.getCompanies).toHaveBeenCalled();
      expect(component.getFundList).toHaveBeenCalled();
      expect(component.getInvestorDropdownList).toHaveBeenCalled();
    });
  });

  describe('getInvestorDropdownList', () => {
    it('makes expected calls', () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(investorServiceStub, 'getinvestorlist').and.callThrough();
      component.getInvestorDropdownList();
      expect(investorServiceStub.getinvestorlist).toHaveBeenCalled();
    });
  });

  describe('getCompanies', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
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

  describe('getBulkModules', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getBulkModules').and.callThrough();
      component.getBulkModules();
      expect(miscellaneousServiceStub.getBulkModules).toHaveBeenCalled();
    });
  });

  describe('getModuleList', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getBulkModules').and.callThrough();
      component.getModuleList();
      expect(component.getBulkModules).toHaveBeenCalled();
    });
  });

  describe('getFundList', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(fundServiceStub, 'getFundData').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.getFundList();
      expect(fundServiceStub.getFundData).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('DownloadTemplate', () => {
    it('makes expected calls', () => {
      const fileUploadServiceStub: FileUploadService = fixture.debugElement.injector.get(
        FileUploadService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(fileUploadServiceStub, 'exportTemplates').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(miscellaneousServiceStub, 'showAlertMessages').and.callThrough();
      component.DownloadTemplate();
      expect(fileUploadServiceStub.exportTemplates).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });
});
