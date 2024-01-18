import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { FormsModule } from '@angular/forms';
import { FundListComponent } from './fund-list.component';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('FundListComponent', () => {
  let component: FundListComponent;
  let fixture: ComponentFixture<FundListComponent>;
  let fundService: FundService;
  let miscellaneousService: MiscellaneousService;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const elementRefStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const fundServiceStub = () => ({
      exportFundList: object => ({ subscribe: f => f({}) }),
      getFundsListData: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      downloadExcelFile: response => ({}),
      getTitle: arg => ({}),
      GetPaginatorEvent: elementRef => ({}),
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FundListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FundListComponent);
    component = fixture.componentInstance;
    fundService = TestBed.inject(FundService);
    miscellaneousService = TestBed.inject(MiscellaneousService);
  });
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const elementRefStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const fundServiceStub = () => ({
      exportFundList: object => ({ subscribe: f => f({}) }),
      getFundsListData: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      downloadExcelFile: response => ({}),
      getTitle: arg => ({}),
      GetPaginatorEvent: elementRef => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FundListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FundListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`funds has default value`, () => {
    expect(component.funds).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`fundStaticConfiguartionData has default value`, () => {
    expect(component.fundStaticConfiguartionData).toEqual([]);
  });

  it(`headers has default value`, () => {
    expect(component.headers).toEqual([]);
  });

  describe('loadFundsLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getAllFundDetails').and.callThrough();
      component.loadFundsLazy(lazyLoadEventStub);
      expect(component.getAllFundDetails).toHaveBeenCalled();
    });
  });

  describe('exportFundList', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(fundServiceStub, 'exportFundList').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      component.exportFundList();
      expect(fundServiceStub.exportFundList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe('searchLoadPCLazy', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'getAllFundDetails').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPaginatorEvent').and.callThrough();
      component.searchLoadPCLazy();
      expect(component.getAllFundDetails).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPaginatorEvent).toHaveBeenCalled();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.feature).toEqual(FeaturesEnum);
    expect(component.funds).toEqual([]);
    expect(component.blockedTable).toEqual(false);
    expect(component.isLoader).toEqual(false);
    expect(component.fundStaticConfiguartionData).toEqual([]);
    expect(component.headers).toEqual([]);
  });

  it('should export fund list', () => {
    const paginationFilterClone = { globalFilter: 'test' };
    spyOn(component.paginationFilterClone, 'globalFilter').and.returnValue('test');
    spyOn(fundService, 'exportFundList').and.returnValue(of(new HttpResponse<Blob>()));
    spyOn(miscellaneousService, 'downloadExcelFile');
    component.exportFundList();
    expect(fundService.exportFundList).toHaveBeenCalledWith({ paginationFilter: paginationFilterClone });
    expect(miscellaneousService.downloadExcelFile).toHaveBeenCalled();
  });

  it('should load funds lazily', () => {
    const lazyLoadEventStub: LazyLoadEvent = {};
    spyOn(component, 'getAllFundDetails');
    component.loadFundsLazy(lazyLoadEventStub);
    expect(component.getAllFundDetails).toHaveBeenCalledWith(lazyLoadEventStub);
  });

  it('should redirect to fund details', () => {
    const fund = { fundName: 'Test Fund', encryptedFundId: '123' };
    spyOn(localStorage, 'setItem');
    spyOn(component['router'], 'navigate'); // Change 'router' access modifier to public
    component.redirectToFund(fund);
    expect(localStorage.setItem).toHaveBeenCalledWith('headerName', fund.fundName);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/fund-details', fund.encryptedFundId]); // Change 'router' access modifier to public
  });

  it('should get all fund details with event', () => {
    const event = { first: 0, rows: 20, globalFilter: null, sortField: null, sortOrder: 1 };
    spyOn(component, 'paginationFilterClone').and.callThrough();
    spyOn(fundService, 'getFundsListData').and.returnValue(of({ body: { headers: [], fundStaticConfiguartionData: [], totalRecords: 0 }, code: 'OK' }));
    spyOn(miscellaneousService, 'getTitle');
    component.getAllFundDetails(event);
    expect(component.isLoader).toHaveBeenCalledWith(true);
    expect(component.paginationFilterClone).toHaveBeenCalledWith(event);
    expect(fundService.getFundsListData).toHaveBeenCalledWith({ paginationFilter: event });
    expect(miscellaneousService.getTitle).toHaveBeenCalled();
    expect(component.headers).toEqual([]);
    expect(component.fundStaticConfiguartionData).toEqual([]);
    expect(component.totalRecords).toEqual(0);
    expect(component.totalPage).toEqual(1);
    expect(component.isLoader).toHaveBeenCalledWith(false);
    expect(component.blockedTable).toEqual(false);
    expect(component.isLoader).toHaveBeenCalledWith(false);
  });

  it('should get all fund details without event', () => {
    const event: any = null;
    spyOn(component, 'paginationFilterClone').and.callThrough();
    spyOn(fundService, 'getFundsListData').and.returnValue(of({ body: { headers: [], fundStaticConfiguartionData: [], totalRecords: 0 }, code: 'OK' }));
    spyOn(miscellaneousService, 'getTitle');
    component.getAllFundDetails(event);
    expect(component.isLoader).toHaveBeenCalledWith(true);
    expect(component.paginationFilterClone).toHaveBeenCalledWith({ first: 0, rows: 20, globalFilter: null, sortField: null, sortOrder: 1 });
    expect(fundService.getFundsListData).toHaveBeenCalledWith({ paginationFilter: { first: 0, rows: 20, globalFilter: null, sortField: null, sortOrder: 1 } });
    expect(miscellaneousService.getTitle).toHaveBeenCalled();
    expect(component.headers).toEqual([]);
    expect(component.fundStaticConfiguartionData).toEqual([]);
    expect(component.totalRecords).toEqual(0);
    expect(component.totalPage).toEqual(1);
    expect(component.isLoader).toHaveBeenCalledWith(false);
    expect(component.blockedTable).toEqual(false);
    expect(component.isLoader).toHaveBeenCalledWith(false);
  });

  it('should search load PC lazily with fundStaticConfiguartionData', () => {
    spyOn(miscellaneousService, 'GetPaginatorEvent');
    component.fundStaticConfiguartionData = [{}];
    component.searchLoadPCLazy();
    expect(miscellaneousService.GetPaginatorEvent).toHaveBeenCalledWith((component as any).elementRef);
  });

  it('should search load PC lazily without fundStaticConfiguartionData', () => {
    spyOn(component, 'getAllFundDetails');
    spyOn(miscellaneousService, 'GetPaginatorEvent');
    component.fundStaticConfiguartionData = [];
    component.globalFilter = 'test';
    component.searchLoadPCLazy();
    expect(component.getAllFundDetails).toHaveBeenCalledWith({ first: 0, rows: 20, globalFilter: 'test', sortField: null, sortOrder: 1 });
    expect(miscellaneousService.GetPaginatorEvent).not.toHaveBeenCalled();
  });
});
