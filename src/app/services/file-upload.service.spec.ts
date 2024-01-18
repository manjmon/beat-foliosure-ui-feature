import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { FileUploadService } from "./file-upload.service";

describe("FileUploadService", () => {
  let service: FileUploadService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FileUploadService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.inject(FileUploadService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler', () =>{
    it('spyOn errorHandler', () =>{
      let error = 'Errors occured'
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(error);
      expect(service.errorHandler).toHaveBeenCalled();
    })
  });
  describe('importBulkData', () =>{
    it('spyOn importBulkData', () =>{
      let formData = 'test';
      let strAPIURL = 'testingurl';
      spyOn(service, 'importBulkData').and.callThrough();
      service.importBulkData(formData, strAPIURL);
      expect(service.importBulkData).toHaveBeenCalled();
    })
  });
  describe('http importBulkData',() => {
    it('http importBulkData', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let formData = 'test';
      let strAPIURL = 'testingurl';
        service.importBulkData(formData, strAPIURL).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + strAPIURL, formData);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('importCashflowDetails', () =>{
    it('spyOn importCashflowDetails', () =>{
      let formData = 'test';
      spyOn(service, 'importCashflowDetails').and.callThrough();
      service.importCashflowDetails(formData);
      expect(service.importCashflowDetails).toHaveBeenCalled();
    })
  });
  describe('http importCashflowDetails',() => {
    it('http importCashflowDetails', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let formData = 'test';
        service.importCashflowDetails(formData).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/cashflow/import", formData);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportTemplates', () =>{
    it('spyOn exportTemplates', () =>{
      let model = 'test';
      spyOn(service, 'exportTemplates').and.callThrough();
      service.exportTemplates(model);
      expect(service.exportTemplates).toHaveBeenCalled();
    })
  });
});