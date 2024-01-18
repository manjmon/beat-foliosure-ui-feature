import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { FootNoteService } from "./foot-note.service";

describe("FootNoteService", () => {
  let service: FootNoteService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FootNoteService, { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(FootNoteService);
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
  describe('getFootNote', () =>{
    it('spyOn getFootNote', () =>{
      let moduleId = 21;
      let companyId = 22;
      spyOn(service, 'getFootNote').and.callThrough();
      service.getFootNote(moduleId, companyId);
      expect(service.getFootNote).toHaveBeenCalled();
    })
  });
  describe('http getFootNote',() => {
    it('http getFootNote', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let moduleId = 21;
        let companyId = 22;
        service.getFootNote(moduleId, companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/get/foot-note/" + moduleId+"/"+companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('addFootNote', () =>{
    it('spyOn addFootNote', () =>{
      let footNote = 'test';
      spyOn(service, 'addFootNote').and.callThrough();
      service.addFootNote(footNote);
      expect(service.addFootNote).toHaveBeenCalled();
    })
  });
  describe('http addFootNote',() => {
    it('http addFootNote', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let footNote = 'test';
        service.addFootNote(footNote).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/add/foot-note",footNote);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateFootNote', () =>{
    it('spyOn updateFootNote', () =>{
      let footNote = 'test';
      spyOn(service, 'updateFootNote').and.callThrough();
      service.updateFootNote(footNote);
      expect(service.updateFootNote).toHaveBeenCalled();
    })
  });
  describe('http updateFootNote',() => {
    it('http updateFootNote', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let footNote = 'test';
        service.updateFootNote(footNote).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/update/foot-note",footNote);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});