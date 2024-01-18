// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef,ElementRef } from '@angular/core';
// import { ClientReportTabs } from './client-report-tab';
// import { SelectButtonModule } from 'primeng/selectbutton'; // Import the necessary module

// fdescribe('ClientReportTabs', () => {
//   let component: ClientReportTabs;
//   let fixture: ComponentFixture<ClientReportTabs>;
//   let mockElementRef: any;
//   let mockChangeDetectorRef: any;

//   beforeEach(async () => {
//     mockElementRef = {
//       nativeElement: {
//         scrollWidth: 1000,
//         offsetWidth: 500,
//         scrollLeft: 0,
//         scrollTo: jasmine.createSpy('scrollTo'),
//       },
//     };
//     mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     await TestBed.configureTestingModule({
//       declarations: [ ClientReportTabs ],
//       providers: [
//         { provide: ElementRef, useValue: mockElementRef },
//         { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
//       ],
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ClientReportTabs);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//   beforeEach(async () => {
//     mockElementRef = {
//       nativeElement: {
//         scrollWidth: 1000,
//         offsetWidth: 500,
//         scrollLeft: 0,
//         scrollTo: jasmine.createSpy('scrollTo'),
//       },
//     };
//     mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     await TestBed.configureTestingModule({
//       declarations: [ ClientReportTabs ],
//       imports: [ SelectButtonModule ], // Add the module to the imports array
//       providers: [
//         { provide: ElementRef, useValue: mockElementRef },
//         { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
//       ],
//     })
//     .compileComponents();
//   });
// });
