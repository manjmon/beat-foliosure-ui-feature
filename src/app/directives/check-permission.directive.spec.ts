import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CheckPermissionDirective } from "./check-permission.directive";
import { PermissionService } from "../services/permission.service";
import { of } from "rxjs";

@Component({
  template: `
    <div>Without Directive</div>
    <div hideIfUnauthorized>Default</div>
  `
})
class TestComponent {}

describe("CheckPermissionDirective", () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let bareElement: DebugElement;
  const permissionerviceStub = () => ({
    checkFeaturePermission: jasmine.createSpy('GetToCurrenciesByFromCurrency').and.returnValue(of({})),
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckPermissionDirective, TestComponent],
      providers: [        { provide: PermissionService, useFactory: permissionerviceStub }] 
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(CheckPermissionDirective)
    );
    bareElement = fixture.debugElement.query(By.css(":not([hideIfUnauthorized])"));
  });

  it("should have bare element", () => {
    expect(bareElement).toBeTruthy();
  });

  it("should have 1 element(s) with directive", () => {
    expect(elementsWithDirective.length).toBe(1);
  });
});
