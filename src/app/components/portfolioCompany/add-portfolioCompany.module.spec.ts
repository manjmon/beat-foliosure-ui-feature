import { TestBed } from '@angular/core/testing';
import { AddPCModule } from './add-portfolioCompany.module';

describe('AddPCModule', () => {
  let pipe: AddPCModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AddPCModule] });
    pipe = TestBed.inject(AddPCModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
