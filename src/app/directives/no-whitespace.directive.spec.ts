import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AbstractControl } from '@angular/forms';
import { NoWhitespaceDirective } from './no-whitespace.directive';

@Component({
  template: `
    <div>Without Directive</div>
    <div nfNoSpaces>Default</div>
  `
})
class TestComponent {}

describe('NoWhitespaceDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let bareElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoWhitespaceDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(NoWhitespaceDirective)
    );
    bareElement = fixture.debugElement.query(By.css(':not([nfNoSpaces])'));
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });

  it('should have 1 element(s) with directive', () => {
    expect(elementsWithDirective.length).toBe(1);
  });
});
