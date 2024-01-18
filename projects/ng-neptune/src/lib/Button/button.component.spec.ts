import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Button } from "./button.component";

describe("Button", () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Button]
    });
    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`disabled has default value`, () => {
    expect(component.disabled).toEqual(false);
  });
});
