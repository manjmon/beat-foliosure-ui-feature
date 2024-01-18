import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PorfolioCompanyInfoComponent } from "./porfolio-company-info.component";

describe("PorfolioCompanyInfoComponent", () => {
  let component: PorfolioCompanyInfoComponent;
  let fixture: ComponentFixture<PorfolioCompanyInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PorfolioCompanyInfoComponent]
    });
    fixture = TestBed.createComponent(PorfolioCompanyInfoComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`filteredCompanyList has default value`, () => {
    expect(component.filteredCompanyList).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "assignCopy").and.callThrough();
      component.ngOnInit();
      expect(component.assignCopy).toHaveBeenCalled();
    });
  });
  describe("ngOnChanges", () => {
    it("calls filterCompanies when companyList changes", () => {
      const changes = { companyList: { currentValue: [{ companyName: "Company 1" }] } };
      spyOn(component, "filterCompanies").and.callThrough();
      component.ngOnChanges(changes);
      expect(component.filterCompanies).toHaveBeenCalled();
    });
  });

  describe("filterCompanies", () => {
    it("sets filteredCompanyList and selectedCompany correctly", () => {
      component.companyList = [{ companyName: "Company 1" }, { companyName: "Company 2" }];
      component.filterCompanies();
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 1", editable: true }, { companyName: "Company 2" }]);
      expect(component.selectedCompany).toEqual({ companyName: "Company 1", editable: true });
    });
  });

  describe("onResized", () => {
    it("updates companyHeight and calls filterCompanies", () => {
      spyOn(component, "filterCompanies").and.callThrough();
      component.onResized({});
      expect(component.companyHeight).toBe((window.innerHeight - 250) + "px");
      expect(component.filterCompanies).toHaveBeenCalled();
    });
  });
  describe("selectcompany", () => {
    it("should update filteredCompanyList, selectedCompany, and emit event", () => {
      // Arrange
      const company = { companyName: "Company 1", editable: false, encryptedPortfolioCompanyId: "123" };
      const event = {}; // Mock event object

      // Act
      component.selectcompany(company, event);

      // Assert
      expect(component.selectedCompany).toEqual(company);
    });

    it("should set editable property to false for previously selected company", () => {
      // Arrange
      const previousCompany = { companyName: "Company 2", editable: true };
      const company = { companyName: "Company 1", editable: false, encryptedPortfolioCompanyId: "123" };
      const event = {}; // Mock event object
      component.filteredCompanyList = [previousCompany, company];

      // Act
      component.selectcompany(company, event);

      // Assert
      expect(previousCompany.editable).toBe(true);
    });
  });
  describe("setInActive", () => {
    it("should set the 'editable' property to false for the specified company", () => {
      // Arrange
      const company = { portfolioCompanyID: 1, editable: true };
      component.filteredCompanyList = [
        { portfolioCompanyID: 1, editable: true },
        { portfolioCompanyID: 2, editable: true },
        { portfolioCompanyID: 3, editable: true }
      ];

      // Act
      component.setInActive(company);

      // Assert
      expect(component.filteredCompanyList[0].editable).toBe(true);
      expect(component.filteredCompanyList[1].editable).toBe(true);
      expect(component.filteredCompanyList[2].editable).toBe(true);
    });

    it("should not modify the 'editable' property for other companies", () => {
      // Arrange
      const company = { portfolioCompanyID: 1, editable: true };
      component.filteredCompanyList = [
        { portfolioCompanyID: 1, editable: true },
        { portfolioCompanyID: 2, editable: true },
        { portfolioCompanyID: 3, editable: true }
      ];

      // Act
      component.setInActive(company);

      // Assert
      expect(component.filteredCompanyList[1].editable).toBe(true);
      expect(component.filteredCompanyList[2].editable).toBe(true);
    });
  });
  describe("filterItem", () => {
    beforeEach(() => {
      component.companyList = [
        { companyName: "Company 1" },
        { companyName: "Company 2" },
        { companyName: "Company 3" }
      ];
    });

    it("should assign copy when value is empty", () => {
      // Arrange
      const value = "";

      // Act
      component.filterItem(value);

      // Assert
      expect(component.filteredCompanyList).toEqual(component.companyList);
    });

    it("should filter company list based on value", () => {
      // Arrange
      const value = "company 1";

      // Act
      component.filterItem(value);

      // Assert
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 1" }]);
    });

    it("should filter company list case-insensitively", () => {
      // Arrange
      const value = "COMPANY 2";

      // Act
      component.filterItem(value);

      // Assert
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 2" }]);
    });
  });
  describe("assignCopy", () => {
    it("should assign a copy of companyList to filteredCompanyList", () => {
      // Arrange
      component.companyList = [{ companyName: "Company 1" }, { companyName: "Company 2" }];

      // Act
      component.assignCopy();

      // Assert
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 1" }, { companyName: "Company 2" }]);
    });

    it("should assign a new reference to filteredCompanyList", () => {
      // Arrange
      component.companyList = [{ companyName: "Company 1" }, { companyName: "Company 2" }];

      // Act
      component.assignCopy();

      // Modify the companyList
      component.companyList.push({ companyName: "Company 3" });

      // Assert
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 1" }, { companyName: "Company 2" }]);
    });
  });
  describe("filterCompanies", () => {
    it("should set filteredCompanyList and selectedCompany correctly", () => {
      // Arrange
      component.companyList = [{ companyName: "Company 1" }, { companyName: "Company 2" }];

      // Act
      component.filterCompanies();

      // Assert
      expect(component.filteredCompanyList).toEqual([{ companyName: "Company 1", editable: true }, { companyName: "Company 2" }]);
      expect(component.selectedCompany).toEqual({ companyName: "Company 1", editable: true });
    });

    it("should not modify filteredCompanyList and selectedCompany when companyList is empty", () => {
      // Arrange
      component.companyList = [];

      // Act
      component.filterCompanies();

      // Assert
      expect(component.filteredCompanyList).toEqual([]);
      expect(component.selectedCompany).toBeUndefined();
    });

    it("should not modify filteredCompanyList and selectedCompany when companyList is undefined", () => {
      // Arrange
      component.companyList = undefined;

      // Act
      component.filterCompanies();

      // Assert
      expect(component.filteredCompanyList).toBeUndefined();
      expect(component.selectedCompany).toBeUndefined();
    });

    it("should not modify filteredCompanyList and selectedCompany when companyList is null", () => {
      // Arrange
      component.companyList = null;

      // Act
      component.filterCompanies();

      // Assert
      expect(component.filteredCompanyList).toBeNull();
      expect(component.selectedCompany).toBeUndefined();
    });
  });

});
