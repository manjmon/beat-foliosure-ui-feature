import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { DocumentService } from "./document.service";

describe("DocumentService", () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.inject(DocumentService);
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
  describe('getAllDocuments', () =>{
    it('spyOn getAllDocuments', () =>{
      let filter = 'test';
      spyOn(service, 'getAllDocuments').and.callThrough();
      service.getAllDocuments(filter);
      expect(service.getAllDocuments).toHaveBeenCalled();
    })
  });
  describe('http getAllDocuments',() => {
    it('http getAllDocuments', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getAllDocuments(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/documents/GetAllDocuments" , filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFolders', () =>{
    it('spyOn getFolders', () =>{
      spyOn(service, 'getFolders').and.callThrough();
      service.getFolders();
      expect(service.getFolders).toHaveBeenCalled();
    })
  });
  describe('http getFolders',() => {
    it('http getFolders', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getFolders().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/folder/types");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getAllDocumentTypes', () =>{
    it('spyOn getAllDocumentTypes', () =>{
      let filter = 'test';
      spyOn(service, 'getAllDocumentTypes').and.callThrough();
      service.getAllDocumentTypes(filter);
      expect(service.getAllDocumentTypes).toHaveBeenCalled();
    })
  });
  describe('http getAllDocumentTypes',() => {
    it('http getAllDocumentTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getAllDocumentTypes(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/document/types?DocumentTypeId=" + filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('AddDocument', () =>{
    it('spyOn AddDocument', () =>{
      let document = 'test';
      spyOn(service, 'AddDocument').and.callThrough();
      service.AddDocument(document);
      expect(service.AddDocument).toHaveBeenCalled();
    })
  });
  describe('http AddDocument',() => {
    it('http AddDocument', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let Document = 'test';
        service.AddDocument(Document).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/documents", Document);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('VaidateDocExists', () =>{
    it('spyOn VaidateDocExists', () =>{
      let filter = 'test';
      spyOn(service, 'VaidateDocExists').and.callThrough();
      service.VaidateDocExists(filter);
      expect(service.VaidateDocExists).toHaveBeenCalled();
    })
  });
  describe('http VaidateDocExists',() => {
    it('http VaidateDocExists', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.VaidateDocExists(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/vaidateDocExists", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('VaidateBulkDocExists', () =>{
    it('spyOn VaidateBulkDocExists', () =>{
      let filter = 'test';
      spyOn(service, 'VaidateBulkDocExists').and.callThrough();
      service.VaidateBulkDocExists(filter);
      expect(service.VaidateBulkDocExists).toHaveBeenCalled();
    })
  });
  describe('http VaidateBulkDocExists',() => {
    it('http VaidateBulkDocExists', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.VaidateBulkDocExists(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/vaidateBulkDocExists", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('UploadFile', () =>{
    it('spyOn UploadFile', () =>{
      let file = 'test';
      spyOn(service, 'UploadFile').and.callThrough();
      service.UploadFile(file);
      expect(service.UploadFile).toHaveBeenCalled();
    })
  });
  describe('http UploadFile',() => {
    it('http UploadFile', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let file = 'test';
        service.UploadFile(file).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/file", file);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('RequestDownload', () =>{
    it('spyOn RequestDownload', () =>{
      let fundDetail = 'test';
      spyOn(service, 'RequestDownload').and.callThrough();
      service.RequestDownload(fundDetail);
      expect(service.RequestDownload).toHaveBeenCalled();
    })
  });
  describe('Suggest', () =>{
    it('spyOn Suggest', () =>{
      let fundDetail = 'test';
      spyOn(service, 'Suggest').and.callThrough();
      service.Suggest(fundDetail);
      expect(service.Suggest).toHaveBeenCalled();
    })
  });
  describe('http Suggest',() => {
    it('http Suggest', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let term = 'test';
        service.Suggest(term).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/suggest?term=" + term);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('DeleteFiles', () =>{
    it('spyOn DeleteFiles', () =>{
      let fundDetail = 'test';
      spyOn(service, 'DeleteFiles').and.callThrough();
      service.DeleteFiles(fundDetail);
      expect(service.DeleteFiles).toHaveBeenCalled();
    })
  });
  describe('http DeleteFiles',() => {
    it('http DeleteFiles', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundDetail = 'test';
        service.DeleteFiles(fundDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/delete", fundDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('MoveToRecycleBin', () =>{
    it('spyOn MoveToRecycleBin', () =>{
      let fundDetail = 'test';
      spyOn(service, 'MoveToRecycleBin').and.callThrough();
      service.MoveToRecycleBin(fundDetail, false);
      expect(service.MoveToRecycleBin).toHaveBeenCalled();
    })
  });
  describe('RestoreDocuments', () =>{
    it('spyOn RestoreDocuments', () =>{
      let documents = 'test';
      spyOn(service, 'RestoreDocuments').and.callThrough();
      service.RestoreDocuments(documents);
      expect(service.RestoreDocuments).toHaveBeenCalled();
    })
  });
  describe('getDocumentByID', () =>{
    it('spyOn getDocumentByID', () =>{
      let docid = 'test';
      spyOn(service, 'getDocumentByID').and.callThrough();
      service.getDocumentByID(docid);
      expect(service.getDocumentByID).toHaveBeenCalled();
    })
  });
  describe('http getDocumentByID',() => {
    it('http getDocumentByID', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let docid = 'test';
        service.getDocumentByID(docid).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/document/" + docid);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('UpdatelDocument', () =>{
    it('spyOn UpdatelDocument', () =>{
      let id = 'testing';
      let Document = 'test';
      spyOn(service, 'UpdatelDocument').and.callThrough();
      service.UpdatelDocument(id, Document);
      expect(service.UpdatelDocument).toHaveBeenCalled();
    })
  });
  describe('http UpdatelDocument',() => {
    it('http UpdatelDocument', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let id = 23;
        let Document = 'test';
        service.UpdatelDocument(id, Document).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/" + id, Document);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetAllFilterCategories', () =>{
    it('spyOn GetAllFilterCategories', () =>{
      spyOn(service, 'GetAllFilterCategories').and.callThrough();
      service.GetAllFilterCategories();
      expect(service.GetAllFilterCategories).toHaveBeenCalled();
    })
  });
  describe('http GetAllFilterCategories',() => {
    it('http GetAllFilterCategories', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.GetAllFilterCategories().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/GetAllFilterCategories");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetAllFileFormats', () =>{
    it('spyOn GetAllFileFormats', () =>{
      spyOn(service, 'GetAllFileFormats').and.callThrough();
      service.GetAllFileFormats();
      expect(service.GetAllFileFormats).toHaveBeenCalled();
    })
  });
  describe('http GetAllFileFormats',() => {
    it('http GetAllFileFormats', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.GetAllFileFormats().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/GetAllFileFormats");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getAllSubDocumentTypes', () =>{
    it('spyOn getAllSubDocumentTypes', () =>{
      spyOn(service, 'getAllSubDocumentTypes').and.callThrough();
      service.getAllSubDocumentTypes();
      expect(service.getAllSubDocumentTypes).toHaveBeenCalled();
    })
  });
  describe('http getAllSubDocumentTypes',() => {
    it('http getAllSubDocumentTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getAllSubDocumentTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/GetAllSubDocumentTypes");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('ChangeFolder', () =>{
    it('spyOn ChangeFolder', () =>{
      let document = 'test';
      spyOn(service, 'ChangeFolder').and.callThrough();
      service.ChangeFolder(document);
      expect(service.ChangeFolder).toHaveBeenCalled();
    })
  });
  describe('getPopularTags', () =>{
    it('spyOn getPopularTags', () =>{
      let foldername = 'test';
      spyOn(service, 'getPopularTags').and.callThrough();
      service.getPopularTags(foldername);
      expect(service.getPopularTags).toHaveBeenCalled();
    })
  });
  describe('http getPopularTags',() => {
    it('http getPopularTags', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let foldername = 'test';
        service.getPopularTags(foldername).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/GetPopularTags?foldername="+foldername);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getAllDocumentStatus', () =>{
    it('spyOn getAllDocumentStatus', () =>{
      spyOn(service, 'getAllDocumentStatus').and.callThrough();
      service.getAllDocumentStatus();
      expect(service.getAllDocumentStatus).toHaveBeenCalled();
    })
  });
  describe('http getAllDocumentStatus',() => {
    it('http getAllDocumentStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getAllDocumentStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/GetDocumentStatus");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getRestrictFileTypes', () =>{
    it('spyOn getRestrictFileTypes', () =>{
      let key = 'test';
      spyOn(service, 'getRestrictFileTypes').and.callThrough();
      service.getRestrictFileTypes(key);
      expect(service.getRestrictFileTypes).toHaveBeenCalled();
    })
  });
  describe('http getRestrictFileTypes',() => {
    it('http getRestrictFileTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let key = 'test';
        service.getRestrictFileTypes(key).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/file/WhitelistedFileExtensions/"+key);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getRepositorySectionDetails', () =>{
    it('spyOn getRepositorySectionDetails', () =>{
      spyOn(service, 'getRepositorySectionDetails').and.callThrough();
      service.getRepositorySectionDetails();
      expect(service.getRepositorySectionDetails).toHaveBeenCalled();
    })
  });
  describe('http getRepositorySectionDetails',() => {
    it('http getRepositorySectionDetails', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getRepositorySectionDetails().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/repository/section-options");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});
