import { TestBed } from '@angular/core/testing';
import { PCDetailModule } from './portfolioCompany-detail.module';

describe('PCDetailModule', () => {
  let pipe: PCDetailModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PCDetailModule] });
    pipe = TestBed.inject(PCDetailModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
