import { TestBed } from '@angular/core/testing';
import { LpTemplateConfigurationModule } from './LpTemplateConfiguration.module';

describe('LpTemplateConfigurationModule', () => {
  let pipe: LpTemplateConfigurationModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LpTemplateConfigurationModule]
    });
    pipe = TestBed.inject(LpTemplateConfigurationModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
