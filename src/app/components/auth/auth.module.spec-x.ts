import { TestBed } from "@angular/core/testing";
import { AuthenticationModule } from "./auth.module";

describe("AuthenticationModule", () => {
  let pipe: AuthenticationModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthenticationModule] });
    pipe = TestBed.inject(AuthenticationModule);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });
});
