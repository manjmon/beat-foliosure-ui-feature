import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Alert } from "./alter.component";

describe("Alert", () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(() => {
    const elementRefStub = () => ({ nativeElement: { className: {} } });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Alert],
      providers: [{ provide: ElementRef, useFactory: elementRefStub }]
    });
    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
});
