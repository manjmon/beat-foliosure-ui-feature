import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InvestorDashboardComponent } from "./investorDashboard.component";
import { InvestorService } from '../../../services/investor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
describe("InvestorDashboardComponent", () => {
  let component: InvestorDashboardComponent;
  let fixture: ComponentFixture<InvestorDashboardComponent>;
beforeEach(() => {
  const activatedRouteStub = () => ({ snapshot: { queryParams: {} } });
  TestBed.configureTestingModule({
    imports: [FormsModule,HttpClientTestingModule],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [InvestorDashboardComponent],
    providers: [
      { provide: 'BASE_URL', useValue: 'http://localhost'},
      { provide: InvestorService},
      { provide: ActivatedRoute, useFactory: activatedRouteStub,  useValue: {snapshot: {params: convertToParamMap({id: "1"})}}},
    ]
  });
  fixture = TestBed.createComponent(InvestorDashboardComponent);
  component = fixture.componentInstance;
});


 it('should be created ', () => {
  const fixture = TestBed.createComponent(InvestorDashboardComponent);
  fixture.detectChanges();
  expect(component).toBeTruthy();
 });
 it("can load instance", () => {
  expect(component).toBeTruthy();
});

it(`Unit has default value`, () => {
  expect(component.Unit).toEqual(`M`);
});

it(`Currency has default value`, () => {
  expect(component.Currency).toEqual(`USD`);
});

it(`sectorData has default value`, () => {
  expect(component.sectorData).toEqual([]);
});

it(`headerData has default value`, () => {
  expect(component.headerData).toEqual([]);
});

it(`totalFunds has default value`, () => {
  expect(component.totalFunds).toEqual([]);
});

it(`totalPortfolioCompanies has default value`, () => {
  expect(component.totalPortfolioCompanies).toEqual([]);
});

it(`width has default value`, () => {
  expect(component.width).toEqual(0);
});



it(`isData has default value`, () => {
  expect(component.isData).toEqual(true);
});

it(`pageConfigField has default value`, () => {
  expect(component.pageConfigField).toEqual([]);
});

it(`pageConfigFieldClone has default value`, () => {
  expect(component.pageConfigFieldClone).toEqual([]);
});

it(`topCompanyData has default value`, () => {
  expect(component.topCompanyData).toEqual([]);
});

it(`TVPI has default value`, () => {
  expect(component.TVPI).toEqual(`0.0`);
});

it(`DPI has default value`, () => {
  expect(component.DPI).toEqual(`0.0`);
});

it(`RVPI has default value`, () => {
  expect(component.RVPI).toEqual(`0.0`);
});

describe("ngOnInit", () => {
  it("makes expected calls", () => {
    const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
      InvestorService
    );
    spyOn(investorServiceStub, "getInvestorDashBoard").and.callThrough();
    component.ngOnInit();
    expect(investorServiceStub.getInvestorDashBoard).toHaveBeenCalled();
  });
});
 it("should return data by GetInvestorDashboardDetails", () => {
  spyOn(component, 'loadModelDefault').and.stub();
  let outPutData = [{
    "pageFieldValueModel": [],
    "expandoObject": {},
    "topCompaniesTotalValue": []
  }];
  let inputData1 = {FromDate: '2007-01-01T16:51:08.681Z',ToDate: '2023-03-31T16:51:08.681Z', encryptedInvestorId: '', paginationFilter: null };
  const service : InvestorService = TestBed.inject(InvestorService);
  service.getInvestorDashBoard(inputData1).subscribe((data)=>{
    expect(component.pageConfigField).toEqual([outPutData]);
  })
});
})