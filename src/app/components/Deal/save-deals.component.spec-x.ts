import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DealService } from '../../services/deal.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { ToastrService } from 'ngx-toastr';
import { DealDetailsConstants } from '../../common/constants';
import { FormsModule } from '@angular/forms';
import { SaveDealComponent } from './save-deals.component';

describe('SaveDealComponent', () => {
  let component: SaveDealComponent;
  let fixture: ComponentFixture<SaveDealComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({});
    const accountServiceStub = () => ({});
    const dealServiceStub = () => ({
      getDealsPageConfiguration: object => ({ subscribe: f => f({}) }),
      getMasterDealModel: () => ({ subscribe: f => f({}) }),
      saveDeal: model => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      getFundNamesList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getSideBarWidth: () => ({}),
      getCurrencyList: () => ({ subscribe: f => f({}) }),
      getDealBoardSeatList: () => ({ subscribe: f => f({}) }),
      getDealExitMethodList: () => ({ subscribe: f => f({}) }),
      getDealInvestmentStageList: () => ({ subscribe: f => f({}) }),
      getDealSecurityTypeList: () => ({ subscribe: f => f({}) }),
      getDealSourcingList: () => ({ subscribe: f => f({}) }),
      getDealTransactionRoleList: () => ({ subscribe: f => f({}) }),
      getDealValuationMethodologyList: () => ({ subscribe: f => f({}) }),
      getPortfolioCompanyEmployeesList: () => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (string, string1, object) => ({}),
      success: (message, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SaveDealComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SaveDealComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`masterDataLoadRequired has default value`, () => {
    expect(component.masterDataLoadRequired).toEqual(true);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`dealData has default value`, () => {
    expect(component.dealData).toEqual([]);
  });

  it(`customFieldsData has default value`, () => {
    expect(component.customFieldsData).toEqual([]);
  });

  it(`isUpdate has default value`, () => {
    expect(component.isUpdate).toEqual(false);
  });

  it(`dealDetailsConstants has default value`, () => {
    expect(component.dealDetailsConstants).toEqual(DealDetailsConstants);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'setDefaultValues').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPriviousPageUrl').and.callThrough();
      component.ngOnInit();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
    });
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

  describe('setDefaultValues', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getDealConfigurationAndData').and.callThrough();
      spyOn(component, 'getMasterList').and.callThrough();
      component.setDefaultValues();
      expect(component.getDealConfigurationAndData).toHaveBeenCalled();
      expect(component.getMasterList).toHaveBeenCalled();
    });
  });

  describe('getMasterList', () => {
    it('makes expected calls', () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(dealServiceStub, 'getMasterDealModel').and.callThrough();
      component.getMasterList();
      expect(dealServiceStub.getMasterDealModel).toHaveBeenCalled();
    });
  });

  describe('getCurrencyList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getCurrencyList').and.callThrough();
      component.getCurrencyList();
      expect(miscellaneousServiceStub.getCurrencyList).toHaveBeenCalled();
    });
  });

  describe('getDealBoardSeatList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getDealBoardSeatList').and.callThrough();
      component.getDealBoardSeatList();
      expect(miscellaneousServiceStub.getDealBoardSeatList).toHaveBeenCalled();
    });
  });

  describe('getDealExitMethodList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getDealExitMethodList'
      ).and.callThrough();
      component.getDealExitMethodList();
      expect(miscellaneousServiceStub.getDealExitMethodList).toHaveBeenCalled();
    });
  });

  describe('getDealInvestmentStageList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getDealInvestmentStageList'
      ).and.callThrough();
      component.getDealInvestmentStageList();
      expect(
        miscellaneousServiceStub.getDealInvestmentStageList
      ).toHaveBeenCalled();
    });
  });

  describe('getDealSecurityTypeList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getDealSecurityTypeList'
      ).and.callThrough();
      component.getDealSecurityTypeList();
      expect(
        miscellaneousServiceStub.getDealSecurityTypeList
      ).toHaveBeenCalled();
    });
  });

  describe('getDealSourcingList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getDealSourcingList').and.callThrough();
      component.getDealSourcingList();
      expect(miscellaneousServiceStub.getDealSourcingList).toHaveBeenCalled();
    });
  });

  describe('getDealTransactionRoleList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getDealTransactionRoleList'
      ).and.callThrough();
      component.getDealTransactionRoleList();
      expect(
        miscellaneousServiceStub.getDealTransactionRoleList
      ).toHaveBeenCalled();
    });
  });

  describe('getDealValuationMethodologyList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getDealValuationMethodologyList'
      ).and.callThrough();
      component.getDealValuationMethodologyList();
      expect(
        miscellaneousServiceStub.getDealValuationMethodologyList
      ).toHaveBeenCalled();
    });
  });
  describe('getPortfolioList', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        'getPortfolioCompanyList'
      ).and.callThrough();
      component.getPortfolioList();
      expect(
        portfolioCompanyServiceStub.getPortfolioCompanyList
      ).toHaveBeenCalled();
    });
  });

  describe('getProfessionalsList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'getPortfolioCompanyEmployeesList'
      ).and.callThrough();
      component.getProfessionalsList();
      expect(
        miscellaneousServiceStub.getPortfolioCompanyEmployeesList
      ).toHaveBeenCalled();
    });
  });
});
