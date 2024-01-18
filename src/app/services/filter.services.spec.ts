import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { FilterService } from "./filter.services";

describe("FilterService", () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilterService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(FilterService);
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
  describe('getFilters', () =>{
    it('spyOn getFilters', () =>{
      spyOn(service, 'getFilters').and.callThrough();
      service.getFilters();
      expect(service.getFilters).toHaveBeenCalled();
    })
  });
  describe('http getFilters',() => {
    it('http getFilters', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getFilters().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + `api/report/filters`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFilter', () =>{
    it('spyOn getFilter', () =>{
      let filterId = 12;
      spyOn(service, 'getFilter').and.callThrough();
      service.getFilter(filterId);
      expect(service.getFilter).toHaveBeenCalled();
    })
  });
  describe('http getFilter',() => {
    it('http getFilter', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filterId = 12;
        service.getFilter(filterId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +`api/report/filters/${filterId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('SaveFilter', () =>{
    it('spyOn SaveFilter', () =>{
      let filter = 'test';
      spyOn(service, 'SaveFilter').and.callThrough();
      service.SaveFilter(filter);
      expect(service.SaveFilter).toHaveBeenCalled();
    })
  });
  describe('http SaveFilter',() => {
    it('http SaveFilter', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.SaveFilter(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + `api/report/filters`, filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('UpdateFilter', () =>{
    it('spyOn UpdateFilter', () =>{
      let filter = 'test';
      spyOn(service, 'UpdateFilter').and.callThrough();
      service.UpdateFilter(filter);
      expect(service.UpdateFilter).toHaveBeenCalled();
    })
  });
  describe('DeleteFilter', () =>{
    it('spyOn DeleteFilter', () =>{
      let userReportId = 33;
      spyOn(service, 'DeleteFilter').and.callThrough();
      service.DeleteFilter(userReportId);
      expect(service.DeleteFilter).toHaveBeenCalled();
    })
  });
  describe('http DeleteFilter',() => {
    it('http DeleteFilter', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let userReportId = 33;
        service.DeleteFilter(userReportId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + `api/report/filters/${userReportId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});