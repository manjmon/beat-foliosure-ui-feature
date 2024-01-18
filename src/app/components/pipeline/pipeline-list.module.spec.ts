import { TestBed } from '@angular/core/testing';
import { PipelineListModule } from './pipeline-list.module';

describe('PipelineListModule', () => {
  let pipe: PipelineListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PipelineListModule] });
    pipe = TestBed.inject(PipelineListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
