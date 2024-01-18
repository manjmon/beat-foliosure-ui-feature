import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { OidcAuthService } from './../../../../../services/oidc-auth.service';
import { FormBuilder, ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AddUsersComponent } from './add-users.component';

describe('AddUsersComponent', () => {
  let component: AddUsersComponent;
  let fixture: ComponentFixture<AddUsersComponent>;

  beforeEach(() => {
    const oidcAuthServiceStub = () => ({
      addUsersFromBeatIds: userModel => ({ subscribe: f => f({}) }),
      updateUsersFromBeatIds: object => ({ subscribe: f => f({}) }),
      getUsersFromBeatIds: () => ({ subscribe: f => f({}) }),
      isUserExistFromBeatIds: string => ({ subscribe: f => f({}) }),
      setActiveUserInBeatIds: string => ({ subscribe: f => f({}) }),
      setDeActiveUserInBeatIds: string => ({ subscribe: f => f({}) })
    });
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const formBuilderStub = () => ({ group: object => ({}) });
    const accountServiceStub = () => ({
      addUser: model => ({ subscribe: f => f({}) }),
      updateUser: model => ({ subscribe: f => f({}) })
    });
    const fileUploadServiceStub = () => ({
      exportTemplates: object => ({ subscribe: f => f({}) }),
      importBulkData: (formData, strAPIURL) => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getCountryList: () => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({})
    });
    const domSanitizerStub = () => ({
      bypassSecurityTrustHtml: message => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (message, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddUsersComponent],
      providers: [
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FileUploadService, useFactory: fileUploadServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddUsersComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`defaultPlaceholder has default value`, () => {
    expect(component.defaultPlaceholder).toEqual(`Browse`);
  });

  it(`uploadFilePlaceholder has default value`, () => {
    expect(component.uploadFilePlaceholder).toEqual(component.defaultPlaceholder);
  });

  it(`browseicon has default value`, () => {
    expect(component.browseicon).toEqual(true);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`uploadedFiles has default value`, () => {
    expect(component.uploadedFiles).toEqual([]);
  });

  it(`messages has default value`, () => {
    expect(component.messages).toEqual([]);
  });

  it(`FileProgresStatus has default value`, () => {
    expect(component.FileProgresStatus).toEqual(`Cancel File Progress`);
  });

  it(`value has default value`, () => {
    expect(component.value).toEqual(0);
  });

  it(`cancel has default value`, () => {
    expect(component.cancel).toEqual(false);
  });

  it(`ProgressCancel has default value`, () => {
    expect(component.ProgressCancel).toEqual(true);
  });

  it(`submitted has default value`, () => {
    expect(component.submitted).toEqual(false);
  });

  it(`countryList has default value`, () => {
    expect(component.countryList).toEqual([]);
  });

  it(`groupList has default value`, () => {
    expect(component.groupList).toEqual([]);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`userStatus has default value`, () => {
    expect(component.userStatus).toEqual(true);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`strModuleType has default value`, () => {
    expect(component.strModuleType).toEqual(`UserList`);
  });

  it(`interval has default value`, () => {
    expect(component.interval).toEqual(0);
  });

  it(`messageClass has default value`, () => {
    expect(component.messageClass).toEqual(`bulkMessage`);
  });

  it(`userListIds has default value`, () => {
    expect(component.userListIds).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(component, 'getCountries').and.callThrough();
      spyOn(component, 'GetUsersFromBeatIds').and.callThrough();
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(component.getCountries).toHaveBeenCalled();
      expect(component.GetUsersFromBeatIds).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('makes expected calls', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(component, 'deleteiconclick').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.onReset();
      expect(component.deleteiconclick).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });

  describe('getCountries', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'getCountryList').and.callThrough();
      component.getCountries();
      expect(miscellaneousServiceStub.getCountryList).toHaveBeenCalled();
    });
  });

  describe('downloadTemplate', () => {
    it('makes expected calls', () => {
      const fileUploadServiceStub: FileUploadService = fixture.debugElement.injector.get(
        FileUploadService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(fileUploadServiceStub, 'exportTemplates').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.downloadTemplate();
      expect(fileUploadServiceStub.exportTemplates).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('updateUserInBeatIds', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'updateUsersFromBeatIds').and.callThrough();
      component.updateUserInBeatIds();
      expect(oidcAuthServiceStub.updateUsersFromBeatIds).toHaveBeenCalled();
    });
  });

  describe('GetUsersFromBeatIds', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'getUsersFromBeatIds').and.callThrough();
      component.GetUsersFromBeatIds();
      expect(oidcAuthServiceStub.getUsersFromBeatIds).toHaveBeenCalled();
    });
  });

  describe('isExistUsersInBeatIds', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'isUserExistFromBeatIds').and.callThrough();
      component.isExistUsersInBeatIds();
      expect(oidcAuthServiceStub.isUserExistFromBeatIds).toHaveBeenCalled();
    });
  });

  describe('setActiveUserInBeatIds', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'setActiveUserInBeatIds').and.callThrough();
      component.setActiveUserInBeatIds();
      expect(oidcAuthServiceStub.setActiveUserInBeatIds).toHaveBeenCalled();
    });
  });

  describe('setInActiveUserInBeatIds', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(oidcAuthServiceStub, 'setDeActiveUserInBeatIds').and.callThrough();
      component.setInActiveUserInBeatIds();
      expect(oidcAuthServiceStub.setDeActiveUserInBeatIds).toHaveBeenCalled();
    });
  });
});
