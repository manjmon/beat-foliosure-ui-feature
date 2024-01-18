import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from "@angular/common/http/testing";
import { ToastrService } from "ngx-toastr";
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { EsgDatatableComponent } from './esg-datatable.component';

describe('EsgDatatableComponent', () => {
  let component: EsgDatatableComponent;
  let fixture: ComponentFixture<EsgDatatableComponent>;

  beforeEach(() => {
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (toasterMessage, string, object) => ({}),
      error: (toasterMessage, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA, SimpleChange],
      declarations: [EsgDatatableComponent],
      providers: [EsgDatatableComponent,
        { provide: 'BASE_URL', useValue: 'http://localhost' },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]

    });
    fixture = TestBed.createComponent(EsgDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
    })
  });
  describe('getCompanyKpiValueByEsgModuleId', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getCompanyKpiValueByEsgModuleId').and.callThrough();
      component.getCompanyKpiValueByEsgModuleId();
      expect(component.getCompanyKpiValueByEsgModuleId).toHaveBeenCalled();
    })
  });
  describe('formatKpiDataTable', () => {
    it('makes expected calls', () => {
      const data = [];
      const headers = [];
      component.formatKpiDataTable(data, headers);
      expect(component.ifNoDataAvailable).toBeTrue();
    })
  });
  describe('viewQuarterlyData', () => {
    it('makes expected calls', () => {
      const x = false;
      spyOn(component, 'viewQuarterlyData').and.callThrough();
      component.viewQuarterlyData(x);
      expect(component.viewQuarterlyData).toHaveBeenCalled();
    })
  });
  describe('viewQuarterlyData', () => {
    it('makes expected calls', () => {
      const x = true;
      spyOn(component, 'viewQuarterlyData').and.callThrough();
      component.viewQuarterlyData(x);
      expect(component.viewQuarterlyData).toHaveBeenCalled();
    })
  });
  describe('isStaticCloumnHeader', () => {
    it('makes expected calls', () => {
      const val = 'test';
      spyOn(component, 'isStaticCloumnHeader').and.callThrough();
      component.isStaticCloumnHeader(val);
      expect(component.isStaticCloumnHeader).toHaveBeenCalled();
    })
  });
  describe('isNumberCheck', () => {
    it('makes expected calls', () => {
      const val = 'test';
      spyOn(component, 'isNumberCheck').and.callThrough();
      component.isNumberCheck(val);
      expect(component.isNumberCheck).toHaveBeenCalled();
    })
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toHaveBeenCalled();
    })
  });
});
