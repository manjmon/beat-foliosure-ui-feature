import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { WorkflowBulkUploadComponent } from './workflow-bulk-upload.component';

describe('WorkflowBulkUploadComponent', () => {
  let component: WorkflowBulkUploadComponent;
  let fixture: ComponentFixture<WorkflowBulkUploadComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const domSanitizerStub = () => ({
      bypassSecurityTrustHtml: message => ({})
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({
      error: (string, string1, object) => ({})
    });
    const fileUploadServiceStub = () => ({
      exportTemplates: object => ({ subscribe: f => f({}) }),
      importBulkData: (formData, strAPIURL) => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowBulkUploadComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: FileUploadService, useFactory: fileUploadServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowBulkUploadComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isUploaded has default value`, () => {
    expect(component.isUploaded).toEqual(false);
  });

  it(`defaultPlaceholder has default value`, () => {
    expect(component.defaultPlaceholder).toEqual(`Browse`);
  });

  it(`uploadFilePlaceholder has default value`, () => {
    expect(component.uploadFilePlaceholder).toEqual(`Browse`);
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

  it(`messageClass has default value`, () => {
    expect(component.messageClass).toEqual(`bulkMessage`);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`interval has default value`, () => {
    expect(component.interval).toEqual(0);
  });

  it(`workflowMappingId has default value`, () => {
    expect(component.workflowMappingId).toEqual(0);
  });

  describe('onReset', () => {
    it('makes expected calls', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(component, 'deleteIconClick').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.onReset();
      expect(component.deleteIconClick).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });

  describe('downloadTemplate', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const fileUploadServiceStub: FileUploadService = fixture.debugElement.injector.get(
        FileUploadService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(fileUploadServiceStub, 'exportTemplates').and.callThrough();
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      component.downloadTemplate();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(fileUploadServiceStub.exportTemplates).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe('saveFile', () => {
    it('makes expected calls', () => {
      spyOn(component, 'onUpload').and.callThrough();
      component.saveFile();
      expect(component.onUpload).toHaveBeenCalled();
    });
  });
});
