// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { InfoPopupDirective } from './info-popup.directive';

// @Component({
//   template: `
//     <div>Without Directive</div>
//     <div appInfoPopup>Default</div>
//   `
// })
// class TestComponent {}

// describe('InfoPopupDirective', () => {
//   let fixture: ComponentFixture<TestComponent>;
//   let elementsWithDirective: Array<DebugElement>;
//   let bareElement: DebugElement;

//   beforeEach(() => {
//     const elementRefStub = () => ({ nativeElement: { focus: () => ({}) } });
//     TestBed.configureTestingModule({
//       declarations: [InfoPopupDirective, TestComponent]
//     });
//     fixture = TestBed.createComponent(TestComponent);
//     fixture.detectChanges();
//     elementsWithDirective = fixture.debugElement.queryAll(
//       By.directive(InfoPopupDirective)
//     );
//     bareElement = fixture.debugElement.query(By.css(':not([appInfoPopup])'));
//   });

//   it('should have bare element', () => {
//     expect(bareElement).toBeTruthy();
//   });

//   it('should have 1 element(s) with directive', () => {
//     expect(elementsWithDirective.length).toBe(1);
//   });
  
// });
