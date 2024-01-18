import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { FormsModule } from '@angular/forms';
import { DynamicQueriesListComponent } from './dynamic-queries.component';

describe('DynamicQueriesListComponent', () => {
  let component: DynamicQueriesListComponent;
  let fixture: ComponentFixture<DynamicQueriesListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      GetDynamicQueriesList: object => ({ subscribe: f => f({}) }),
      redirectToLogin: error => ({}),
      exportQueries: object => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DynamicQueriesListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DynamicQueriesListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`querys has default value`, () => {
    expect(component.querys).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('loadQueriesLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'GetDynamicQueriesList').and.callThrough();
      component.loadQueriesLazy(lazyLoadEventStub);
      expect(component.GetDynamicQueriesList).toHaveBeenCalled();
    });
  });

  describe('exportQueryList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'exportQueries').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      component.exportQueryList();
      expect(miscellaneousServiceStub.exportQueries).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });
});
