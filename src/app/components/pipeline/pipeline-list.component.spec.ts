import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PipelineService } from '../../services/pipeline.service';
import { FeaturesEnum } from '../../services/permission.service';
import { FormsModule } from '@angular/forms';
import { PipelineListComponent } from './pipeline-list.component';
import { of } from 'rxjs';

describe('PipelineListComponent', () => {
  let component: PipelineListComponent;
  let fixture: ComponentFixture<PipelineListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const elementRefStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      getTitle: arg => ({}),
      downloadExcelFile: response => ({}),
      GetPaginatorEvent: elementRef => ({})
    });
    const pipelineServiceStub = () => ({
      getPipelineList: object => ({ subscribe: f => of({}) }),
      exportPipelineList: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PipelineService, useFactory: pipelineServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PipelineListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`pipelineList has default value`, () => {
    expect(component.pipelineList).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual(`Pipeline Dashboard`);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  describe('loadPipelinesLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getPipelineList').and.callThrough();
      component.loadPipelinesLazy(lazyLoadEventStub);
      expect(component.getPipelineList).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTabList').and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
    });
  });

  describe('exportPipelineList', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(pipelineServiceStub, 'exportPipelineList').and.callThrough();
      component.exportPipelineList();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(pipelineServiceStub.exportPipelineList).toHaveBeenCalled();
    });
  });

  describe('searchLoadPCLazy', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'getPipelineList').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPaginatorEvent').and.callThrough();
      component.searchLoadPCLazy();
      expect(component.getPipelineList).toHaveBeenCalled();
    });
  });
});
