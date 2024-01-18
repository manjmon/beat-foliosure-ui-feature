import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  appUrl: string = "";
constructor(private http: HttpClient,@Inject("BASE_URL") baseUrl: string) {
  this.appUrl = baseUrl;
 }
getNotificationStatus(): Observable<any> {
  const url = `${this.appUrl}api/notification/get`;
  return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError)
    );
}

getNotification(): Observable<Array<any>> {
  const url = `${this.appUrl}api/notification/getmessage`;
  return this.http.get<Array<any>>(url)
    .pipe(
      catchError(this.handleError)
    );
}

createNotification(model:any): Observable<Array<any>> {
  const url = `${this.appUrl}api/notification/create`;
  return this.http.post<Array<any>>(url,model)
    .pipe(
      catchError(this.handleError)
    );
}
clearNotifications(): Observable<{}> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const url = `${this.appUrl}api/notification/delete`;
  return this.http.delete(url, { headers: headers })
    .pipe(
      catchError(this.handleError)
    );
}
clearAllNotifications(): Observable<{}> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const url = `${this.appUrl}api/notification/deleteAll`;
  return this.http.delete(url, { headers: headers })
    .pipe(
      catchError(this.handleError)
    );
}
  updateNotifications(model: any): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.appUrl}api/notification/update`;
    return this.http.put(url, model, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }
private handleError(err) {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
  }
  return throwError(errorMessage);
}
}
