// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import {
//   HttpClientTestingModule,
//   HttpTestingController
// } from "@angular/common/http/testing";
// import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
// import { FormsModule } from "@angular/forms";
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { EsgChartComponent } from './esg-chart.component';
// import { of } from 'rxjs';

// describe('EsgChartComponent', () => {
//   let component: EsgChartComponent;
//   let portfolioCompanyService: PortfolioCompanyService;
//   let fixture: ComponentFixture<EsgChartComponent>;

//   beforeEach(() => {
//     const portfolioCompanyServiceStub = {
//       getPortfolioCompany: () => of([]),
//       getPortfolioCompanyById: () => of({ body: { companyDetails: {} }, code: "OK" })
//     };
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [EsgChartComponent],
//       providers:[EsgChartComponent,
//         { provide: PortfolioCompanyService, useValue: portfolioCompanyServiceStub },
//         { provide: 'BASE_URL', useValue: 'http://localhost'}
//       ]
//     });
//     fixture = TestBed.createComponent(EsgChartComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
