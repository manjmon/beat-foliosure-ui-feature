import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonUploadComponent } from './common-upload.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';// Import the ToastrService
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('CommonUploadComponent', () => {
  let component: CommonUploadComponent;
  let fixture: ComponentFixture<CommonUploadComponent>;
  let httpTestingController: HttpTestingController;
  let toastrService: ToastrService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CommonUploadComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, HttpClientModule], // Import HttpClientTestingModule for HTTP testing
      providers: [ToastrService, { provide: 'BASE_URL', useValue: 'https://localhost:4200/' }], // Provide ToastrService
    }).compileComponents();
    fixture = TestBed.createComponent(CommonUploadComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService); // Inject ToastrService
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should handle file selection', () => {
    const files = [
      { name: 'file1.zip', size: 1024 }, // A valid file
      { name: 'file2.zip', size: 2048 }, // A file with size greater than max allowed
    ];
    component.onSelect(files);
    expect(component.files).toEqual(files);
    expect(component.uploadedFiles).toEqual([]);
    expect(component.errorUploadDetails).toEqual([]);
    expect(component.messageClass).toEqual('bulkMessage');
    expect(component.safeHtml).toBeUndefined();
    expect(component.uploadFilePlaceholder).toEqual('file1.zip');
    expect(component.browseIcon).toBe(false);
  });
  it('should handle file selection with an invalid file size', () => {
    const files = [{ name: 'largefile.zip', size: 26533888 }]; // A file with size greater than max allowed
    component.onSelect(files);
    expect(component.files).toEqual([]);
    expect(component.uploadedFiles).toEqual([]);
    expect(component.messageClass).toEqual('errorMessage');
    expect(component.safeHtml).toEqual('File size is greater than 20 MB');
    expect(component.uploadFilePlaceholder).toEqual(component.defaultPlaceholder);
    expect(component.browseIcon).toBe(true);
  });
  it('should emit onClosePopUpClick event when onClose is called', () => {
    spyOn(component.onClosePopUpClick, 'emit');
    component.onClose();
    expect(component.onClosePopUpClick.emit).toHaveBeenCalledWith(false);
  });
  it('should handle deleting selected files', () => {
    component.onSelect([{ name: 'file1.zip', size: 1024 }]); // Select a file first
    component.deleteIconClick();
    expect(component.files).toEqual([]);
    expect(component.uploadFilePlaceholder).toEqual(component.defaultPlaceholder);
    expect(component.browseIcon).toBe(true);
    expect(component.safeHtml).toBe('');
  });
  // it('should handle successful file upload', () => {
  //   const files = [{ name: 'file1.zip', size: 1024 }]; // A valid file
  //   component.onSelect(files);
  //   const mockResponse = { code: 'ok', message: 'File uploaded successfully' };
  //   component.onUpload();
  //   const req = httpTestingController.expectOne('api/excel-plugin/upload');
  //   expect(req.request.method).toEqual('POST');
  //   req.flush(mockResponse);
  //   expect(component.onClosePopUpClick).toHaveBeenCalledWith(false);
  // });
  // it('should handle unsuccessful file upload', () => {
  //   const files = [{ name: 'file1.zip', size: 1024 }]; // A valid file
  //   component.onSelect(files);
  //   component.onUpload();
  //   const req = httpTestingController.expectOne('api/excel-plugin/upload');
  //   expect(req.request.method).toEqual('POST');
  //   expect(component.deleteIconClick).toHaveBeenCalled();
  // });
  afterEach(() => {
    httpTestingController.verify();
  });
});