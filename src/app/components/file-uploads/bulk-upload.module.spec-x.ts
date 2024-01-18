import { TestBed } from '@angular/core/testing';
import { BulkUploadModule } from './bulk-upload.module';

describe('BulkUploadModule', () => {
  let pipe: BulkUploadModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BulkUploadModule] });
    pipe = TestBed.inject(BulkUploadModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
