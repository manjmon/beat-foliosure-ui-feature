import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CheckUserPermissionDirective } from './CheckUserPermission.directive';
import { of } from 'rxjs';
import { PermissionService } from '../services/permission.service';

@Component({
  template: `
    <div>Without Directive</div>
    <div hideIfUserUnAuthorized>Default</div>
  `
})
class TestComponent {}

describe('CheckUserPermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: Array<DebugElement>;
  let bareElement: DebugElement;
  const permissionerviceStub = () => ({
    checkUserPermission: jasmine.createSpy('checkUserPermission').and.returnValue(of({})),
  });
  beforeEach(() => {
    const elementRefStub = () => ({ nativeElement: { focus: () => ({}) } });
    TestBed.configureTestingModule({
      declarations: [CheckUserPermissionDirective, TestComponent],
      providers: [        { provide: PermissionService, useFactory: permissionerviceStub }] 
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(CheckUserPermissionDirective)
    );
    bareElement = fixture.debugElement.query(By.css(':not([hideIfUserUnAuthorized])'));
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });

  it('should have 1 element(s) with directive', () => {
    expect(elementsWithDirective.length).toBe(1);
  });
  
});
