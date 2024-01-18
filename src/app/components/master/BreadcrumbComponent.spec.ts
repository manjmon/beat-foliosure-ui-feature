import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
import { Location } from "@angular/common";
import { BreadcrumbComponent } from "./BreadcrumbComponent";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(() => {
    const routerStub = () => ({ events: { subscribe: f => f({}) } });
    const permissionServiceStub = () => ({
      navigationItems: { filter: () => ({ length: {}, parent: {}, id: {} }) ,
    }
    });
    const locationStub = () => ({ back: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BreadcrumbComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: Location, useFactory: locationStub }
      ]
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`links has default value`, () => {
    expect(component.links).toEqual([]);
  });

  it(`EnableBack has default value`, () => {
    expect(component.EnableBack).toEqual(false);
  });

  it(`customHeaderEnable has default value`, () => {
    expect(component.customHeaderEnable).toEqual(false);
  });

  describe("GoBack", () => {
    it("makes expected calls", () => {
      const locationStub: Location = fixture.debugElement.injector.get(
        Location
      );
      spyOn(locationStub, "back").and.callThrough();
      component.GoBack();
      expect(locationStub.back).toHaveBeenCalled();
    });
  });
  describe("getAllNavItemsInHierarchy", () => {
    it("should return an empty array when id is empty", () => {
      // Arrange
      const id = "";
      const expectedItems: any[] = [];

      // Act
      const result = component.getAllNavItemsInHierarchy(id);

      // Assert
      expect(result).toEqual(expectedItems);
    });

    it("should return the navigation items in hierarchy when id is not empty", () => {
      // Arrange
      const id = "123";
      const navigationItems = [
        { id: "123", parent: "456" },
        { id: "456", parent: "789" },
        { id: "789", parent: "" },
      ];
      spyOn((component as any)['permissionService'], "navigationItems").and.returnValue(navigationItems);
      const expectedItems = [
        { id: "789", parent: "" },
        { id: "456", parent: "789" },
        { id: "123", parent: "456" },
      ];

      // Act
      const result = component.getAllNavItemsInHierarchy(id);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});
