import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { UpdateInfoSectionComponent } from './update-info-section.component';
import { of } from 'rxjs';

describe('UpdateInfoSectionComponent', () => {
  let component: UpdateInfoSectionComponent;
  let fixture: ComponentFixture<UpdateInfoSectionComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { params: { id: {} } }
    });
    const ngbActiveModalStub = () => ({});
    const confirmationServiceStub = () => ({});
    const messageServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const portfolioCompanyServiceStub = () => ({
      getuploadfiles: jasmine.createSpy('getuploadfiles').and.returnValue(of({})),
      impactsaveuploadlogs: jasmine.createSpy('impactsaveuploadlogs').and.returnValue(of({})),
      getPortfolioCompanyCommentarySections:jasmine.createSpy('getPortfolioCompanyCommentarySections').and.returnValue(of({}))
      
      // other methods here
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      bindYearList: () => ({}),
      getQuarter: () => ({})
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UpdateInfoSectionComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbActiveModal, useFactory: ngbActiveModalStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: PortfolioCompanyService, useFactory: portfolioCompanyServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(UpdateInfoSectionComponent);
    component = fixture.componentInstance;
    component.sectionName = 'SignificantEvents';
    component.portfolioCompanyCommentaryDetails = {
      significantEventsSectionData: {
        item4: 'sectionDetails',
        item3: 'selectedQuarter',
        item2: 'selectedYear'
      }
    };
    component.infoSectionModel = { portfolioCompanyID: "1" };
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`saveText has default value`, () => {
    expect(component.saveText).toEqual('Update');
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual('Reset');
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual([
      { value: 'Q1', text: 'Q1' },
      { value: 'Q2', text: 'Q2' },
      { value: 'Q3', text: 'Q3' },
      { value: 'Q4', text: 'Q4' }
    ]);
  });

  it(`monthOptions has default value`, () => {
    expect(component.monthOptions).toEqual([
      { value: '1', text: 'January' },
      { value: '2', text: 'February' },
      { value: '3', text: 'March' },
      { value: '4', text: 'April' },
      { value: '5', text: 'May' },
      { value: '6', text: 'June' },
      { value: '7', text: 'July' },
      { value: '8', text: 'August' },
      { value: '9', text: 'September' },
      { value: '10', text: 'October' },
      { value: '11', text: 'November' },
      { value: '12', text: 'December' }
    ]);
  });

  it(`model returns portfolioCompanyCommentaryDetails`, () => {
    expect(component.model).toEqual(component.portfolioCompanyCommentaryDetails);
  });

  it(`model sets infoSectionModel and infoSectionModelClone`, () => {
    const model = { portfolioCompanyFinancialKPIMonthID: 1 };
    component.model = model;
    expect(component.infoSectionModel).toEqual(model);
    expect(component.infoSectionModelClone).toEqual(model);
    expect(component.saveText).toEqual('Update');
    expect(component.resetText).toEqual('Reload');
  });


  it(`ngOnInit sets sectionDetails, selectedQuarter, selectedYear`, () => {
    component.sectionName = 'Footnote Investment KPI';
    component.portfolioCompanyCommentaryDetails = {
      footNoteInvestmentKPISectionData: {
        item4: 'sectionDetails',
        item3: 'selectedQuarter',
        item2: 'selectedYear'
      }
    };
    component.ngOnInit();
    expect(component.sectionDetails).toEqual('sectionDetails');
    expect(component.selectedQuarter).toEqual('selectedQuarter');
    expect(component.selectedYear).toEqual('selectedYear');
  });

  it(`ngOnInit sets sectionDetails, selectedQuarter, selectedYear`, () => {
    component.sectionName = 'Footnote Trading Record';
    component.portfolioCompanyCommentaryDetails = {
      footNoteTradingRecordSectionData: {
        item4: 'sectionDetails',
        item3: 'selectedQuarter',
        item2: 'selectedYear'
      }
    };
    component.ngOnInit();
    expect(component.sectionDetails).toEqual('sectionDetails');
    expect(component.selectedQuarter).toEqual('selectedQuarter');
    expect(component.selectedYear).toEqual('selectedYear');
  });
  it('should delete uploaded files', () => {
    // Arrange
    component.comapnyid = 1;
    component.selectYear = '2022';
    component.selectQuarter = 'Q1';

    // Act
    component.delteuploadedfiles();

    // Assert
    const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    expect(companyServiceStub.getuploadfiles).toHaveBeenCalledWith('Impact&1&2022&Q1');
  });
  it('should save impact upload logs', () => {
    // Arrange
    component.comapnyid = 1;
    component.selectYear = '2022';
    component.selectQuarter = 'Q1';
  
    // Act
    component.impactuploadlogossave();
  
    // Assert
    const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    expect(portfolioCompanyServiceStub.impactsaveuploadlogs).toHaveBeenCalledWith('1&2022&Q1');
  });
  it('should call delteuploadedfiles and emit "cancel" on onCancelstatus', () => {
    // Arrange
    spyOn(component, 'delteuploadedfiles');
    spyOn(component.onCancel, 'emit');
  
    // Act
    component.onCancelstatus();
  
    // Assert
    expect(component.delteuploadedfiles).toHaveBeenCalled();
    expect(component.onCancel.emit).toHaveBeenCalledWith('cancel');
  });
  describe('getPortfolioCompanyCommentarySections', () => {
    it('should set selectQuarter and selectYear', () => {
      // Arrange
      const companyId = 1;
      const quarterName = 'Q1';
      const year = '2022';
      component.selectedQuarter = quarterName;
      component.selectedYear = year;

      // Act
      component.getPortfolioCompanyCommentarySections(companyId, quarterName, year);

      // Assert
      expect(component.selectQuarter).toEqual(quarterName);
      expect(component.selectYear).toEqual(year);
    });

    it('should call getPortfolioCompanyCommentarySections with correct parameters', () => {
      // Arrange
      const companyId = 1;
      const quarterName = 'Q1';
      const year = '2022';
      component.selectedQuarter = quarterName;
      component.selectedYear = year;
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      // Act
      component.getPortfolioCompanyCommentarySections(companyId, quarterName, year);

      // Assert
      expect(portfolioCompanyServiceStub.getPortfolioCompanyCommentarySections).toHaveBeenCalledWith({
        encryptedPortfolioCompanyId: companyId.toString(),
        quarter: quarterName,
        year: year,
      });
    });
    it('should set portfolioCompanyCommentaryDetails to null if response code is not "OK"', () => {
      // Arrange
      const companyId = 1;
      const quarterName = 'Q1';
      const year = '2022';
      component.selectedQuarter = quarterName;
      component.selectedYear = year;
      const response = {
        code: 'ERROR',
        body: {},
      };
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      // Act
      component.getPortfolioCompanyCommentarySections(companyId, quarterName, year);

      // Assert
      expect(component.portfolioCompanyCommentaryDetails).toBeNull();
    });
  });

});