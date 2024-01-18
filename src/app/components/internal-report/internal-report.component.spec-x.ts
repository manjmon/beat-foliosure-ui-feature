import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { InternalReportService } from '../../services/internal-report.service';
import { InternalReportComponent } from './internal-report.component';
import { GetTemplateUnits, ReportTemplatePreferenceConstants } from '../../common/constants';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InternalReportCompanyFilter } from './filters/company-filter-pipe';
import { InternalReportModuleFilter } from './filters/module-filter-pipe';
import { TemplateFilter } from './filters/templateFilter.pipe';

describe('InternalReportComponent', () => {
  let component: InternalReportComponent;
  let fixture: ComponentFixture<InternalReportComponent>;
  let toasterServiceStub: Partial<ToastrService>;
  let internalReportServiceStub: Partial<InternalReportService>;

  beforeEach(() => {
    toasterServiceStub = {
      overlayContainer: null
    };

    internalReportServiceStub = {
      getAllConfig: () => of({})
    };

    TestBed.configureTestingModule({
      declarations: [
        InternalReportComponent,
        InternalReportCompanyFilter,
        InternalReportModuleFilter,
        TemplateFilter
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[  FormsModule,
        ReactiveFormsModule,
        PrimeNgModule,
        MaterialModule,
        SharedComponentModule,
        CommonModule,
        ScrollingModule],
      providers: [
        FormBuilder,
        DatePipe,
        { provide: ToastrService, useValue: toasterServiceStub },
        { provide: InternalReportService, useValue: internalReportServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InternalReportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.myControl).toBeInstanceOf(FormControl);
    expect(component.isCompanyPopup).toBeFalse();
    expect(component.selectConfirmCompany).toBeNull();
    expect(component.multiselect).toBeUndefined();
    expect(component.selectedRadio).toEqual('');
    expect(component.title).toEqual('Save as');
    expect(component.isLoader).toBeFalse();
    expect(component.selectedItem).toBeNull();
    expect(component.templateList).toEqual([]);
    expect(component.selectedAction).toBeNull();
    expect(component.isAction).toBeFalse();
    expect(component.actionList).toEqual([]);
    expect(component.selectedCopyToCompanyList).toEqual([]);
    expect(component.portfolioCompanyList).toEqual([]);
    expect(component.companyList).toEqual([]);
    expect(component.filteredCompanyList).toEqual([]);
    expect(component.company).toBeNull();
    expect(component.selectedCompany).toBeUndefined();
    expect(component.viewport).toBeUndefined();
    expect(component.headers).toEqual([
      { field: 'checkbox', header: 'checkbox' },
      { header: 'Line Item', field: 'KPI' },
      { header: 'Section', field: 'moduleName' }
    ]);
    expect(component.kpiMappingList).toEqual([]);
    expect(component.isCopyToAll).toBeFalse();
    expect(component.preferenceList).toEqual([]);
    expect(component.uiuxMenu).toBeUndefined();
    expect(component.menuTrigger).toBeUndefined();
    expect(component.selectedPreference).toBeNull();
    expect(component.fundList).toEqual([]);
    expect(component.moduleList).toEqual([]);
    expect(component.dataTypeList).toEqual([]);
    expect(component.periodTypeList).toEqual([]);
    expect(component.periodList).toEqual([]);
    expect(component.templatePreferenceList).toEqual([]);
    expect(component.selectedFund).toEqual([]);
    expect(component.selectedDataType).toEqual([]);
    expect(component.selectedCalculation).toEqual([]);
    expect(component.selectedPeriodType).toEqual([]);
    expect(component.selectedPeriod).toBeNull();
    expect(component.selectedExcelTemplate).toBeNull();
    expect(component.selectedModule).toEqual([]);
    expect(component.calculationList).toEqual([]);
    expect(component.configurationItem).toBeNull();
    expect(component.checkAll).toBeFalse();
    expect(component.isPopup).toBeFalse();
    expect(component.disableRenameConfirmButton).toBeTrue();
    expect(component.modalTitle).toEqual('');
    expect(component.isExist).toBeFalse();
    expect(component.isTemplateExist).toBeFalse();
    expect(component.defaultTemplate).toEqual('New Template');
    expect(component.savePopUp).toBeFalse();
    expect(component.disableConfirmSave).toBeTrue();
    expect(component.saveBtn).toBeTrue();
    expect(component.disableBtn).toBeFalse();
    expect(component.templateName).toEqual('');
    expect(component.configurationModel).toBeNull();
    expect(component.companyFilterArgs).toBeNull();
    expect(component.dragNodeExpandOverArea).toBeNull();
    expect(component.moduleFilterArgs).toBeNull();
    expect(component.renameTemplateValue).toBeNull();
    expect(component.newTemplateName).toBeNull();
    expect(component.table).toBeUndefined();
    expect(component.checkAllBox).toBeUndefined();
    expect(component.toastContainer).toBeUndefined();
    expect(component.isMapBtn).toBeTrue();
    expect(component.originalKpiMappingList).toBeNull();
    expect(component.groupForm).toBeInstanceOf(FormBuilder);
    expect(component.originalCompanyList).toEqual([]);
    expect(component.isApply).toBeFalse();
    expect(component.originalPreferences).toEqual([]);
    expect(component.yearRange).toEqual('2000:2050');
    expect(component.dateRange).toBeUndefined();
    expect(component.startPeriod).toEqual('');
    expect(component.endPeriod).toEqual('');
    expect(component.selectedUnit).toBeNull();
    expect(component.unitList).toEqual(GetTemplateUnits());
    expect(component.selectedGroup).toBeFalse();
    expect(component.dropNode).toEqual([]);
    expect(component.originalKpiMappingListObject).toBeNull();
    expect(component.dropNodeType).toBeUndefined();
    expect(component.selectAllIntermidiateStatus).toBeFalse();
  });

  it('should call getAll method on ngOnInit', () => {
    spyOn(component, 'getAll');
    component.ngOnInit();
    expect(component.getAll).toHaveBeenCalled();
  });

  it('should call getConfiguration, getPreference, and setTemplateSetting methods on getAll', () => {
    spyOn(component, 'getConfiguration');
    spyOn(component, 'getPreference');
    spyOn(component, 'setTemplateSetting');
    component.getAll();
    expect(component.getConfiguration).toHaveBeenCalled();
    expect(component.getPreference).toHaveBeenCalled();
    expect(component.setTemplateSetting).toHaveBeenCalled();
  });

  it('should call getAllConfig method on getAllConfig', () => {
    const internalServiceStub: InternalReportService = fixture.debugElement.injector.get(
        InternalReportService
      );
    spyOn(internalServiceStub, 'getAllConfig').and.returnValue(of({}));
    component.getAllConfig();
    expect(internalServiceStub.getAllConfig).toHaveBeenCalled();
  });

  // Add more tests for other methods and functionalities of the component

});