import { TestBed } from "@angular/core/testing";
import { PrimeNgModule } from "./prime-ng.module";

describe("PrimeNgModule", () => {
  let pipe: PrimeNgModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PrimeNgModule] });
    pipe = TestBed.inject(PrimeNgModule);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });
});
