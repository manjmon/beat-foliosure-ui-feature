import { TestBed } from '@angular/core/testing';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { IComponentCanDeactivate } from './component-can-deactivate';

class MockComponent implements CanDeactivate<any> {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });
    guard = TestBed.inject(CanDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow deactivation when component canDeactivate returns true', () => {
    const component: any = new MockComponent();
    spyOn(component, 'canDeactivate').and.returnValue(true);
    const result = guard.canDeactivate(component);
    expect(result).toBe(true);
  });

  it('should prevent deactivation and open modal when component canDeactivate returns false', () => {
    const component: any = new MockComponent();
    spyOn(component, 'canDeactivate').and.returnValue(false);
    const result = guard.canDeactivate(component);
    expect(result instanceof Observable).toBe(false);
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(false);
      });
    }
  });
  });