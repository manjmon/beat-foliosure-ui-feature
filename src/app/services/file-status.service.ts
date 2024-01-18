import { HttpClient} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileStatusService {
  appUrl: string = "";
  private fileStatusNavOpened = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.appUrl = baseUrl;
  }

  setFileStatusNavOpened(flag: boolean) {
    this.fileStatusNavOpened.next(flag);
  }
  getFileStatusNavOpened() {
    return this.fileStatusNavOpened.asObservable();
  }

  getFileStatus(): Observable<Array<any>> {
    const url = `${this.appUrl}api/fileuploadstatus`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  cancelFile(id): Observable<Array<any>> {
      const url = `${this.appUrl}api/delete-file/`+ id;
      return this.http.delete<any>(url)
        .pipe(
          catchError(this.handleError)
        );
    }


  getFileErrorStatus(fileId:string):any{
    const url=`${this.appUrl}api/fileuploaderrorlist/${fileId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getAllFileErrorStatus():any{
    const url=`${this.appUrl}api/getallfileuploaderror`;
    return this.http.get<any>(url).pipe(catchError(this.handleError))
  }
  
  clearALlFileStatus(): Observable<any> {
    const url = `${this.appUrl}api/filestatus/clearall`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err?.error?.message}`;
    } else {
      errorMessage = `Backend returned code ${err?.status}: ${err?.body?.error}`;
    }
    return throwError(errorMessage);
  }
}
