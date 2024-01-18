import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { PipelineService } from "./pipeline.service";

describe("PipelineService", () => {
  let service: PipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PipelineService,
        { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(PipelineService);
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
  describe('createPipeline', () =>{
    it('spyOn createPipeline', () =>{
      let piepline = 'Profitpipe';
      spyOn(service, 'createPipeline').and.callThrough();
      service.createPipeline(piepline);
      expect(service.createPipeline).toHaveBeenCalled();
    })
  });
  describe('http createPipeline',() => {
    it('http createPipeline', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let piepline = 'Profitpipe'
        service.createPipeline(piepline).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/add", piepline);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updatePipeline', () =>{
    it('spyOn updatePipeline', () =>{
      let piepline = 'Profitpipe';
      spyOn(service, 'updatePipeline').and.callThrough();
      service.updatePipeline(piepline);
      expect(service.updatePipeline).toHaveBeenCalled();
    })
  });
  describe('httpupdatePipeline',() => {
    it('http updatePipeline', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let piepline = 'Profitpipe'
        service.createPipeline(piepline).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/add", piepline);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPipelineById', () =>{
    it('spyOn getPipelineById', () =>{
      let pieplineId = '5799adcsh66';
      spyOn(service, 'getPipelineById').and.callThrough();
      service.getPipelineById(pieplineId);
      expect(service.getPipelineById).toHaveBeenCalled();
    })
  });
  describe('http getPipelineById',() => {
    it('http getPipelineById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let pipelineId = '5799adcsh66';
        service.getPipelineById(pipelineId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/getbyid", pipelineId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPipelineList', () =>{
    it('spyOn getPipelineList', () =>{
      let filter = 'profitandloss';
      spyOn(service, 'getPipelineList').and.callThrough();
      service.getPipelineList(filter);
      expect(service.getPipelineList).toHaveBeenCalled();
    })
  });
  describe('http getPipelineList',() => {
    it('http getPipelineList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let filter = 'profitandloss';
        service.getPipelineList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportPipelineList', () =>{
    it('spyOn exportPipelineList', () =>{
      let filter = 'profitandloss';
      spyOn(service, 'exportPipelineList').and.callThrough();
      service.exportPipelineList(filter);
      expect(service.exportPipelineList).toHaveBeenCalled();
    })
  });
  describe('getMasterData', () =>{
    it('spyOn getMasterData', () =>{
      spyOn(service, 'getMasterData').and.callThrough();
      service.getMasterData();
      expect(service.getMasterData).toHaveBeenCalled();
    })
  });
  describe('http getMasterData',() => {
    it('http getMasterData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        service.getMasterData().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/getmaster");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundListByFirmnId', () =>{
    it('spyOn getFundListByFirmnId', () =>{
      let firmId = '464647adfafa';
      spyOn(service, 'getFundListByFirmnId').and.callThrough();
      service.getFundListByFirmnId(firmId);
      expect(service.getFundListByFirmnId).toHaveBeenCalled();
    })
  });
  describe('http getFundListByFirmnId',() => {
    it('http getFundListByFirmnId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let firmId = '464647adfafa';
        service.getFundListByFirmnId(firmId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/getfundbyfirm", {
          value: "" + firmId + "",
        });
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPipeLineDashBoard', () =>{
    it('spyOn getPipeLineDashBoard', () =>{
      spyOn(service, 'getPipeLineDashBoard').and.callThrough();
      service.getPipeLineDashBoard();
      expect(service.getPipeLineDashBoard).toHaveBeenCalled();
    })
  });
  describe('http getPipeLineDashBoard',() => {
    it('http getPipeLineDashBoard', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getPipeLineDashBoard().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pipeline/dashboardGraphs");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});