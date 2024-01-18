
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { FileStatusService } from "./file-status.service";

describe("FileStatusService", () => {
  let service: FileStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileStatusService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.inject(FileStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('importBulkData', () =>{
    it('spyOn importBulkData', () =>{
      spyOn(service, 'getFileStatus').and.callThrough();
      service.getFileStatus();
      expect(service.getFileStatus).toHaveBeenCalled();
    })
  });
  describe('http importBulkData',() => {
    it('http importBulkData', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        service.getFileStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(`${service.appUrl}api/fileuploadstatus`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('cancelFile', () =>{
    it('spyOn cancelFile', () =>{
      const id = 2;
      spyOn(service, 'cancelFile').and.callThrough();
      service.cancelFile(id);
      expect(service.cancelFile).toHaveBeenCalled();
    })
  });
  describe('http cancelFile',() => {
    it('http cancelFile', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        const id = 2;
        service.cancelFile(id).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(`${service.appUrl}api/delete-file/`+ id);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('clearALlFileStatus', () =>{
    it('spyOn clearALlFileStatus', () =>{
      spyOn(service, 'clearALlFileStatus').and.callThrough();
      service.clearALlFileStatus();
      expect(service.clearALlFileStatus).toHaveBeenCalled();
    })
  });
  describe('http clearALlFileStatus',() => {
    it('http clearALlFileStatus', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        service.clearALlFileStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(`${service.appUrl}api/filestatus/clearall`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});
