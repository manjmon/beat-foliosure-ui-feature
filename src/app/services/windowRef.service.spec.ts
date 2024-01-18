import { TestBed } from "@angular/core/testing";
import { WindowRef } from "./windowRef.service";

describe("WindowRef", () => {
  let service: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WindowRef] });
    service = TestBed.get(WindowRef);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
});
