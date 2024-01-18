import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { NgForm ,FormsModule} from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { HelperService } from '../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data-service.service';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { AppSettingService } from '../../services/appsettings.service';
import { CompanyPageSectionConstants,CompanyInformationConstants } from '../../common/constants';
import { AddPortfolioCompanyComponent } from './add-portfolioCompany.component';
import { MatMenuModule } from '@angular/material/menu';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { of } from 'rxjs';

describe('AddPortfolioCompanyComponent', () => {
  let component: AddPortfolioCompanyComponent;
  let fixture: ComponentFixture<AddPortfolioCompanyComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({
      markForCheck: () => ({}),
      detectChanges: () => ({})
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: array => ({}) });
    const confirmationServiceStub = () => ({ confirm: object => ({}) });
    const accountServiceStub = () => ({});
    const firmServiceStub = () => ({
      getMasterFirmModel: () => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      getSideBarWidth: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getSubSectorListBySectorId: arg => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      getMasterPCModel: () => ({ subscribe: f => of({}) }),
      uploadlogos: (formData, string) => ({ subscribe: f => f({}) }),
      impactsaveuploadlogs: path => ({ subscribe: f => f({}) }),
      getPortfolioCompanyDraftById: (id, workflowId) => ({
        subscribe: f => f({})
      }),
      addPortfolioCompany: model => ({ subscribe: f => f({}) }),
      updatePortfolioCompany: model => ({ subscribe: f => f({}) }),
      onDeleteTempFiles: path => ({ subscribe: f => f({}) })
    });
    const helperServiceStub = () => ({ getIconFromFileName: filename => ({}) });
    const toastrServiceStub = () => ({
      error: (string, string1, object) => ({}),
      success: (message, string, object) => ({})
    });
    const dataServiceStub = () => ({
      currentWorkflowMappingId: { subscribe: f => f({}) },
      currentWorkflowRequest: { subscribe: f => f({}) }
    });
    const pageConfigurationServiceStub = () => ({
      getPageConfigSettingById : (id, workflowId) => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}),
    setGetConfig: () => ({})
   });
    TestBed.configureTestingModule({
      imports: [FormsModule,MatMenuModule,PrimeNgModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddPortfolioCompanyComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: HelperService, useFactory: helperServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: DataService, useFactory: dataServiceStub },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: AppSettingService, useFactory: appSettingServiceStub }
      ]
    });
    spyOn(AddPortfolioCompanyComponent.prototype, 'getWorkflowDetails');
    spyOn(AddPortfolioCompanyComponent.prototype, 'getMasterFirmModel');
    fixture = TestBed.createComponent(AddPortfolioCompanyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for files', () => {
    expect(component.files).toEqual([]);
  });

  it('should have default value for browseicon', () => {
    expect(component.browseicon).toBeTrue();
  });

  it('should have default value for deleticon', () => {
    expect(component.deleticon).toBeFalse();
  });

  it('should have default value for isexits', () => {
    expect(component.isexits).toBeFalse();
  });

  it('should have default values for uploadedlogos', () => {
    expect(component.uploadedlogos).toEqual([]);
  });

  it('should have default values for uploadedlogostemp', () => {
    expect(component.uploadedlogostemp).toEqual([]);
  });

  it('should have default values for msgs', () => {
    expect(component.msgs).toEqual([]);
  });

  it('should have default value for browsetext', () => {
    expect(component.browsetext).toEqual('Upload Logo');
  });

  it('should have default value for title', () => {
    expect(component.title).toEqual('Create');
  });

  it('should have default value for resetText', () => {
    expect(component.resetText).toEqual('Reset');
  });

  it('should have default value for pcStatus', () => {
    expect(component.pcStatus).toBeTrue();
  });

  it('should have default value for isGeographic', () => {
    expect(component.isGeographic).toBeFalse();
  });

  it('should have default value for isActive', () => {
    expect(component.isActive).toEqual('active');
  });

  it('should have default value for isInvestment', () => {
    expect(component.isInvestment).toBeFalse();
  });

  it('should have default value for fixedbottomHeight', () => {
    expect(component.fixedbottomHeight).toEqual(0);
  });

  it('should have default values for months', () => {
    expect(component.months).toEqual(component.months);
  });

  it('should have default value for statusOptions', () => {
    expect(component.statusOptions).toEqual([
      { value: 'Private', text: 'Private' },
      { value: 'Public', text: 'Public' }
    ]);
  });

  it('should have default value for loading', () => {
    expect(component.loading).toBeFalse();
  });

  it('should have default value for tabList', () => {
    expect(component.tabList).toEqual([]);
  });

  it('should have default value for workflowRequestId', () => {
    expect(component.workflowRequestId).toEqual(0);
  });

  it('should have default value for workflowMappingId', () => {
    expect(component.workflowMappingId).toEqual(0);
  });

  it('should have default value for isFileUpload', () => {
    expect(component.isFileUpload).toBeFalse();
  });

  it('should have default value for isWorkflow', () => {
    expect(component.isWorkflow).toBeFalse();
  });

  it('should have default value for locationFieldList', () => {
    expect(component.locationFieldList).toEqual([]);
  });

  it('should have default value for companyPageSectionConstants', () => {
    expect(component.companyPageSectionConstants).toEqual(
      CompanyPageSectionConstants
    );
  });

  it('should have default value for companyInformationConstants', () => {
    expect(component.companyInformationConstants).toEqual(
      CompanyInformationConstants
    );
  });

  it('should have default value for employeeEditMode', () => {
    expect(component.employeeEditMode).toBeFalse();
  });

  it('should have default value for subSectorLoading', () => {
    expect(component.subSectorLoading).toBeFalse();
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

  describe('getMasterFirmModel', () => {
    it('makes expected calls', () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      spyOn(firmServiceStub, 'getMasterFirmModel').and.callThrough();
      (<jasmine.Spy>component.getMasterFirmModel).and.callThrough();
      component.getMasterFirmModel();
      expect(firmServiceStub.getMasterFirmModel).toHaveBeenCalled();
    });
  });

  describe('saveImage', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        'impactsaveuploadlogs'
      ).and.callThrough();
      component.saveImage();
      expect(
        portfolioCompanyServiceStub.impactsaveuploadlogs
      ).toHaveBeenCalled();
    });
  });

  describe('onSectorChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetSubSectorListBySectorId').and.callThrough();
      component.onSectorChange();
      expect(component.GetSubSectorListBySectorId).toHaveBeenCalled();
    });
  });
  describe('addEmployees', () => {
    it('should call updateEmployee, clearEmployees, and toastrService.error', () => {
      const ngFormStub: NgForm = {} as NgForm;
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'updateEmployee').and.callThrough();
      spyOn(component, 'GetSubSectorListBySectorId').and.callThrough();
      spyOn(component, 'clearEmployees').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.addEmployees(ngFormStub);
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('updateEmployee', () => {
    it('should call clearEmployees, changeDetectorRef.detectChanges, and toastrService.error', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const ngFormStub: NgForm = {} as NgForm;
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.updateEmployee(ngFormStub)
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });
  describe('getSideNavWidth', () => {
    it('should call miscellaneousService.getSideBarWidth', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getSideBarWidth').and.callThrough();
      component.getSideNavWidth();
      expect(miscellaneousServiceStub.getSideBarWidth).toHaveBeenCalled();
    });
  });

 
  describe('removeLocation', () => {
    it('should remove the location from geographicLocations', () => {
      // Arrange
      const locationId = 123;
      const confirmationServiceStub: ConfirmationService = fixture.debugElement.injector.get(
        ConfirmationService
      );
      spyOn(confirmationServiceStub, 'confirm').and.callFake((options: any) => {
        options.accept(); // Simulate user accepting the confirmation
        return confirmationServiceStub; // Return confirmation service
      });

      // Act
      component.removeLocation(locationId);

      // Assert
      expect(component.model.geographicLocations).not.toContain(
        jasmine.objectContaining({ uniquelocationID: locationId })
      );
    });
  });
  it('should add or update custom portfolio group list', () => {
    // Arrange
    const data = [
      { fieldId: 1, fieldName: 'Field 1' },
      { fieldId: 2, fieldName: 'Field 2' }
    ];
    const initialCustomPortfolioGroupList = [
      { fieldId: 1, fieldName: 'Field 1' },
      { fieldId: 3, fieldName: 'Field 3' }
    ];
    component.customPortfolioGroupList = initialCustomPortfolioGroupList;
  
    // Act
    component.CustomListAddOrUpdate(data);
  
    // Assert
    expect(component.customPortfolioGroupList[0].fieldId).toEqual(3);
  });
});
