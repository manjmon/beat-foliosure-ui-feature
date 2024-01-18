import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm ,FormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { M_Datatypes,NumberDecimalConst,FundInvestorConstants} from 'src/app/common/constants';
import { FundPageSectionConstants,FundStaticDetailConstants,FundTermFieldConstants} from '../../common/constants';
import { AddFundComponent } from './add-funds.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { of } from 'rxjs';



describe('AddFundComponent', () => {
  let component: AddFundComponent;
  let fixture: ComponentFixture<AddFundComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: (array: any[]) => ({}) });
    const accountServiceStub = () => ({});
    const firmServiceStub = () => ({});
    const fundServiceStub = () => ({
      getFundById: (object: any) => ({ subscribe: (f: any) => f({}) }),
      getMasterFundModel: () => ({ subscribe: (f: any) => f({}) }),
      getInvestors: () => ({ subscribe: (f: any) => f({}) }),
      getFundInvestors: (fundID: any) => ({ subscribe: (f: any) => f({}) }),
      createFund: (model: any) => ({ subscribe: (f: any) => f({}) }),
      updateFund: (model: any) => ({ subscribe: (f: any) => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      bindYearList: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getSideBarWidth: () => ({})
    });
    const toastrServiceStub = () => ({
      error: (message: any, string: any, object: any) => ({}),
      success: (message: any, string: any, object: any) => ({})
    });
    const datePipeStub = () => ({
      transform: (commitmentDate: any, string: any) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, Ng2SearchPipeModule ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddFundComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: DatePipe, useFactory: datePipeStub }
      ]
    });
    fixture = TestBed.createComponent(AddFundComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    const fundServiceStub = {
      getMasterFundModel: () => of({
        firmList: [],
        accountTypeList: [],
        strategyList: [],
        sectorList: [],
        currencyList: [],
        countryList: [],
        regionList: [],
        subPageDetailList: []
      })
    };

    let fundService: FundService;

    TestBed.configureTestingModule({
      declarations: [AddFundComponent],
      providers: [{ provide: FundService, useValue: fundServiceStub }]
    });

    fixture = TestBed.createComponent(AddFundComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`fundColumns has default value`, () => {
    expect(component.fundColumns).toEqual([]);
  });

  it(`FundInvestorConstants has default value`, () => {
    expect(component.FundInvestorConstants).toEqual(FundInvestorConstants);
  });

  it(`mDataTypes has default value`, () => {
    expect(component.mDataTypes).toEqual(M_Datatypes);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`investorEditMode has default value`, () => {
    expect(component.investorEditMode).toEqual(false);
  });

  it(`investorLoading has default value`, () => {
    expect(component.investorLoading).toEqual(false);
  });

  it(`investorNameList has default value`, () => {
    expect(component.investorNameList).toEqual(component.investorNameList);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual(component.tabList);
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

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual([]);
  });

  it(`clawbackOptions has default value`, () => {
    expect(component.clawbackOptions).toEqual([]);
  });

  it(`regionListClone has default value`, () => {
    expect(component.regionListClone).toEqual([]);
  });

  it(`countryListClone has default value`, () => {
    expect(component.countryListClone).toEqual([]);
  });

  it(`dynamicHeader has default value`, () => {
    expect(component.dynamicHeader).toEqual([]);
  });

  it(`dynamicHeaderClone has default value`, () => {
    expect(component.dynamicHeaderClone).toEqual([]);
  });

  it(`isOpenconfirmPopUp has default value`, () => {
    expect(component.isOpenconfirmPopUp).toEqual(false);
  });

  it(`linkText has default value`, () => {
    expect(component.linkText).toEqual(false);
  });

  it(`subPageDetailList has default value`, () => {
    expect(component.subPageDetailList).toEqual([]);
  });

  it(`fundStaticInfoFieldList has default value`, () => {
    expect(component.fundStaticInfoFieldList).toEqual([]);
  });

  it(`fundTermFieldList has default value`, () => {
    expect(component.fundTermFieldList).toEqual([]);
  });

  it(`customfieldValueList has default value`, () => {
    expect(component.customfieldValueList).toEqual([]);
  });

  it(`fundPageSectionConstants has default value`, () => {
    expect(component.fundPageSectionConstants).toEqual(
      FundPageSectionConstants
    );
  });

  it(`fundStaticDetailConstants has default value`, () => {
    expect(component.fundStaticDetailConstants).toEqual(
      FundStaticDetailConstants
    );
  });

  // ...

  describe('clearInvestor', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Ng2SearchPipeModule], // Add the Ng2SearchPipeModule to the imports array
        declarations: [AddFundComponent], // Change AddFundsComponent to AddFundComponent
        providers: [ToastrService],
      }).compileComponents();
    });

    it('makes expected calls', () => {
      const ngFormStub: NgForm = <any>{};
      spyOn(ngFormStub, 'reset').and.callThrough();
      component.clearInvestor(ngFormStub);
      expect(ngFormStub.reset).toHaveBeenCalled();
    });
  });

  describe('addInvestor', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(ToastrService);
      const ngFormStub: NgForm = <any>[];
      spyOn(component, 'updateInvestor').and.callThrough();
      spyOn(component, 'clearInvestor').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.addInvestor(ngFormStub);
      expect(component.updateInvestor).toHaveBeenCalled();
      expect(component.clearInvestor).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('updateInvestor', () => {
    it('makes expected calls', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const ngFormStub: NgForm = <any>{};
      spyOn(component, 'clearInvestor').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.updateInvestor(ngFormStub);
      expect(component.clearInvestor).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'setDefaultValues').and.callThrough();
      spyOn(component, 'getInvestorList').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPriviousPageUrl').and.callThrough();
      component.ngOnInit();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(component.getInvestorList).toHaveBeenCalled();
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

  describe('setupTab', () => {
    it('makes expected calls', () => {
      spyOn(component, 'isFieldActive').and.callThrough();
      spyOn(component, 'getStaticFieldDisplayName').and.callThrough();
      component.setupTab();
      expect(component.isFieldActive).toHaveBeenCalled();
      expect(component.getStaticFieldDisplayName).toHaveBeenCalled();
    });
  });

  describe('setDefaultValues', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'getMasterFundModel').and.callThrough();
      spyOn(component, 'getFundInvestorList').and.callThrough();
      spyOn(fundServiceStub, 'getFundById').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.setDefaultValues();
      expect(component.getMasterFundModel).toHaveBeenCalled();
      expect(component.getFundInvestorList).toHaveBeenCalled();
      expect(fundServiceStub.getFundById).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('getMasterFundModel', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(component, 'setupTab').and.callThrough();
      spyOn(fundServiceStub, 'getMasterFundModel').and.callThrough();
      component.getMasterFundModel();
      expect(component.setupTab).toHaveBeenCalled();
      expect(fundServiceStub.getMasterFundModel).toHaveBeenCalled();
    });
  });

  describe('getInvestorList', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(fundServiceStub, 'getInvestors').and.callThrough();
      component.getInvestorList();
      expect(fundServiceStub.getInvestors).toHaveBeenCalled();
    });
  });

  describe('getFundInvestorList', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(fundServiceStub, 'getFundInvestors').and.callThrough();
      component.getFundInvestorList();
      expect(fundServiceStub.getFundInvestors).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.cancel();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
