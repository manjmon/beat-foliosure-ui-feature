// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { EquityValueComponent } from './equity-value.component';
// import { ImpliedEvService } from "src/app/services/implied-ev.service";
// import { ValuationModelService } from "src/app/services/valuation-model.service"
// import { of } from 'rxjs';
// import { ValuationCalclation } from '../../../shared/valuation-calculation';
// fdescribe('EquityValueComponent', () => {
//   let component: EquityValueComponent;
//   let fixture: ComponentFixture<EquityValueComponent>;
//   let impliedEvServiceSpy: jasmine.SpyObj<ImpliedEvService>;
//   let valuationModelServiceSpy: jasmine.SpyObj<ValuationModelService>;
//   const impliedEvService = () => ({
//     getInternalSelectedTabName:fund => ({ subscribe: f => f({}) }),
//   });
//   beforeEach(async () => {
//     const impliedEvService = jasmine.createSpyObj('ImpliedEvService', ['getEquityValue', 'getdropdownValues', 'getInternalSelectedTabName']);
//     const valuationModelService = jasmine.createSpyObj('ValuationModelService', ['setRedirectionStatus']);
//     await TestBed.configureTestingModule({
//       declarations: [ EquityValueComponent ],
//       providers: [
//         { provide: ImpliedEvService, useValue: impliedEvService },
//         { provide: ValuationModelService, useValue: valuationModelService }
//         { provide: ImpliedEvService, useFactory: impliedEvService },

//       ]
//     })
//     fixture = TestBed.createComponent(EquityValueComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     impliedEvServiceSpy = TestBed.inject(ImpliedEvService) as jasmine.SpyObj<ImpliedEvService>;
//     valuationModelServiceSpy = TestBed.inject(ValuationModelService) as jasmine.SpyObj<ValuationModelService>;
//   });
//   beforeEach(() => {
   
//   });
  
//   it(`canDeactivateStatus has default value`, () => {
//     expect(component.canDeactivateStatus).toEqual(true);
//   });
// });