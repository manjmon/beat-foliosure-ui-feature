import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Panel } from "./panel.component";

describe("Panel", () => {
  let component: Panel;
  let fixture: ComponentFixture<Panel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Panel]
    });
    fixture = TestBed.createComponent(Panel);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
});
