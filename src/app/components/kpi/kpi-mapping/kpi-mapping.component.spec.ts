import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { FormsModule } from "@angular/forms";
import { KpiMappingComponent } from "./kpi-mapping.component";

describe("KpiMappingComponent", () => {
  let component: KpiMappingComponent;
  let fixture: ComponentFixture<KpiMappingComponent>;

  beforeEach(() => {
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompany: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KpiMappingComponent],
      providers: [
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        }
      ]
    });
    spyOn(KpiMappingComponent.prototype, "onSelectCompany");
    fixture = TestBed.createComponent(KpiMappingComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`selectedCopyToCompanyList has default value`, () => {
    expect(component.selectedCopyToCompanyList).toEqual([]);
  });

  it(`kpiMappingList has default value`, () => {
    expect(component.kpiMappingList).toEqual([]);
  });

  it(`companyHeight has default value`, () => {
    expect(component.companyHeight).toEqual(430);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`onSelectCompany sets the companyId correctly`, () => {
    const companyId = "123";
    component.companyId = "123";
    component.onSelectCompany(companyId);
    expect(component.companyId).toEqual(companyId);
  });

  it(`OnClear clears the selectedCopyToCompanyList`, () => {
    component.selectedCopyToCompanyList = [1, 2, 3];
    component.OnClear();
    expect(component.selectedCopyToCompanyList).toEqual([]);
  });
});
