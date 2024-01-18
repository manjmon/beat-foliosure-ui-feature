import { TestBed } from '@angular/core/testing';
import { ClientReportingModule } from './client-reporting.module';

describe('ClientReportingModule', () => {
  let pipe: ClientReportingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ClientReportingModule] });
    pipe = TestBed.get(ClientReportingModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
