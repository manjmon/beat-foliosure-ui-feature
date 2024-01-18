import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Toast } from "./toast.component";

describe("Toast", () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Toast],
      providers: [{ provide: ElementRef, useFactory: elementRefStub }]
    });
    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`Visible has default value`, () => {
    expect(component.Visible).toEqual(true);
  });
});
