import { TestBed } from "@angular/core/testing";
import { UnAuthorizedModule } from "./unauthorizedaccess.module";

describe("UnAuthorizedModule", () => {
  let pipe: UnAuthorizedModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UnAuthorizedModule] });
    pipe = TestBed.inject(UnAuthorizedModule);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });
});
