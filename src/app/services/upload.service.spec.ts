import { TestBed } from '@angular/core/testing';
import { UploadService } from './upload.service';
import { Subject } from 'rxjs';

describe('UploadService', () => {
  let service: UploadService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadService] // Provide UploadService here
    });
    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});