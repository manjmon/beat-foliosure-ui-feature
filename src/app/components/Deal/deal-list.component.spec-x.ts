import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef,ElementRef} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { DealDetailsConstants } from "../../common/constants";
import { FormsModule } from "@angular/forms";
import { DealListComponent } from "./deal-list.component";
import { MatMenuModule } from "@angular/material/menu";

describe("DealListComponent", () => {
  let component: DealListComponent;
  let fixture: ComponentFixture<DealListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const elementRefStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const dealServiceStub = () => ({
      getDealsQuery: object => ({ subscribe: f => f({}) }),
      exportDealNewTransaction: object => ({ subscribe: f => f({}) }),
      exportDealList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      downloadExcelFile: response => ({}),
      GetPaginatorEvent: elementRef => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DealListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DealListComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`dealData has default value`, () => {
    expect(component.dealData).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isExportLoading has default value`, () => {
    expect(component.isExportLoading).toEqual(false);
  });

  it(`dealDetailsConstants has default value`, () => {
    expect(component.dealDetailsConstants).toEqual(DealDetailsConstants);
  });

  it(`isdownloadfilter has default value`, () => {
    expect(component.isdownloadfilter).toEqual(true);
  });

  it(`show has default value`, () => {
    expect(component.show).toEqual(false);
  });

  it(`disableConfirm has default value`, () => {
    expect(component.disableConfirm).toEqual(false);
  });

  it(`newInvestmentsNotFound has default value`, () => {
    expect(component.newInvestmentsNotFound).toEqual(false);
  });

  describe("loadDealsLazy", () => {
    it("makes expected calls", () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, "getDealList").and.callThrough();
      component.loadDealsLazy(lazyLoadEventStub);
      expect(component.getDealList).toHaveBeenCalled();
    });
  });

  describe("downloadNewInvestment", () => {
    it("makes expected calls", () => {
      spyOn(component, "exportDealNewInvestment").and.callThrough();
      component.downloadNewInvestment();
      expect(component.exportDealNewInvestment).toHaveBeenCalled();
    });
  });

  describe("exportDealList", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(dealServiceStub, "exportDealList").and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportDealList();
      expect(dealServiceStub.exportDealList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("searchLoadPCLazy", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "GetPaginatorEvent").and.callThrough();
      component.searchLoadPCLazy();
      expect(miscellaneousServiceStub.GetPaginatorEvent).toHaveBeenCalled();
    });
  });
});
