import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { PortfolioCompanyDraftService } from "./portfolio-company-draft.service";

describe("PortfolioCompanyDraftService", () => {
  let service: PortfolioCompanyDraftService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PortfolioCompanyDraftService,
        { provide: 'BASE_URL', useValue: 'http://localhost'},
        { provide: Router, useFactory: routerStub }
      ]
    });
    service = TestBed.get(PortfolioCompanyDraftService);
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
  describe('getPortfolioCompanyDraftList', () =>{
    it('spyOn getPortfolioCompanyDraftList', () =>{
      let event = 'DraftPage';
      spyOn(service, 'getPortfolioCompanyDraftList').and.callThrough();
      service.getPortfolioCompanyDraftList(event);
      expect(service.getPortfolioCompanyDraftList).toHaveBeenCalled();
    })
  });
  describe('httpgetPortfolioCompanyDraftList',() => {
    it('http getPortfolioCompanyDraftList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let event = 'DraftPage';
        service.getPortfolioCompanyDraftList(event).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/workflow/draft_list/get", event);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});