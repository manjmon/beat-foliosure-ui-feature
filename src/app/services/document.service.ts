import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class DocumentService {
  myAppUrl: string = "";

  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string,private router: Router) {
    this.myAppUrl = baseUrl;
  }

  getAllDocuments(documentFilters:any) {
    return this.http.post<any>(this.myAppUrl + "api/documents/GetAllDocuments" , documentFilters)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  getFolders() {
    return this.http.get<any>(this.myAppUrl + "api/folder/types").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getAllDocumentTypes(typeid: any) {
    typeid = typeid === null ? 0 : typeid;
    return this.http
      .get<any>(this.myAppUrl + "api/document/types?DocumentTypeId=" + typeid)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  AddDocument(Document: any) {
    return this.http.post<any>(this.myAppUrl + "api/documents", Document).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  VaidateDocExists(document: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/vaidateDocExists", document)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  VaidateBulkDocExists(Document: any) {
    return this.http
      .post<any>(this.myAppUrl + "api/vaidateBulkDocExists", Document)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  UploadFile(file: any) {
    return this.http.post<any>(this.myAppUrl + "api/file", file).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  RequestDownload(id: any) {
    let url = this.myAppUrl + "api/file/" + id;
    return this.http.get(url, {
      responseType: "blob",
      observe: "response",
    });
  }
  getExcelPluginDownload() {
    let url = this.myAppUrl + "api/excel-plugin/download";
    return this.http.get(url, {
      responseType: "blob",
      observe: "response",
    });
}
  downloadFile(response: HttpResponse<Blob>) {
    if (response?.body != null) {
      let file = new Blob([response.body], {
        type: response.headers.get("content-type"),
      });
      // let fileName = response?.headers?
      //   .get("content-disposition")
      //   .replace("attachment; filename=", "");
      // saveAs(file, fileName);
      let fileName = (response === null ? null : response.headers) ?.get("content-disposition")
          .replace("attachment; filename=", "");
      saveAs(file, fileName);
    }
  }
  Suggest(term: string) {
    return this.http.get<any>(this.myAppUrl + "api/suggest?term=" + term).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  DeleteFiles(fileNames: any) {
    return this.http.post<any>(this.myAppUrl + "api/delete", fileNames).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  MoveToRecycleBin(documents: any, isPermanentDelete:boolean = false) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: documents,
    };
    let apiUrl = "api/documents" + (isPermanentDelete ? "?isPermanentDelete=" + isPermanentDelete :"");
    return this.http
      .delete(this.myAppUrl + apiUrl, {
        ...options,
        responseType: "text",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  RestoreDocuments(documents) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    };
    let apiUrl = "api/restore";
    return this.http
      .post(`${this.myAppUrl}${apiUrl}`, documents , {
        ...options,
        responseType: "text",
      })
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    return throwError(error);
  }

  getDocumentByID(docid: any) {
    return this.http.get<any>(this.myAppUrl + "api/document/" + docid).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  UpdatelDocument(id: any, Document: any) {
    return this.http.put<any>(this.myAppUrl + "api/" + id, Document).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  GetAllFilterCategories() {
    return this.http
      .get<any>(this.myAppUrl + "api/GetAllFilterCategories")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  GetAllFileFormats() {
    return this.http.get<any>(this.myAppUrl + "api/GetAllFileFormats").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }


  getAllSubDocumentTypes() {
    return this.http
      .get<any>(this.myAppUrl + "api/GetAllSubDocumentTypes")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }

  ChangeFolder(document) {
    return this.http
      .post<any>(this.myAppUrl + "api/ChangeFolder", document)
      .pipe(
        map((response) => {
        }),
        catchError(err => {
          throw 'error in source. Details: ' + err;
        })
      );
  }

  getPopularTags(foldername) {
    return this.http.get<any>(this.myAppUrl + "api/GetPopularTags?foldername="+foldername).pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  getAllDocumentStatus() {
    return this.http
      .get<any>(this.myAppUrl + "api/GetDocumentStatus")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getRestrictFileTypes(key:string){
   
    return this.http
      .get<any>(this.myAppUrl + "api/file/WhitelistedFileExtensions/"+key)
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
  getRepositorySectionDetails() {
    return this.http
      .get<any>(this.myAppUrl + "api/repository/section-options")
      .pipe(
        map((response) => response),
        catchError(this.errorHandler)
      );
  }
}
