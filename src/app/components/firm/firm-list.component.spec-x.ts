import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef,ElementRef} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { FormsModule } from '@angular/forms';
import { FirmListComponent } from './firm-list.component';

describe('FirmListComponent', () => {
  let component: FirmListComponent;
  let fixture: ComponentFixture<FirmListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const elementRefStub = () => ({});
    const accountServiceStub = () => ({});
    const firmServiceStub = () => ({
      getFirmList: object => ({ subscribe: f => f({}) }),
      exportFirmList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      downloadExcelFile: response => ({}),
      GetPaginatorEvent: elementRef => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FirmListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FirmListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`firms has default value`, () => {
    expect(component.firms).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  describe('loadFirmsLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getFirmList').and.callThrough();
      component.loadFirmsLazy(lazyLoadEventStub);
      expect(component.getFirmList).toHaveBeenCalled();
    });
  });

  describe('exportFirmList', () => {
    it('makes expected calls', () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(firmServiceStub, 'exportFirmList').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      component.exportFirmList();
      expect(firmServiceStub.exportFirmList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe('searchLoadPCLazy', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'getFirmList').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPaginatorEvent').and.callThrough();
      component.searchLoadPCLazy();
      expect(component.getFirmList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPaginatorEvent).toHaveBeenCalled();
    });
  });
});
