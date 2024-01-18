import { TestBed } from '@angular/core/testing';
import { WorkflowGroupAccessModule } from './workflow-group-access.module';

describe('WorkflowGroupAccessModule', () => {
  let pipe: WorkflowGroupAccessModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WorkflowGroupAccessModule] });
    pipe = TestBed.inject(WorkflowGroupAccessModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
