import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { PortfolioCompanyListComponent } from "./portfolioCompany-list.component";
import { AppSettingService } from "src/app/services/appsettings.service";

describe("PortfolioCompanyListComponent", () => {
  let component: PortfolioCompanyListComponent;
  let fixture: ComponentFixture<PortfolioCompanyListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const appSettingServiceStub = () => ({
      setGetConfig: jasmine.createSpy('setGetConfig').and.returnValue(Promise.resolve(/* your mock return value here */))
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
      ]
    });
    fixture = TestBed.createComponent(PortfolioCompanyListComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("ngOnInit makes expected calls", fakeAsync(() => {
      spyOn(component, "getTabList").and.callThrough();
      component.tabList.push({
        active: true,
        name: "Published"
      });
      component.ngOnInit();
      tick();
      expect(component.getTabList).toHaveBeenCalled();
    }));
  });

  describe("getTabList", () => {
    it("should add 'Published' tab to tabList", () => {
      component.getTabList();
      expect(component.tabList).toContain({
        active: true,
        name: "Published"
      });
    });

    it("should add 'Active Drafts' tab to tabList if IsWorkflowEnable is true", () => {
      component.appConfig= {
        AppName :"Foliosure",    
        DefaultNumberSystem  : 1000000,
        DefaultDateFormat: "mm-dd-yyyy",
        IsWorkflowEnable:false,
        WorkflowDefaultDateFormat: "mm-dd-yyyy"
      };
      component.getTabList();
      expect(component.tabList.length).toEqual(1); 
    });

    it("should set tabName to the name of the first tab in tabList", () => {
      component.getTabList();
      expect(component.tabName).toEqual("Published");
    });
  });

  describe("selectTab", () => {
    it("should deactivate all tabs and activate the selected tab", () => {
      component.tabList = [
        { active: true, name: "Published" },
        { active: false, name: "Active Drafts" }
      ];
      const selectedTab = component.tabList[1];
      component.selectTab(selectedTab);
      expect(component.tabList[0].active).toBe(false);
      expect(component.tabList[1].active).toBe(true);
      expect(component.tabName).toEqual(selectedTab.name);
    });
  });

  describe("changesModelevent", () => {
    it("should select 'Active Drafts' tab if isDraftOpen is true", () => {
      component.tabList = [
        { active: true, name: "Published" },
        { active: false, name: "Active Drafts" }
      ];
      component.changesModelevent(true);
      expect(component.tabList[0].active).toBe(false);
      expect(component.tabList[1].active).toBe(true);
      expect(component.tabName).toEqual("Active Drafts");
    });

    it("should not change the selected tab if isDraftOpen is false", () => {
      component.tabList = [
        { active: true, name: "Published" },
        { active: false, name: "Active Drafts" }
      ];
      component.changesModelevent(false);
      expect(component.tabList[0].active).toBe(true);
      expect(component.tabList[1].active).toBe(false);
    });
  });
});
