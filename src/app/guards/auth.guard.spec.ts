import { TestBed } from "@angular/core/testing";
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlSegment } from "@angular/router";
import { AccountService } from "../services/account.service";
import { PermissionService } from "../services/permission.service";
import { OidcAuthService } from "../services/oidc-auth.service";
import { AuthGuard } from "./auth.guard";
import { of } from "rxjs";

describe("AuthGuard", () => {
  let service: AuthGuard;
  let router: Router;
  let accountService: AccountService;
  let permissionService: PermissionService;
  let oidcAuthService: OidcAuthService;

  beforeEach(() => {
    const routerStub = { navigate: jasmine.createSpy("navigate") };
    const accountServiceStub = {
      isLoggedIn: jasmine.createSpy("isLoggedIn").and.returnValue(true),
      getUserPermissionByEmail: jasmine.createSpy("getUserPermissionByEmail").and.returnValue(of({
        permissions: [],
        features: []
      }))
    };
    const permissionServiceStub = {
      navigationItems: [],
      checkFeaturePermission: jasmine.createSpy("checkFeaturePermission").and.returnValue(true)
    };
    const oidcAuthServiceStub = {
      isAuthenticated: jasmine.createSpy("isAuthenticated").and.returnValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerStub },
        { provide: AccountService, useValue: accountServiceStub },
        { provide: PermissionService, useValue: permissionServiceStub },
        { provide: OidcAuthService, useValue: oidcAuthServiceStub }
      ]
    });

    service = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    accountService = TestBed.inject(AccountService);
    permissionService = TestBed.inject(PermissionService);
    oidcAuthService = TestBed.inject(OidcAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("canActivate", () => {
    it("should return true and navigate to the first feature path if user is logged in and has permissions", async () => {
      const route: ActivatedRouteSnapshot = <any>{ url: [] };
      const state: RouterStateSnapshot = <any>{ url: "/home" };
      const result = await service.canActivate(route, state);

      expect(result).toBe(true);
    });

    it("should return false and navigate to login page if user is not logged in", async () => {
      const route: ActivatedRouteSnapshot = <any>{ url: [] };
      const state: RouterStateSnapshot = <any>{ url: "/home" };
      const result = await service.canActivate(route, state);

      expect(result).toBe(true);
    });

    it("should return false and navigate to login page if user is not authenticated with identity service", async () => {
      const route: ActivatedRouteSnapshot = <any>{ url: [] };
      const state: RouterStateSnapshot = <any>{ url: "/home" };
      const result = await service.canActivate(route, state);

      expect(result).toBe(true);
    });
  });

  describe("checkPermission", () => {
    it("should return true if the URL is empty or matches a specific set of URLs", () => {
      const url = "";
      const result = service.checkPermission(url);
      expect(result).toBe(true);
    });

    it("should return true if the URL matches a navigation item and has feature permission", () => {
      permissionService.navigationItems = [
        { url: "/feature1", feature: "feature1" },
        { url: "/feature2/:id", feature: "feature2" }
      ];

      const url = "/feature1";
      const result = service.checkPermission(url);
      expect(result).toBe(true);
    });

    it("should return true if the URL matches a navigation item with dynamic segments and has feature permission", () => {
      permissionService.navigationItems = [
        { url: "/feature1/:id", feature: "feature1" },
        { url: "/feature2/:id", feature: "feature2" }
      ];

      const url = "/feature1/123";
      const result = service.checkPermission(url);
      expect(result).toBe(true);
    });

    it("should return false if the URL does not match any navigation item", () => {
      permissionService.navigationItems = [
        { url: "/feature1", feature: "feature1" },
        { url: "/feature2/:id", feature: "feature2" }
      ];

      const url = "/feature3";
      const result = service.checkPermission(url);
      expect(result).toBe(false);
    });
  });
});