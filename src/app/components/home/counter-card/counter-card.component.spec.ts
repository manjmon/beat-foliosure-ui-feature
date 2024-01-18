import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CounterCardComponent } from "./counter-card.component";

describe("CounterCardComponent", () => {
  let component: CounterCardComponent;
  let fixture: ComponentFixture<CounterCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CounterCardComponent]
    });
    fixture = TestBed.createComponent(CounterCardComponent);
    component = fixture.componentInstance;
  });

  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });

  it("should have Item input property", () => {
    const item = "Test Item";
    component.Item = item;
    expect(component.Item).toEqual(item);
  });

  it("should have Value input property", () => {
    const value = "Test Value";
    component.Value = value;
    expect(component.Value).toEqual(value);
  });

  it("should have Unit input property", () => {
    const unit = "Test Unit";
    component.Unit = unit;
    expect(component.Unit).toEqual(unit);
  });

  it("should have Currency input property", () => {
    const currency = "Test Currency";
    component.Currency = currency;
    expect(component.Currency).toEqual(currency);
  });
});
