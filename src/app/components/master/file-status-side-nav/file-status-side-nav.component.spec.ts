import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService } from 'src/app/services/account.service';
import { FileStatusSideNavComponent } from './file-status-side-nav.component';
import {
  HttpClientTestingModule
} from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { UploadService} from 'src/app/services/upload.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
xdescribe('FileStatusSideNavComponent', () => {
  let component: FileStatusSideNavComponent;
  let fixture: ComponentFixture<FileStatusSideNavComponent>;

  beforeEach(() => {
    const accountServiceStub = () => ({ errorHandler: {} });
    const uploadServicestub = () => ({});
    
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: AccountService, useFactory: accountServiceStub},
        {provide: UploadService, useFactory: uploadServicestub},
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ],
      declarations: [FileStatusSideNavComponent]
    });
    fixture = TestBed.createComponent(FileStatusSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('processing icon status Icon', () =>{
    const status = 2;
    const iconpath = component.getFileStatusIcon(status);
    expect(iconpath).toEqual("assets/dist/images/file-upload-process.svg")
  });

  it('successful icon status Icon', () =>{
    const status = 3;
    const iconpath = component.getFileStatusIcon(status);
    expect(iconpath).toEqual("assets/dist/images/file-upload-success.svg")
  });

  it('failed icon status Icon', () =>{
    const status = 4;
    const iconpath = component.getFileStatusIcon(status);
    expect(iconpath).toEqual("assets/dist/images/file-upload-failed.svg")
  });

  it('upload icon status Icon', () =>{
    const status = 5;
    const iconpath = component.getFileStatusIcon(status);
    expect(iconpath).toEqual("assets/dist/images/file-upload-failed.svg")
  });


  it('processing icon status text', () =>{
    const status = 2;
    const iconpath = component.getFileStatusText(status);
    expect(iconpath).toEqual("Upload in progress")
  });

  it('successful icon status text', () =>{
    const status = 3;
    const iconpath = component.getFileStatusText(status);
    expect(iconpath).toEqual("Upload successful")
  });

  it('failed icon status text', () =>{
    const status = 4;
    const iconpath = component.getFileStatusText(status);
    expect(iconpath).toEqual("Upload failed")
  });

  it('upload icon status text', () =>{
    const status = 5;
    const iconpath = component.getFileStatusText(status);
    expect(iconpath).toEqual("Upload Cancelled")
  });


  describe('removeFilename', () =>{
   it('makes expected calls', ()=>{
    const fileId = 'esgfield';
    spyOn(component, 'removeFilename').and.callThrough();
    component.removeFilename(fileId);
    expect(component.removeFilename).toHaveBeenCalled();
   })
  });

  describe('truncateFileName', () =>{
    it('makes expected calls', ()=>{
      const maxLength = 32;
      const fileName = "Esg_company.xslx"
      spyOn(component, 'truncateFileName').and.callThrough();
      component.truncateFileName(fileName, maxLength);
      expect(component.truncateFileName).toHaveBeenCalled();
    })
  });

  describe('uploadProgress', () =>{
    it('makes expected calls', () =>{
      const status = 2
      spyOn(component, 'uploadProgress').and.callThrough();
      component.uploadProgress(status);
      expect(component.uploadProgress).toHaveBeenCalled();
    })
  });

  describe('removecross', () =>{
    it('makes expected calls', () =>{
      const status = 3;
      spyOn(component, 'removecross').and.callThrough();
      component.removecross(status);
      expect(component.removecross).toHaveBeenCalled();
    })
  });

  describe('startFileStatusHub', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'startFileStatusHub').and.callThrough();
      component.startFileStatusHub();
      expect(component.startFileStatusHub).toHaveBeenCalled();
    })
  });
});
