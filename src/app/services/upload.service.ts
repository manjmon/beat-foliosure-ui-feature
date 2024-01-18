import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class UploadService {
    private uploadCompletedSubject = new Subject<void>();

    uploadCompleted$(): Observable<void> {
    return this.uploadCompletedSubject.asObservable();
    }

    notifyUploadCompleted(){
        this.uploadCompletedSubject.next();
    }
}