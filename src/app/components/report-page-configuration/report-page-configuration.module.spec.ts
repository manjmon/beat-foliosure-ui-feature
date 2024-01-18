import { TestBed } from '@angular/core/testing';
import { PageConfigurationModule } from './report-page-configuration.module';

describe('PageConfigurationModule', () => {
  let pipe: PageConfigurationModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PageConfigurationModule] });
    pipe = TestBed.inject(PageConfigurationModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
